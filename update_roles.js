const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Rename Profile
    try {
        await prisma.profile.updateMany({
            where: { name: 'DIREÇÃO' },
            data: { name: 'DIRETOR' },
        })
        console.log("Perfil DIREÇÃO atualizado para DIRETOR.")
    } catch (e) {
        console.error("Erro ao atualizar o Profile:", e.message)
    }

    // 2. Rename Users roles
    try {
        const result = await prisma.user.updateMany({
            where: { role: 'DIREÇÃO' },
            data: { role: 'DIRETOR' },
        })
        console.log(`Atualizados ${result.count} usuários de DIREÇÃO para DIRETOR.`)
    } catch (e) {
        console.error("Erro ao atualizar os Users:", e.message)
    }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
