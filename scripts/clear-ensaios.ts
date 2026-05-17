import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando limpeza dos ensaios...')

    try {
        // É importante deletar o histórico primeiro devido às restrições de chave estrangeira
        const deletedHistory = await prisma.testRequestHistory.deleteMany({})
        console.log(`Deletados ${deletedHistory.count} registros de histórico.`)

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
