import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAuthUrl } from '@/lib/googleCalendar'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const url = getAuthUrl()
        return NextResponse.redirect(url)
    } catch (error: any) {
        console.error('Erro ao redirecionar para login do Google:', error)
        return NextResponse.json({ error: error.message || 'Erro ao gerar URL de autorização.' }, { status: 500 })
    }
}
