const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const role = 'PROJETISTA'
    const permissions = ['view_dashboard', 'projetos_concepcao', 'projetos_calculos', 'projetos_documentacao', 'projetos_visitas']
    
    try {
        await prisma.profile.upsert({
            where: { name: role },
            update: { permissions },
            create: { name: role, permissions },
        })
        console.log(`Perfil ${role} inicializado com sucesso no banco de dados.`)
    } catch (e) {
        console.error("Erro ao criar o Profile:", e.message)
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
