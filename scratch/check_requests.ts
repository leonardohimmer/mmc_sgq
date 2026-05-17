import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const latestRequests = await prisma.testRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  console.log('Latest Requests:')
  latestRequests.forEach(req => {
    console.log(`ID: ${req.id}, Status: ${req.status}, ProposalPdf: ${req.proposalPdfUrl ? 'YES' : 'NO'}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
