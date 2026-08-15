import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLightweightRequests } from '@/lib/lightweight-requests'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const formattedRequests = await getLightweightRequests()

        return NextResponse.json(formattedRequests)
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

