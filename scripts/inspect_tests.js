const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
  const requests = await prisma.testRequest.findMany({
    select: {
      id: true,
      type: true,
      clientName: true,
      workName: true,
      status: true,
      createdAt: true
    }
  });

  const orcamentos = await prisma.orcamento.findMany({
    select: {
      id: true,
      nomeCompleto: true,
      nomeContratante: true,
      servicoDesejado: true,
      status: true,
      createdAt: true
    }
  });

  console.log('=== TEST REQUESTS (ENSAIOS) ===');
  console.log(JSON.stringify(requests, null, 2));
  console.log('=== ORÇAMENTOS ===');
  console.log(JSON.stringify(orcamentos, null, 2));
}

inspect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
