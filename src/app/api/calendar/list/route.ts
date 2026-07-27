import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getGoogleCalendarClient } from '@/lib/googleCalendar'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const calendar = await getGoogleCalendarClient(session.user.id)
        const response = await calendar.calendarList.list()

        const calendars = response.data.items?.map(item => ({
            id: item.id,
            summary: item.summary,
            backgroundColor: item.backgroundColor || '#039BE5',
            foregroundColor: item.foregroundColor || '#ffffff',
            primary: item.primary || false,
            accessRole: item.accessRole
        })) || []

        return NextResponse.json(calendars)
    } catch (error: any) {
        console.error('Erro ao buscar lista de agendas do Google:', error)
        return NextResponse.json({ error: error.message || 'Erro ao carregar agendas.' }, { status: 500 })
    }
}
