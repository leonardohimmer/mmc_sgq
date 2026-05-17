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

        // Define a atividade como 5 minutos atrás para que o status mude imediatamente para "Visto recentemente" (que expira em 30 mins)
        const fiveMinutesAgo = new Date(Date.now() - 5.01 * 60 * 1000)
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                lastActivity: fiveMinutesAgo
            },
            select: { id: true }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error setting user offline:', error)
        return NextResponse.json({ error: 'Erro ao deslogar' }, { status: 500 })
    }
}
