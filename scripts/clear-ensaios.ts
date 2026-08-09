import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando limpeza dos ensaios e histórico...')

    try {
        const deletedSurveys = await prisma.satisfactionSurvey.deleteMany({})
        console.log(`Deletados ${deletedSurveys.count} registros de pesquisa de satisfação.`)

        const deletedHistory = await prisma.testRequestHistory.deleteMany({})
        console.log(`Deletados ${deletedHistory.count} registros de histórico.`)

        const deletedItems = await prisma.testExecutionItem.deleteMany({})
        console.log(`Deletados ${deletedItems.count} itens de execução.`)

        const deletedInvoices = await prisma.partialInvoice.deleteMany({})
        console.log(`Deletados ${deletedInvoices.count} notas fiscais parciais.`)

        const deletedRequests = await prisma.testRequest.deleteMany({})
        console.log(`Deletados ${deletedRequests.count} ensaios (TestRequests).`)

        console.log('Limpeza concluída com sucesso!')
    } catch (error) {
        console.error('Erro ao limpar os ensaios:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
