import prisma from '../lib/prisma';

async function main() {
  const requests = await prisma.testRequest.findMany({
    where: {
      OR: [
        { osCode: { contains: '20260809' } },
        { clientName: { contains: 'Artur' } },
        { reportNumber: { contains: '20260809' } }
      ]
    },
    include: {
      executionItems: true,
      partialInvoices: true,
      satisfactionSurvey: true,
    }
  });

  console.log(`Found ${requests.length} matching requests.`);

  for (const req of requests) {
    console.log(`Req ID: ${req.id} | OS: ${req.osCode || req.id} | Status: ${req.status} | Client: ${req.clientName}`);
    if (req.status === 'FINALIZADO') {
      const updated = await prisma.testRequest.update({
        where: { id: req.id },
        data: {
          status: 'COBRANCA',
          step: 7
        }
      });
      console.log(`SUCCESS! Reverted OS ${req.id} (${req.osCode || req.id}) back to COBRANCA!`, updated.status);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
