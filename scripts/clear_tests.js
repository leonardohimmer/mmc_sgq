const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearTestsDatabase() {
  console.log('Iniciando limpeza dos dados de ensaios e orçamentos...');
  
  const result = await prisma.$transaction([
    prisma.testExecutionItem.deleteMany(),
    prisma.partialInvoice.deleteMany(),
    prisma.testRequestHistory.deleteMany(),
    prisma.satisfactionSurvey.deleteMany(),
    prisma.testRequest.deleteMany(),
    prisma.orcamento.deleteMany(),
  ]);

  console.log('--- RESULTADO DA LIMPEZA ---');
  console.log('TestExecutionItem deletados:', result[0].count);
  console.log('PartialInvoice deletados:', result[1].count);
  console.log('TestRequestHistory deletados:', result[2].count);
  console.log('SatisfactionSurvey deletados:', result[3].count);
  console.log('TestRequest deletados:', result[4].count);
  console.log('Orcamento deletados:', result[5].count);
  console.log('Limpeza concluída com sucesso!');
}

clearTestsDatabase()
  .catch((err) => {
    console.error('Erro durante a limpeza do banco de dados:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
