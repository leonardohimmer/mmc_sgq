import prisma from '../lib/prisma';

async function main() {
  const requestId = '1b6f4e63-b995-4a14-8293-cd349c7d06de'; // OS 20260812_0726

  // Itens 1 e 2 executados na simulação do usuário
  await prisma.testExecutionItem.updateMany({
    where: { requestId, numeroSequencial: { in: [1, 2] } },
    data: {
      statusExecucao: 'CONCLUIDO',
      statusFaturamento: 'LIBERADO',
      statusEntrega: 'PENDENTE',
    }
  });

  // Itens 3 a 10 mantidos como PENDENTES para execuções futuras
  await prisma.testExecutionItem.updateMany({
    where: { requestId, numeroSequencial: { gte: 3 } },
    data: {
      statusExecucao: 'PENDENTE',
      statusFaturamento: 'PENDENTE',
      statusEntrega: 'PENDENTE',
    }
  });

  console.log("OS 20260812_0726 ajustada com sucesso! Exatamente 2 ensaios (Item #1 e #2) em Elaboração.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
