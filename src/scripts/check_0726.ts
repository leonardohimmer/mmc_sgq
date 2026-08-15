import prisma from '../lib/prisma';

async function main() {
  const req = await prisma.testRequest.findFirst({
    where: { id: '1b6f4e63-b995-4a14-8293-cd349c7d06de' },
    include: { executionItems: true }
  });

  console.log("OS:", req?.id, "Client:", req?.clientName, "Qtd:", req?.qtdContratada, "Status:", req?.status);
  console.log("Execution Items:");
  if (req?.executionItems) {
    for (const item of req.executionItems) {
      console.log(`Seq: ${item.numeroSequencial} | Exec: ${item.statusExecucao} | Fat: ${item.statusFaturamento} | Ent: ${item.statusEntrega} | ReportNo: ${item.reportNumber}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
