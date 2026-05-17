import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const profiles = await prisma.profile.findMany({
            where: {
                name: { not: 'CLIENTE' }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(profiles)
    } catch (error) {
        console.error('Error listing profiles:', error)
        return NextResponse.json({ error: 'Erro ao buscar perfis' }, { status: 500 })
    }
}
