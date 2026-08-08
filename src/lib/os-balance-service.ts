import prisma from '@/lib/prisma';

export interface OsBalanceSummary {
  requestId: string;
  qtdContratada: number;
  qtdExecutada: number;
  qtdEntregue: number;
  qtdPendenteExecucao: number;
  qtdPendenteEntrega: number;
  qtdFaturada: number;
  qtdPendenteFaturamento: number;
  porcentagemConcluida: number;
  podeExecutarNovos: boolean;
  podeEmitirNfParcial: boolean;
  isOsFinalizada: boolean;
}

/**
 * Extrai a quantidade numérica de ensaios a partir da string cadastrada no pedido (ex: "10 ensaios", "5", "1")
 */
export function parseQuantidadeEnsaios(qtdStr?: string | null): number {
  if (!qtdStr) return 1;
  const match = qtdStr.match(/\d+/);
  if (match) {
    const val = parseInt(match[0], 10);
    return val > 0 ? val : 1;
  }
  return 1;
}

/**
 * Garante que existam os N itens de execução criados para uma OS Mãe.
 */
export async function ensureExecutionItemsCreated(requestId: string, quantidadeStr?: string | null) {
  const targetQuantity = parseQuantidadeEnsaios(quantidadeStr);

  // Buscar itens já existentes
  const existingItems = await prisma.testExecutionItem.findMany({
    where: { requestId },
    include: { partialInvoice: true },
    orderBy: { numeroSequencial: 'asc' },
  });

  // Atualizar a quantidade contratada na OS Mãe se necessário
  await prisma.testRequest.update({
    where: { id: requestId },
    data: { qtdContratada: targetQuantity },
  });

  if (existingItems.length >= targetQuantity) {
    return existingItems;
  }

  // Criar os itens faltantes (de existingItems.length + 1 até targetQuantity)
  const newItemsData = [];
  for (let i = existingItems.length + 1; i <= targetQuantity; i++) {
    newItemsData.push({
      requestId,
      numeroSequencial: i,
      statusExecucao: 'PENDENTE',
      statusFaturamento: 'PENDENTE',
      statusEntrega: 'PENDENTE',
    });
  }

  if (newItemsData.length > 0) {
    await prisma.testExecutionItem.createMany({
      data: newItemsData,
    });
  }

  return await prisma.testExecutionItem.findMany({
    where: { requestId },
    include: { partialInvoice: true },
    orderBy: { numeroSequencial: 'asc' },
  });
}

/**
 * Calcula o saldo detalhado em tempo real para uma OS Mãe.
 */
export async function calculateOsBalance(requestId: string): Promise<OsBalanceSummary> {
  const request = await prisma.testRequest.findUnique({
    where: { id: requestId },
    include: {
      executionItems: true,
      partialInvoices: true,
    },
  });

  if (!request) {
    throw new Error(`OS Mãe com ID ${requestId} não foi encontrada.`);
  }

  // Se ainda não existirem itens de execução, cria automaticamente com base na quantidadeEnsaios
  let items = request.executionItems;
  if (items.length === 0) {
    items = await ensureExecutionItemsCreated(requestId, request.quantidadeEnsaios);
  }

  const qtdContratada = Math.max(request.qtdContratada || 1, items.length);

  const qtdExecutada = items.filter(
    (item) => item.statusExecucao === 'CONCLUIDO' || item.statusExecucao === 'APROVADO'
  ).length;

  const qtdEntregue = items.filter(
    (item) => item.statusEntrega === 'ENVIADO_AO_CLIENTE'
  ).length;

  const qtdFaturada = request.partialInvoices.reduce(
    (acc, inv) => acc + (inv.qtdFaturada || 1),
    0
  );

  const qtdPendenteExecucao = Math.max(0, qtdContratada - qtdExecutada);
  const qtdPendenteEntrega = Math.max(0, qtdContratada - qtdEntregue);
  const qtdPendenteFaturamento = Math.max(0, qtdExecutada - qtdFaturada);

  const porcentagemConcluida = Math.min(100, Math.round((qtdEntregue / qtdContratada) * 100));
  const podeExecutarNovos = qtdExecutada < qtdContratada;
  const podeEmitirNfParcial = qtdPendenteFaturamento > 0;
  const isOsFinalizada = qtdEntregue >= qtdContratada;

  return {
    requestId,
    qtdContratada,
    qtdExecutada,
    qtdEntregue,
    qtdPendenteExecucao,
    qtdPendenteEntrega,
    qtdFaturada,
    qtdPendenteFaturamento,
    porcentagemConcluida,
    podeExecutarNovos,
    podeEmitirNfParcial,
    isOsFinalizada,
  };
}

/**
 * Atualiza automaticamente o status da OS Mãe de acordo com a conclusão e entrega de laudos.
 * Só encerra (status = FINALIZADO) quando todos os laudos foram entregues ao cliente.
 */
export async function updateOsStatusBasedOnBalance(requestId: string): Promise<string> {
  const balance = await calculateOsBalance(requestId);

  let newStatus: string;
  if (balance.isOsFinalizada) {
    newStatus = 'FINALIZADO';
  } else if (balance.qtdExecutada > 0 || balance.qtdEntregue > 0) {
    newStatus = 'EM_EXECUCAO';
  } else {
    newStatus = 'RECEBIDO';
  }

  const currentRequest = await prisma.testRequest.findUnique({
    where: { id: requestId },
    select: { status: true },
  });

  if (currentRequest && currentRequest.status !== newStatus) {
    await prisma.testRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
    });
  }

  return newStatus;
}
