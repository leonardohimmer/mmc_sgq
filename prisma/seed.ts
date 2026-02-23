import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10)

    const profiles = [
        { email: 'direcao@mmc.com.br', name: 'Diretor', role: 'DIREÇÃO' },
        { email: 'tecresp@mmc.com.br', name: 'Responsável Técnico', role: 'RESPONSÁVEL TÉCNICO' },
        { email: 'lab@mmc.com.br', name: 'Técnico LAB', role: 'TÉCNICO DE LABORATÓRIO' },
        { email: 'qualidade@mmc.com.br', name: 'Gestor da Qualidade', role: 'QUALIDADE' },
        { email: 'auditor@mmc.com.br', name: 'Auditor Externo/Interno', role: 'AUDITOR INTERNO' },
        { email: 'cliente@mmc.com.br', name: 'Cliente Parceiro', role: 'CLIENTE' },
    ]

    for (const profile of profiles) {
        await prisma.user.upsert({
            where: { email: profile.email },
            update: {
                role: profile.role,
                name: profile.name
            },
            create: {
                email: profile.email,
                name: profile.name,
                password: hashedPassword,
                role: profile.role,
            },
        })
        console.log(`Usuário gerado/atualizado: ${profile.email} - Perfil: ${profile.role}`)
    }

    // Manter o admin original caso queira também
    await prisma.user.upsert({
        where: { email: 'admin@mmc.com.br' },
        update: { role: 'DIREÇÃO' },
        create: {
            email: 'admin@mmc.com.br',
            name: 'Administrador SGQ',
            password: await bcrypt.hash('admin123', 10),
            role: 'DIREÇÃO',
        },
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
