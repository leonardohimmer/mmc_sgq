import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10)

    const profiles = [
        { email: 'controlador@mmc.com.br', name: 'Controlador Geral', role: 'CONTROLADOR' },
        { email: 'direcao@mmc.com.br', name: 'Diretor', role: 'DIREÇÃO' },
        { email: 'tecresp@mmc.com.br', name: 'Responsável Técnico', role: 'RESPONSÁVEL TÉCNICO' },
        { email: 'lab@mmc.com.br', name: 'Técnico LAB', role: 'TÉCNICO DE LABORATÓRIO' },
        { email: 'qualidade@mmc.com.br', name: 'Gestor da Qualidade', role: 'QUALIDADE' },
        { email: 'administrativo@mmc.com.br', name: 'Administrativo', role: 'ADMINISTRATIVO' },
        { email: 'auditor@mmc.com.br', name: 'Auditor Externo/Interno', role: 'AUDITOR INTERNO' },
        { email: 'cliente@mmc.com.br', name: 'Cliente Parceiro', role: 'CLIENTE' },
    ]

    const defaultPermissions: Record<string, string[]> = {
        'CONTROLADOR': ['manage_users', 'manage_profiles', 'view_dashboard', 'manage_requests', 'execute_tests', 'approve_requests', 'manage_quality', 'manage_financial', 'view_audits', 'view_documents', 'edit_documents'],
        'DIREÇÃO': ['view_dashboard', 'manage_requests'],
        'RESPONSÁVEL TÉCNICO': ['view_dashboard', 'manage_requests', 'approve_requests'],
        'TÉCNICO DE LABORATÓRIO': ['view_dashboard', 'execute_tests'],
        'QUALIDADE': ['view_dashboard', 'manage_quality'],
        'ADMINISTRATIVO': ['view_dashboard', 'manage_financial'],
        'AUDITOR INTERNO': ['view_dashboard', 'view_audits'],
        'CLIENTE': ['view_own_reports'],
    }

    for (const profile of profiles) {
        const createdProfile = await prisma.profile.upsert({
            where: { name: profile.role },
            update: {},
            create: {
                name: profile.role,
                permissions: defaultPermissions[profile.role] || [],
            },
        })

        await prisma.user.upsert({
            where: { email: profile.email },
            update: {
                role: profile.role,
                name: profile.name,
                profileId: createdProfile.id,
            },
            create: {
                email: profile.email,
                name: profile.name,
                password: hashedPassword,
                role: profile.role,
                profileId: createdProfile.id,
            },
        })
        console.log(`Usuário gerado/atualizado: ${profile.email} - Perfil: ${profile.role}`)
    }

    // Manter o admin original caso queira também
    const adminProfile = await prisma.profile.upsert({
        where: { name: 'CONTROLADOR' },
        update: {},
        create: {
            name: 'CONTROLADOR',
            permissions: defaultPermissions['CONTROLADOR'] || [],
        },
    })

    await prisma.user.upsert({
        where: { email: 'admin@mmc.com.br' },
        update: { role: 'CONTROLADOR', profileId: adminProfile.id },
        create: {
            email: 'admin@mmc.com.br',
            name: 'Administrador SGQ',
            password: await bcrypt.hash('admin123', 10),
            role: 'CONTROLADOR',
            profileId: adminProfile.id,
        },
    })
    // Criar solicitações de ensaio de exemplo (Mock)
    const clientUser = await prisma.user.findUnique({ where: { email: 'cliente@mmc.com.br' } })
    const techUser = await prisma.user.findUnique({ where: { email: 'lab@mmc.com.br' } })

    if (clientUser && techUser) {
        // Mock 1: Recebido (sem responsável)
        const req1 = await prisma.testRequest.create({
            data: {
                type: 'Ensaio Guarda-corpo',
                location: 'Obra Alfa - São Paulo',
                desiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // daqui a 7 dias
                observations: 'Necessário agendar horário com o mestre de obras.',
                status: 'RECEBIDO',
                clientName: 'Construtora Alfa LTDA',
            }
        })

        // Mock 2: Em Execução (com responsável)
        const req2 = await prisma.testRequest.create({
            data: {
                type: 'Ensaio Compressão',
                location: 'Central dos Correios - RJ',
                desiredDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
                observations: 'Urgente para entrega.',
                status: 'EM_EXECUCAO',
                clientName: 'Serralheria Beta',
                assignedToId: techUser.id
            }
        })

        // Fake history for Mock 2
        await prisma.testRequestHistory.create({
            data: {
                requestId: req2.id,
                changedBy: 'Sistema',
                oldStatus: 'RECEBIDO',
                newStatus: 'EM_EXECUCAO',
                assignedToId: techUser.id,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
        })
        console.log("Solicitações de teste mockadas criadas.")
    }

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
