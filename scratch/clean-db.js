const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log("=== LIMPANDO HISTÓRICO DE ENSAIOS DO SISTEMA ===");

  try {
    // Apagar em ordem de dependência de Chave Estrangeira
    const deletedSurveys = await prisma.satisfactionSurvey.deleteMany({});
    console.log(`- Pesquisas de satisfação removidas: ${deletedSurveys.count}`);

    const deletedHistories = await prisma.testRequestHistory.deleteMany({});
    console.log(`- Histórico de solicitações removido: ${deletedHistories.count}`);

    const deletedExecutionItems = await prisma.testExecutionItem.deleteMany({});
    console.log(`- Itens de execução (1 de N) removidos: ${deletedExecutionItems.count}`);

    const deletedPartialInvoices = await prisma.partialInvoice.deleteMany({});
    console.log(`- Notas fiscais parciais removidas: ${deletedPartialInvoices.count}`);

    const deletedRequests = await prisma.testRequest.deleteMany({});
    console.log(`- Solicitações/OSs de ensaios removidas: ${deletedRequests.count}`);

    console.log("✅ Histórico de ensaios limpo com sucesso!");
  } catch (error) {
    console.error("Erro ao limpar histórico de ensaios:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
