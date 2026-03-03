import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Atualiza a última atividade para "agora"
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                lastActivity: new Date()
            },
            select: { id: true, lastActivity: true } // Otimiza a query
        })

        return NextResponse.json({ success: true, timestamp: new Date() })
    } catch (error) {
        console.error('Error updating presence ping:', error)
        return NextResponse.json({ error: 'Erro ao registrar atividade' }, { status: 500 })
    }
}
