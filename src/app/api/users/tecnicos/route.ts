import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Fetch only technical roles
        const techUsers = await prisma.user.findMany({
            where: {
                role: {
                    in: ["TÉCNICO DE LABORATÓRIO", "RESPONSÁVEL TÉCNICO", "DIREÇÃO"]
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(techUsers)
    } catch (error) {
        console.error('Erro ao buscar técnicos:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
