import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getGoogleCalendarClient } from '@/lib/googleCalendar'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                googleAccessToken: true,
                googleRefreshToken: true,
            }
        })

        if (!user || !user.googleAccessToken || !user.googleRefreshToken) {
            return NextResponse.json({ connected: false })
        }

        try {
            const calendar = await getGoogleCalendarClient(session.user.id)
            const meta = await calendar.calendars.get({ calendarId: 'primary' })
            return NextResponse.json({
                connected: true,
                email: meta.data.id || session.user.email
            })
        } catch (e: any) {
            console.error('Erro na validação do token com o Google:', e)
            return NextResponse.json({
                connected: false,
                error: 'Token inválido ou expirado. Por favor, conecte novamente.'
            })
        }
    } catch (error: any) {
        console.error('Erro na rota de status da agenda:', error)
        return NextResponse.json({ connected: false, error: error.message }, { status: 500 })
    }
}
