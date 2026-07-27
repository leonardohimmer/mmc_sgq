import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                googleAccessToken: null,
                googleRefreshToken: null,
                googleTokenExpiry: null
            }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Erro ao desconectar Google Agenda:', error)
        return NextResponse.json({ error: error.message || 'Erro ao desconectar.' }, { status: 500 })
    }
}
