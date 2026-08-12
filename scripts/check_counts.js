const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  const tr = await prisma.testRequest.count();
  const tei = await prisma.testExecutionItem.count();
  const pi = await prisma.partialInvoice.count();
  const trh = await prisma.testRequestHistory.count();
  const ss = await prisma.satisfactionSurvey.count();
  const orc = await prisma.orcamento.count();
  const users = await prisma.user.count();
  const equipments = await prisma.equipment.count();
  const docs = await prisma.document.count();

  console.log('--- DATABASE RECORD COUNTS ---');
  console.log('TestRequest (Solicitações/Ensaios):', tr);
  console.log('TestExecutionItem (Itens de Execução):', tei);
  console.log('PartialInvoice (Faturas Parciais):', pi);
  console.log('TestRequestHistory (Histórico):', trh);
  console.log('SatisfactionSurvey (Pesquisas de Satisfação):', ss);
  console.log('Orcamento (Orçamentos):', orc);
  console.log('User (Usuários):', users);
  console.log('Equipment (Equipamentos):', equipments);
  console.log('Document (Documentos SGQ):', docs);
}

checkCounts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
