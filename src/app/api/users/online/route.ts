import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Busca usuários com os campos necessários para a página de colaboradores online
        // Excluindo clientes e auditores (apenas colaboradores)
        const users = await prisma.user.findMany({
            where: {
                role: {
                    notIn: ['CLIENTE', 'AUDITOR', 'AUDITOR INTERNO']
                }
            },
            select: {
                id: true,
                name: true,
                role: true,
                email: true,
                avatarUrl: true,
                emotion: true,
                lastActivity: true,
                profile: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching online users:', error)
        return NextResponse.json({ error: 'Erro ao buscar colaboradores' }, { status: 500 })
    }
}
