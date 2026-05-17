import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Renomeando perfil de QUALIDADE para ASSISTENTE DE QUALIDADE...')

    const oldName = 'QUALIDADE'
    const newName = 'ASSISTENTE DE QUALIDADE'

    // 1. Verificar se o antigo existe
    const oldProfile = await prisma.profile.findUnique({ where: { name: oldName } })

    if (oldProfile) {
        // Criar ou obter o novo perfil
        let newProfile = await prisma.profile.findUnique({ where: { name: newName } })

        if (!newProfile) {
            newProfile = await prisma.profile.create({
                data: {
                    name: newName,
                    permissions: oldProfile.permissions
                }
            })
            console.log(`✅ Perfil '${newName}' criado a partir das permissões de '${oldName}'.`)
        }

        // Migrar usuários
        const updatedUsers = await prisma.user.updateMany({
            where: { role: oldName },
            data: {
                role: newName,
                profileId: newProfile.id
            }
        })
        console.log(`✅ ${updatedUsers.count} usuários movidos de '${oldName}' para '${newName}'.`)

        // Remover perfil antigo
        await prisma.profile.delete({ where: { id: oldProfile.id } })
        console.log(`🗑️ Perfil antigo '${oldName}' deletado.`)
    } else {
        console.log(`ℹ️ Perfil '${oldName}' não encontrado (pode já ter sido renomeado).`)
    }

    console.log('🏁 Concluído!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
