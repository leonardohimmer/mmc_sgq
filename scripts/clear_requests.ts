import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpando o banco de dados de solicitações...')

  // Limpar os históricos
  const historyResult = await prisma.testRequestHistory.deleteMany({})
  console.log(`Limpou ${historyResult.count} históricos.`)

  // Limpar as solicitações 
  const requestsResult = await prisma.testRequest.deleteMany({})
  console.log(`Limpou ${requestsResult.count} solicitações.`)

  console.log('Limpeza finalizada com sucesso.')
}

main()
  .catch((e) => {
    console.error('Erro na limpeza:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
