import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Iniciando atualização de perfis...')

    const defaultPermissions = {
        'ASSISTENTE ADMINISTRATIVO': ['view_dashboard', 'manage_financial'],
        'AUXILIAR ADMINISTRATIVO': ['view_dashboard', 'manage_financial'],
        'AUXILIAR DE LABORATÓRIO': ['view_dashboard', 'execute_tests'],
    }

    // 1. Criar os novos perfis
    const profilesToCreate = Object.keys(defaultPermissions)

    for (const pName of profilesToCreate) {
        const existing = await prisma.profile.findUnique({ where: { name: pName } })
        if (!existing) {
            await prisma.profile.create({
                data: {
                    name: pName,
                    permissions: defaultPermissions[pName as keyof typeof defaultPermissions]
                }
            })
            console.log(`✅ Perfil '${pName}' criado.`)
        } else {
            console.log(`ℹ️ Perfil '${pName}' já existia.`)
        }
    }

    // 2. Renomear usuários de "ADMINISTRATIVO" para "ASSISTENTE ADMINISTRATIVO" (como fallback amigável)
    const oldProfileName = 'ADMINISTRATIVO'
    const assistenteProfile = await prisma.profile.findUnique({ where: { name: 'ASSISTENTE ADMINISTRATIVO' } })

    if (assistenteProfile) {
        const updatedUsers = await prisma.user.updateMany({
            where: { role: oldProfileName },
            data: {
                role: 'ASSISTENTE ADMINISTRATIVO',
                profileId: assistenteProfile.id
            }
        })
        console.log(`✅ ${updatedUsers.count} usuários movidos de '${oldProfileName}' para 'ASSISTENTE ADMINISTRATIVO'.`)
    }

    // 3. Remover o perfil "ADMINISTRATIVO" antigo (agora obsoleto)
    const oldProfile = await prisma.profile.findUnique({ where: { name: oldProfileName } })
    if (oldProfile) {
        // Garantir que ninguém mais está usando antes de deletar
        const stillInUse = await prisma.user.count({ where: { role: oldProfileName } })
        if (stillInUse === 0) {
            await prisma.profile.delete({ where: { name: oldProfileName } })
            console.log(`🗑️ Perfil antigo '${oldProfileName}' deletado.`)
        } else {
            console.log(`⚠️ Perfil '${oldProfileName}' não deletado pois ainda há ${stillInUse} usuários associados a ele.`)
        }
    } else {
        console.log(`ℹ️ Perfil '${oldProfileName}' não existe mais.`)
    }

    console.log('🏁 Atualização finalizada com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
