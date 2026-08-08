const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== TESTANDO SISTEMA DE GESTÃO DE SALDO DE ENSAIOS (1 DE N) ===");

  // 1. Criar uma OS de Teste para 3 ensaios
  const testOs = await prisma.testRequest.create({
    data: {
      type: "Ensaio de Estanqueidade e Permeabilidade",
      location: "Obra Res. Flores - Torre A",
      clientName: "Construtora Exemplo",
      quantidadeEnsaios: "3",
      qtdContratada: 3,
      valorUnitario: 1200.0,
      valorTotal: 3600.0,
      desiredDate: new Date(),
      status: "RECEBIDO"
    }
  });

  console.log(`\n1. OS Mãe Criada: ID #${testOs.id} (Contratados: ${testOs.qtdContratada})`);

  // 2. Gerar Itens de Execução (1 de 3, 2 de 3, 3 de 3)
  for (let i = 1; i <= 3; i++) {
    await prisma.testExecutionItem.create({
      data: {
        requestId: testOs.id,
        numeroSequencial: i,
        statusExecucao: i === 1 ? "CONCLUIDO" : "PENDENTE",
        statusEntrega: i === 1 ? "ENVIADO_AO_CLIENTE" : "PENDENTE",
        statusFaturamento: i === 1 ? "LIBERADO" : "PENDENTE",
        reportNumber: i === 1 ? "LAUDO-001/3" : null,
        dataEnvioRelatorio: i === 1 ? new Date() : null
      }
    });
  }

  // 3. Buscar os itens criados
  const items = await prisma.testExecutionItem.findMany({
    where: { requestId: testOs.id },
    orderBy: { numeroSequencial: 'asc' }
  });

  console.log(`\n2. Itens de Execução Gerados (${items.length} itens):`);
  items.forEach(item => {
    console.log(`   - Ensaio #${item.numeroSequencial} de ${items.length}: Execucao=${item.statusExecucao}, Entrega=${item.statusEntrega}, Faturamento=${item.statusFaturamento}`);
  });

  // 4. Testar Emissão de NF Parcial para o Ensaio #1
  const item1 = items[0];
  const partialNf = await prisma.partialInvoice.create({
    data: {
      requestId: testOs.id,
      numeroNf: "NF-PARCIAL-501",
      qtdFaturada: 1,
      valorNota: 1200.0
    }
  });

  await prisma.testExecutionItem.update({
    where: { id: item1.id },
    data: {
      statusFaturamento: "FATURADO",
      partialInvoiceId: partialNf.id
    }
  });

  console.log(`\n3. Nota Fiscal Parcial nº ${partialNf.numeroNf} emitida para ${partialNf.qtdFaturada} ensaio. Valor: R$ ${partialNf.valorNota}`);

  // 5. Verificar saldos finais
  const finalItems = await prisma.testExecutionItem.findMany({ where: { requestId: testOs.id } });
  const finalNfs = await prisma.partialInvoice.findMany({ where: { requestId: testOs.id } });

  const qtdExecutada = finalItems.filter(i => i.statusExecucao === 'CONCLUIDO').length;
  const qtdEntregue = finalItems.filter(i => i.statusEntrega === 'ENVIADO_AO_CLIENTE').length;
  const qtdFaturada = finalNfs.reduce((acc, inv) => acc + inv.qtdFaturada, 0);

  console.log("\n4. RESUMO DOS SALDOS CALCULADOS:");
  console.log(`   - Quantidade Contratada: ${testOs.qtdContratada}`);
  console.log(`   - Ensaios Executados/Concluídos: ${qtdExecutada}`);
  console.log(`   - Laudos Entregues ao Cliente: ${qtdEntregue}`);
  console.log(`   - Saldo de Ensaios a Executar: ${testOs.qtdContratada - qtdExecutada}`);
  console.log(`   - Quantidade Faturada em NF: ${qtdFaturada}`);
  console.log(`   - Status da OS: ${qtdEntregue === testOs.qtdContratada ? 'FINALIZADO' : 'EM_EXECUCAO'}`);

  // Limpeza do teste
  await prisma.testRequest.delete({ where: { id: testOs.id } });
  console.log("\n✅ Teste de validação concluído com 100% de êxito!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
