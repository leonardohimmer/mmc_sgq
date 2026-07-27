import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getGoogleCalendarClient } from '@/lib/googleCalendar'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const timeMin = searchParams.get('timeMin') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const timeMax = searchParams.get('timeMax') || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        const calendarsParam = searchParams.get('calendars')

        if (!calendarsParam) {
            return NextResponse.json([])
        }

        const calendarIds: string[] = calendarsParam.split(',')
        const calendar = await getGoogleCalendarClient(session.user.id)

        // Busca as agendas para mapear as cores corretas de cada uma no FullCalendar
        const calendarListResp = await calendar.calendarList.list()
        const calendarColorsMap = new Map<string, { bg: string; fg: string }>()
        calendarListResp.data.items?.forEach(item => {
            if (item.id) {
                calendarColorsMap.set(item.id, {
                    bg: item.backgroundColor || '#039BE5',
                    fg: item.foregroundColor || '#ffffff'
                })
            }
        })

        // Executa em paralelo a busca de eventos de todas as agendas selecionadas
        const eventsPromises = calendarIds.map(async (calendarId) => {
            try {
                const response = await calendar.events.list({
                    calendarId,
                    timeMin,
                    timeMax,
                    singleEvents: true,
                    orderBy: 'startTime',
                })

                const colors = calendarColorsMap.get(calendarId) || { bg: '#039BE5', fg: '#ffffff' }

                return (response.data.items || []).map(event => {
                    const start = event.start?.dateTime || event.start?.date
                    const end = event.end?.dateTime || event.end?.date
                    const allDay = !event.start?.dateTime

                    return {
                        id: event.id,
                        title: event.summary || '(Sem título)',
                        description: event.description || '',
                        location: event.location || '',
                        start,
                        end,
                        allDay,
                        calendarId,
                        backgroundColor: colors.bg,
                        textColor: colors.fg,
                        borderColor: colors.bg
                    }
                })
            } catch (err) {
                console.error(`Erro ao obter eventos da agenda ${calendarId}:`, err)
                return [] // Ignora erros em agendas individuais para não quebrar a tela inteira
            }
        })

        const allEventsResults = await Promise.all(eventsPromises)
        const mergedEvents = allEventsResults.flat()

        return NextResponse.json(mergedEvents)
    } catch (error: any) {
        console.error('Erro ao buscar eventos do Google Agenda:', error)
        return NextResponse.json({ error: error.message || 'Erro ao carregar compromissos.' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { calendarId, title, description, location, start, end, allDay } = body

        if (!calendarId || !title || !start || !end) {
            return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 })
        }

        const calendar = await getGoogleCalendarClient(session.user.id)

        const eventBody: any = {
            summary: title,
            description: description || '',
            location: location || '',
        }

        if (allDay) {
            eventBody.start = { date: start.split('T')[0] }
            eventBody.end = { date: end.split('T')[0] }
        } else {
            eventBody.start = { dateTime: start }
            eventBody.end = { dateTime: end }
        }

        const response = await calendar.events.insert({
            calendarId,
            requestBody: eventBody,
        })

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('Erro ao criar compromisso no Google:', error)
        return NextResponse.json({ error: error.message || 'Erro ao criar compromisso.' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { eventId, calendarId, title, description, location, start, end, allDay } = body

        if (!eventId || !calendarId || !start || !end) {
            return NextResponse.json({ error: 'Dados obrigatórios ausentes.' }, { status: 400 })
        }

        const calendar = await getGoogleCalendarClient(session.user.id)

        const eventBody: any = {}
        if (title !== undefined) eventBody.summary = title
        if (description !== undefined) eventBody.description = description
        if (location !== undefined) eventBody.location = location

        if (allDay) {
            eventBody.start = { date: start.split('T')[0] }
            eventBody.end = { date: end.split('T')[0] }
        } else {
            eventBody.start = { dateTime: start }
            eventBody.end = { dateTime: end }
        }

        const response = await calendar.events.patch({
            calendarId,
            eventId,
            requestBody: eventBody,
        })

        return NextResponse.json(response.data)
    } catch (error: any) {
        console.error('Erro ao atualizar compromisso no Google:', error)
        return NextResponse.json({ error: error.message || 'Erro ao atualizar compromisso.' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')
        const calendarId = searchParams.get('calendarId')

        if (!eventId || !calendarId) {
            return NextResponse.json({ error: 'Parâmetros eventId e calendarId são obrigatórios.' }, { status: 400 })
        }

        const calendar = await getGoogleCalendarClient(session.user.id)

        await calendar.events.delete({
            calendarId,
            eventId,
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Erro ao excluir compromisso no Google:', error)
        return NextResponse.json({ error: error.message || 'Erro ao excluir compromisso.' }, { status: 500 })
    }
}
