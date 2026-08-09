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
  qtdPagos: number;
  qtdPendentePagamento: number;
  porcentagemConcluida: number;
  podeExecutarNovos: boolean;
  podeEmitirNfParcial: boolean;
  podeFinalizarPagamento: boolean;
  isOsFinalizada: boolean;
}

/**
 * Formata o código da Ordem de Serviço estritamente no padrão YYYYMMDD_HHmm (ou YYYYMMDD_HHmm_N se informado o item).
 */
export function formatOsCode(
  request?: {
    createdAt?: Date | string | null;
    paymentConfirmedAt?: Date | string | null;
    clientPaymentConfirmedAt?: Date | string | null;
  } | null,
  itemNum?: number | string | null
): string {
  if (!request) return '';
  const refDateStr = request.clientPaymentConfirmedAt || request.paymentConfirmedAt || request.createdAt;
  const refDate = refDateStr ? new Date(refDateStr) : new Date();

  const YYYY = refDate.getFullYear();
  const MM = String(refDate.getMonth() + 1).padStart(2, '0');
  const DD = String(refDate.getDate()).padStart(2, '0');
  const HH = String(refDate.getHours()).padStart(2, '0');
  const mm = String(refDate.getMinutes()).padStart(2, '0');

  const baseCode = `${YYYY}${MM}${DD}_${HH}${mm}`;
  if (itemNum !== undefined && itemNum !== null && itemNum !== '') {
    return `${baseCode}_${itemNum}`;
  }
  return baseCode;
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
 * Anexa um novo relatório enviado ao próximo item de execução disponível da OS Mãe.
 * Isso garante que múltiplos relatórios parciais sejam armazenados individualmente sem sobrescrever os anteriores.
 */
export async function attachReportToExecutionItem(
  requestId: string,
  reportPdfUrl: string,
  reportNumber?: string | null
) {
  if (!reportPdfUrl || reportPdfUrl.startsWith('/api/')) return;

  const items = await ensureExecutionItemsCreated(requestId);

  // Procurar o primeiro item que ainda não possui reportPdfUrl
  let targetItem = items.find(
    (item) => !item.reportPdfUrl || item.reportPdfUrl.trim() === ''
  );

  // Se todos já tiverem reportPdfUrl, busca o item que esteja EM_EXECUCAO ou usa o último
  if (!targetItem) {
    targetItem = items.find((item) => item.statusExecucao === 'EM_EXECUCAO') || items[items.length - 1];
  }

  if (targetItem) {
    await prisma.testExecutionItem.update({
      where: { id: targetItem.id },
      data: {
        reportPdfUrl,
        reportNumber: reportNumber || targetItem.reportNumber || `REL-${targetItem.numeroSequencial}`,
        statusExecucao: 'CONCLUIDO',
        statusEntrega: 'ENVIADO_AO_CLIENTE',
        dataEnvioRelatorio: new Date(),
        dataExecucao: targetItem.dataExecucao || new Date(),
      },
    });
  }
}

/**
 * Calcula o saldo detalhado em tempo real para uma OS Mãe.
 */
export async function calculateOsBalance(requestId: string): Promise<OsBalanceSummary> {
  const request = await prisma.testRequest.findUnique({
    where: { id: requestId },
    include: {
      executionItems: { orderBy: { numeroSequencial: 'asc' } },
      partialInvoices: { orderBy: { createdAt: 'desc' } },
      satisfactionSurvey: true,
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

  // Migração/Sincronização automática para OSs que possuem reportPdfUrl principal mas nenhum item atualizado
  if (request.reportPdfUrl && !request.reportPdfUrl.startsWith('/api/') && !items.some((i) => Boolean(i.reportPdfUrl))) {
    if (items[0]) {
      await prisma.testExecutionItem.update({
        where: { id: items[0].id },
        data: {
          reportPdfUrl: request.reportPdfUrl,
          reportNumber: request.reportNumber || 'REL-01',
          statusExecucao: 'CONCLUIDO',
          statusEntrega: 'ENVIADO_AO_CLIENTE',
          dataEnvioRelatorio: new Date(),
        },
      });
      items[0].reportPdfUrl = request.reportPdfUrl;
      items[0].reportNumber = request.reportNumber || 'REL-01';
      items[0].statusExecucao = 'CONCLUIDO';
      items[0].statusEntrega = 'ENVIADO_AO_CLIENTE';
    }
  }

  const qtdContratada = Math.max(request.qtdContratada || 1, items.length);

  const qtdExecutada = items.filter(
    (item) => item.statusExecucao === 'CONCLUIDO' || item.statusExecucao === 'APROVADO' || Boolean(item.reportPdfUrl)
  ).length;

  const qtdEntregueCalc = items.filter(
    (item) => item.statusEntrega === 'ENVIADO_AO_CLIENTE' || item.statusExecucao === 'CONCLUIDO' || item.statusExecucao === 'APROVADO' || Boolean(item.reportPdfUrl)
  ).length;

  const qtdEntregue = qtdEntregueCalc > 0 ? qtdEntregueCalc : (request.reportPdfUrl ? 1 : 0);

  const qtdFaturadaCalc = request.partialInvoices.reduce(
    (acc, inv) => acc + (inv.qtdFaturada || 1),
    0
  );
  const qtdFaturada = qtdFaturadaCalc > 0 ? qtdFaturadaCalc : (request.invoicePdfUrl ? 1 : 0);

  const qtdPagosCalc = items.filter(
    (item) => item.statusPagamento === 'PAGO'
  ).length;

  // Removida auto-quitação legado genérica para depender da baixa por item pelo colaborador
  const legacyPaid = 0;
  const qtdPagos = Math.min(qtdContratada, qtdPagosCalc);

  const qtdPendenteExecucao = Math.max(0, qtdContratada - qtdExecutada);
  const qtdPendenteEntrega = Math.max(0, qtdContratada - qtdEntregue);
  const qtdPendenteFaturamento = Math.max(0, qtdExecutada - qtdFaturada);
  const qtdPendentePagamento = Math.max(0, qtdContratada - qtdPagos);

  const porcentagemConcluida = Math.min(100, Math.round((qtdEntregue / qtdContratada) * 100));
  const podeExecutarNovos = qtdExecutada < qtdContratada;
  const podeEmitirNfParcial = qtdPendenteFaturamento > 0;
  const podeFinalizarPagamento = qtdPagos >= qtdContratada;
  
  // O processo só é finalizado se TODOS os ensaios forem concluídos/entregues E a pesquisa de satisfação for respondida pelo cliente
  const isSurveyCompleted = request.satisfactionSurvey?.status === 'COMPLETED' || request.satisfactionSurvey?.status === 'REVIEWED';
  const isTodosEnsaiosEntregues = qtdEntregue >= qtdContratada && qtdExecutada >= qtdContratada;
  const isOsFinalizada = isTodosEnsaiosEntregues && isSurveyCompleted;

  return {
    requestId,
    qtdContratada,
    qtdExecutada,
    qtdEntregue,
    qtdPendenteExecucao,
    qtdPendenteEntrega,
    qtdFaturada,
    qtdPendenteFaturamento,
    qtdPagos,
    qtdPendentePagamento,
    porcentagemConcluida,
    podeExecutarNovos,
    podeEmitirNfParcial,
    podeFinalizarPagamento,
    isOsFinalizada,
  };
}

/**
 * Atualiza automaticamente o status da OS Mãe de acordo com a conclusão e entrega de laudos.
 * Só encerra (status = FINALIZADO) quando todos os laudos foram entregues ao cliente E a pesquisa de satisfação respondida.
 */
export async function updateOsStatusBasedOnBalance(requestId: string): Promise<string> {
  const request = await prisma.testRequest.findUnique({
    where: { id: requestId },
    include: { executionItems: true, partialInvoices: true, satisfactionSurvey: true },
  });

  if (!request) return 'RECEBIDO';

  const balance = await calculateOsBalance(requestId);

  const isSurveyCompleted = request.satisfactionSurvey?.status === 'COMPLETED' || request.satisfactionSurvey?.status === 'REVIEWED';
  const isTodosEnsaiosEntregues = balance.qtdEntregue >= balance.qtdContratada && balance.qtdExecutada >= balance.qtdContratada;

  // 1. Se a OS cumpriu todos os critérios (todos ensaios entregues E pesquisa respondida), a OS é FINALIZADA
  if (balance.isOsFinalizada) {
    if (request.status !== 'FINALIZADO') {
      await prisma.testRequest.update({
        where: { id: requestId },
        data: { status: 'FINALIZADO' },
      });
    }
    return 'FINALIZADO';
  }

  // 2. Se todos os ensaios foram entregues mas a pesquisa de satisfação está pendente
  if (isTodosEnsaiosEntregues && !isSurveyCompleted) {
    if (request.status !== 'PESQUISA_PENDENTE') {
      await prisma.testRequest.update({
        where: { id: requestId },
        data: { status: 'PESQUISA_PENDENTE' },
      });
    }
    return 'PESQUISA_PENDENTE';
  }

  // 3. Se a OS está ativamente em uma etapa avançada do fluxo (Elaborando Relatório, Aprovando, Cobrança, Pagamento, Aceite), PRESERVA este status!
  if (
    request.status === 'ELABORANDO_RELATORIO' ||
    request.status === 'AGUARDANDO_APROVACAO' ||
    request.status === 'COBRANCA' ||
    request.status === 'PAGAMENTO' ||
    request.status === 'AGUARDANDO_ACEITE'
  ) {
    return request.status;
  }

  // 4. Caso contrário, define o status de acordo com itens em execução ou agendados
  const hasItemsInExecution = request.executionItems.some((item) => item.statusExecucao === 'EM_EXECUCAO');
  const hasScheduledItem = request.executionItems.some((item) => item.statusExecucao === 'AGENDADO');

  let newStatus: string;
  if (hasItemsInExecution || request.status === 'EM_EXECUCAO') {
    newStatus = 'EM_EXECUCAO';
  } else if (hasScheduledItem || request.status === 'AGUARDANDO_AGENDAMENTO') {
    newStatus = 'AGUARDANDO_AGENDAMENTO';
  } else if (balance.qtdExecutada > 0 || balance.qtdEntregue > 0) {
    newStatus = 'EM_EXECUCAO';
  } else {
    newStatus = 'RECEBIDO';
  }

  if (request.status !== newStatus) {
    await prisma.testRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
    });
  }

  return newStatus;
}
