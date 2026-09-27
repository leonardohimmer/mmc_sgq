const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log(' INICIANDO LIMPEZA DOS DADOS DE ENSAIOS DO SISTEMA  ');
  console.log(' (Sistema de Clientes e Sistema de Colaboradores)   ');
  console.log('====================================================\n');

  // 1. Coletar dados para backup
  console.log('1. Realizando backup dos dados antes da exclusão...');
  const [
    testRequests,
    executionItems,
    partialInvoices,
    requestHistories,
    satisfactionSurveys,
    orcamentos
  ] = await Promise.all([
    prisma.testRequest.findMany(),
    prisma.testExecutionItem.findMany(),
    prisma.partialInvoice.findMany(),
    prisma.testRequestHistory.findMany(),
    prisma.satisfactionSurvey.findMany(),
    prisma.orcamento.findMany()
  ]);

  const backupData = {
    timestamp: new Date().toISOString(),
    counts: {
      testRequests: testRequests.length,
      executionItems: executionItems.length,
      partialInvoices: partialInvoices.length,
      requestHistories: requestHistories.length,
      satisfactionSurveys: satisfactionSurveys.length,
      orcamentos: orcamentos.length
    },
    data: {
      testRequests,
      executionItems,
      partialInvoices,
      requestHistories,
      satisfactionSurveys,
      orcamentos
    }
  };

  const backupsDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const backupFilename = `backup-ensaios-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const backupPath = path.join(backupsDir, backupFilename);
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
  console.log(`✅ Backup salvo com sucesso em: ${backupPath}\n`);

  // 2. Executar limpeza em transação respeitando as chaves estrangeiras
  console.log('2. Excluindo dados de ensaios do banco de dados...');
  const result = await prisma.$transaction([
    prisma.satisfactionSurvey.deleteMany({}),
    prisma.testExecutionItem.deleteMany({}),
    prisma.partialInvoice.deleteMany({}),
    prisma.testRequestHistory.deleteMany({}),
    prisma.testRequest.deleteMany({}),
    prisma.orcamento.deleteMany({})
  ]);

  console.log('\n--- RELATÓRIO DE REGISTROS REMOVIDOS ---');
  console.log(`• Pesquisas de Satisfação (SatisfactionSurvey): ${result[0].count}`);
  console.log(`• Itens de Execução de Ensaio (TestExecutionItem): ${result[1].count}`);
  console.log(`• Faturas Parciais de Ensaio (PartialInvoice): ${result[2].count}`);
  console.log(`• Histórico de Ensaios (TestRequestHistory): ${result[3].count}`);
  console.log(`• Solicitações de Ensaios / OS (TestRequest): ${result[4].count}`);
  console.log(`• Orçamentos de Ensaios (Orcamento): ${result[5].count}`);

  // 3. Verificação final
  const [
    remainingRequests,
    remainingItems,
    remainingInvoices,
    remainingHistories,
    remainingSurveys,
    remainingOrcamentos
  ] = await Promise.all([
    prisma.testRequest.count(),
    prisma.testExecutionItem.count(),
    prisma.partialInvoice.count(),
    prisma.testRequestHistory.count(),
    prisma.satisfactionSurvey.count(),
    prisma.orcamento.count()
  ]);

  console.log('\n--- VERIFICAÇÃO PÓS-LIMPEZA ---');
  console.log(`• TestRequests restantes: ${remainingRequests}`);
  console.log(`• TestExecutionItems restantes: ${remainingItems}`);
  console.log(`• PartialInvoices restantes: ${remainingInvoices}`);
  console.log(`• TestRequestHistories restantes: ${remainingHistories}`);
  console.log(`• SatisfactionSurveys restantes: ${remainingSurveys}`);
  console.log(`• Orcamentos restantes: ${remainingOrcamentos}`);

  const totalRemaining = remainingRequests + remainingItems + remainingInvoices + remainingHistories + remainingSurveys + remainingOrcamentos;
  if (totalRemaining === 0) {
    console.log('\n🎉 SUCESSO: Todos os dados de ensaios foram totalmente limpos!');
    console.log('Tanto o Portal do Cliente quanto o SGQ de Colaboradores estão zerados de ensaios.');
  } else {
    console.warn(`\n⚠️ Atenção: Ainda restam ${totalRemaining} registros.`);
  }
}

main()
  .catch((err) => {
    console.error('❌ Erro durante a limpeza:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
