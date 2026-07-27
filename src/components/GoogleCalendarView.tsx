"use client"

import React, { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { toast } from 'sonner'
import { 
    Calendar, 
    Plus, 
    Trash2, 
    X, 
    MapPin, 
    AlignLeft, 
    Clock, 
    Check, 
    Loader2, 
    LogOut,
    Search
} from 'lucide-react'

interface GoogleCalendar {
    id: string
    summary: string
    backgroundColor: string
    foregroundColor: string
    primary: boolean
    accessRole: string
}

interface CalendarEvent {
    id: string
    title: string
    description: string
    location: string
    start: string
    end: string
    allDay: boolean
    calendarId: string
    backgroundColor: string
    textColor: string
    borderColor: string
}

interface GoogleCalendarViewProps {
    userEmail: string
    onDisconnect: () => void
}

export default function GoogleCalendarView({ userEmail, onDisconnect }: GoogleCalendarViewProps) {
    const [calendars, setCalendars] = useState<GoogleCalendar[]>([])
    const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([])
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loadingCalendars, setLoadingCalendars] = useState(true)
    const [loadingEvents, setLoadingEvents] = useState(false)
    const [submittingEvent, setSubmittingEvent] = useState(false)
    
    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null)
    
    // Form fields
    const [eventTitle, setEventTitle] = useState('')
    const [eventCalendarId, setEventCalendarId] = useState('')
    const [eventStartDate, setEventStartDate] = useState('')
    const [eventStartTime, setEventStartTime] = useState('09:00')
    const [eventEndDate, setEventEndDate] = useState('')
    const [eventEndTime, setEventEndTime] = useState('10:00')
    const [eventAllDay, setEventAllDay] = useState(false)
    const [eventLocation, setEventLocation] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const calendarRef = useRef<any>(null)

    // Carrega a lista de agendas
    const fetchCalendars = async () => {
        setLoadingCalendars(true)
        try {
            const res = await fetch('/api/calendar/list')
            if (!res.ok) throw new Error('Falha ao obter lista de agendas')
            const data = await res.json()
            setCalendars(data)
            
            // Ativa todas as agendas por padrão
            const ids = data.map((c: GoogleCalendar) => c.id)
            setSelectedCalendarIds(ids)
            
            // Define a agenda padrão para novos eventos (a primária)
            const primaryCal = data.find((c: GoogleCalendar) => c.primary) || data[0]
            if (primaryCal) {
                setEventCalendarId(primaryCal.id)
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao carregar agendas.')
        } finally {
            setLoadingCalendars(false)
        }
    }

    // Carrega eventos das agendas selecionadas
    const fetchEvents = async (startISO?: string, endISO?: string) => {
        if (selectedCalendarIds.length === 0) {
            setEvents([])
            return
        }

        setLoadingEvents(true)

        // Se datas não forem especificadas, tenta pegar do FullCalendar ativo
        let timeMin = startISO
        let timeMax = endISO
        
        if (!timeMin && calendarRef.current) {
            const api = calendarRef.current.getApi()
            timeMin = api.view.activeStart.toISOString()
            timeMax = api.view.activeEnd.toISOString()
        }

        if (!timeMin) {
            timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            timeMax = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        }

        try {
            const queryParams = new URLSearchParams({
                timeMin: timeMin!,
                timeMax: timeMax!,
                calendars: selectedCalendarIds.join(',')
            })
            
            const res = await fetch(`/api/calendar/events?${queryParams.toString()}`)
            if (!res.ok) throw new Error('Erro ao buscar eventos do Google')
            const data = await res.json()
            setEvents(data)
        } catch (error: any) {
            toast.error('Erro ao sincronizar compromissos.')
            console.error(error)
        } finally {
            setLoadingEvents(false)
        }
    }

    useEffect(() => {
        fetchCalendars()
    }, [])

    useEffect(() => {
        if (selectedCalendarIds.length > 0) {
            fetchEvents()
        } else {
            setEvents([])
        }
    }, [selectedCalendarIds])

    // Chamado pelo FullCalendar quando o usuário navega nas datas ou muda de visualização
    const handleDatesSet = (dateInfo: any) => {
        fetchEvents(dateInfo.startStr, dateInfo.endStr)
    }

    // Habilita ou desabilita uma agenda específica na visualização
    const handleToggleCalendar = (id: string) => {
        setSelectedCalendarIds(prev => 
            prev.includes(id) ? prev.filter(calId => calId !== id) : [...prev, id]
        )
    }

    // Clique em um compromisso existente (Editar/Ver detalhes)
    const handleEventClick = (clickInfo: any) => {
        const event: CalendarEvent = clickInfo.event.extendedProps.calendarId 
            ? {
                id: clickInfo.event.id,
                title: clickInfo.event.title,
                description: clickInfo.event.extendedProps.description,
                location: clickInfo.event.extendedProps.location,
                start: clickInfo.event.startStr,
                end: clickInfo.event.endStr || clickInfo.event.startStr,
                allDay: clickInfo.event.allDay,
                calendarId: clickInfo.event.extendedProps.calendarId,
                backgroundColor: clickInfo.event.backgroundColor,
                textColor: clickInfo.event.textColor,
                borderColor: clickInfo.event.borderColor
              }
            : clickInfo.event;

        setModalMode('edit')
        setSelectedEvent(event)
        
        setEventTitle(event.title)
        setEventCalendarId(event.calendarId)
        setEventAllDay(event.allDay)
        setEventLocation(event.location)
        setEventDescription(event.description)

        // Formata datas para o input datetime-local / date
        if (event.allDay) {
            setEventStartDate(event.start.split('T')[0])
            setEventEndDate(event.end.split('T')[0])
            setEventStartTime('09:00')
            setEventEndTime('10:00')
        } else {
            const startD = new Date(event.start)
            const endD = new Date(event.end)
            
            setEventStartDate(startD.toISOString().split('T')[0])
            setEventStartTime(startD.toTimeString().substring(0, 5))
            
            setEventEndDate(endD.toISOString().split('T')[0])
            setEventEndTime(endD.toTimeString().substring(0, 5))
        }

        setShowModal(true)
    }

    // Seleção de um intervalo no calendário (Criar novo compromisso)
    const handleDateSelect = (selectInfo: any) => {
        setModalMode('create')
        setSelectedEvent(null)
        
        setEventTitle('')
        setEventLocation('')
        setEventDescription('')
        setEventAllDay(selectInfo.allDay)

        const startD = new Date(selectInfo.startStr)
        setEventStartDate(selectInfo.startStr.split('T')[0])
        
        if (selectInfo.allDay) {
            // Em seleções de dia inteiro no FullCalendar, o endStr é exclusivo.
            // Para criação, vamos ajustar para o mesmo dia ou dia anterior no input.
            const endD = new Date(selectInfo.endStr)
            endD.setDate(endD.getDate() - 1)
            setEventEndDate(endD.toISOString().split('T')[0])
            setEventStartTime('09:00')
            setEventEndTime('10:00')
        } else {
            setEventStartTime(startD.toTimeString().substring(0, 5))
            const endD = new Date(selectInfo.endStr)
            setEventEndDate(selectInfo.endStr.split('T')[0])
            setEventEndTime(endD.toTimeString().substring(0, 5))
        }

        // Escolhe a primeira agenda editável (geralmente a primária)
        const writableCal = calendars.find(c => c.accessRole === 'owner' || c.accessRole === 'writer') || calendars[0]
        if (writableCal) {
            setEventCalendarId(writableCal.id)
        }

        setShowModal(true)
    }

    // Salva ou atualiza o compromisso
    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!eventTitle.trim()) {
            toast.error('O título do compromisso é obrigatório.')
            return
        }

        setSubmittingEvent(true)

        // Monta ISO strings
        let startISO = `${eventStartDate}T${eventStartTime}:00`
        let endISO = `${eventEndDate}T${eventEndTime}:00`

        if (eventAllDay) {
            // No Google Agenda, para eventos de dia inteiro, o endDate deve ser exclusivo (+1 dia do input final)
            const d = new Date(eventEndDate + 'T12:00:00')
            d.setDate(d.getDate() + 1)
            startISO = eventStartDate
            endISO = d.toISOString().split('T')[0]
        } else {
            // Valida se fim é menor que início
            if (new Date(endISO) <= new Date(startISO)) {
                toast.error('O horário de término deve ser após o horário de início.')
                setSubmittingEvent(false)
                return
            }
        }

        try {
            if (modalMode === 'create') {
                const res = await fetch('/api/calendar/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        calendarId: eventCalendarId,
                        title: eventTitle,
                        description: eventDescription,
                        location: eventLocation,
                        start: startISO,
                        end: endISO,
                        allDay: eventAllDay
                    })
                })
                
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || 'Erro ao criar evento')
                }
                
                toast.success('Compromisso criado com sucesso!')
            } else {
                // Modo Edição
                const res = await fetch('/api/calendar/events', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventId: selectedEvent?.id,
                        calendarId: selectedEvent?.calendarId,
                        title: eventTitle,
                        description: eventDescription,
                        location: eventLocation,
                        start: startISO,
                        end: endISO,
                        allDay: eventAllDay
                    })
                })

                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || 'Erro ao atualizar evento')
                }

                toast.success('Compromisso atualizado com sucesso!')
            }

            setShowModal(false)
            fetchEvents() // Atualiza os eventos na tela
        } catch (error: any) {
            toast.error(error.message || 'Ocorreu um erro ao salvar o compromisso.')
        } finally {
            setSubmittingEvent(false)
        }
    }

    // Exclui o compromisso
    const handleDeleteEvent = async () => {
        if (!selectedEvent?.id || !selectedEvent?.calendarId) return
        
        if (!confirm('Deseja realmente excluir este compromisso?')) return

        setSubmittingEvent(true)
        try {
            const queryParams = new URLSearchParams({
                eventId: selectedEvent.id,
                calendarId: selectedEvent.calendarId
            })
            
            const res = await fetch(`/api/calendar/events?${queryParams.toString()}`, {
                method: 'DELETE'
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Erro ao excluir evento')
            }

            toast.success('Compromisso excluído com sucesso.')
            setShowModal(false)
            fetchEvents()
        } catch (error: any) {
            toast.error(error.message || 'Erro ao excluir o compromisso.')
        } finally {
            setSubmittingEvent(false)
        }
    }

    // Arrastar e soltar ou redimensionar evento no calendário
    const handleEventDropOrResize = async (changeInfo: any) => {
        const { event } = changeInfo
        
        const startISO = event.startStr
        const endISO = event.endStr || event.startStr
        const allDay = event.allDay
        
        try {
            const res = await fetch('/api/calendar/events', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    calendarId: event.extendedProps.calendarId,
                    title: event.title,
                    description: event.extendedProps.description,
                    location: event.extendedProps.location,
                    start: startISO,
                    end: endISO,
                    allDay
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Erro ao atualizar evento')
            }

            toast.success('Compromisso reagendado com sucesso!')
        } catch (error: any) {
            toast.error(error.message || 'Erro ao alterar data do compromisso.')
            changeInfo.revert() // Reverte a alteração visual no calendário
        }
    }

    // Filtragem de eventos pela busca
    const filteredEvents = searchQuery.trim() === '' 
        ? events
        : events.filter(e => 
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.location.toLowerCase().includes(searchQuery.toLowerCase())
          )

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Lateral */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Perfil e Ações Rápidas */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-500">
                            <Calendar size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">Sincronizado</h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate" title={userEmail}>
                                {userEmail}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => {
                            setModalMode('create')
                            setSelectedEvent(null)
                            setEventTitle('')
                            setEventLocation('')
                            setEventDescription('')
                            setEventAllDay(false)
                            
                            // Datas iniciais
                            const now = new Date()
                            setEventStartDate(now.toISOString().split('T')[0])
                            setEventEndDate(now.toISOString().split('T')[0])
                            
                            const hour = now.getHours()
                            const startH = `${String(hour).padStart(2, '0')}:00`
                            const endH = `${String(hour + 1).padStart(2, '0')}:00`
                            setEventStartTime(startH)
                            setEventEndTime(endH)
                            
                            const writableCal = calendars.find(c => c.accessRole === 'owner' || c.accessRole === 'writer') || calendars[0]
                            if (writableCal) {
                                setEventCalendarId(writableCal.id)
                            }
                            setShowModal(true)
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-blue-500/10 text-sm mb-3"
                    >
                        <Plus size={18} />
                        Criar Compromisso
                    </button>

                    <button
                        onClick={onDisconnect}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-red-50 dark:bg-slate-800/40 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold rounded-xl transition-all text-xs"
                    >
                        <LogOut size={14} />
                        Desconectar Agenda Google
                    </button>
                </div>

                {/* Filtro de Busca */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Buscar compromisso</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar título, local..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                </div>

                {/* Lista de Agendas */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Minhas Agendas</h3>
                    {loadingCalendars ? (
                        <div className="flex items-center justify-center py-6 text-slate-400">
                            <Loader2 className="animate-spin mr-2" size={18} />
                            <span className="text-xs">Carregando agendas...</span>
                        </div>
                    ) : calendars.length === 0 ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500 py-3">Nenhuma agenda encontrada.</p>
                    ) : (
                        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                            {calendars.map((cal) => {
                                const isChecked = selectedCalendarIds.includes(cal.id)
                                return (
                                    <label
                                        key={cal.id}
                                        className="flex items-center gap-3 cursor-pointer group py-1"
                                    >
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleToggleCalendar(cal.id)}
                                                className="sr-only"
                                            />
                                            <div 
                                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                                    isChecked 
                                                        ? 'border-transparent' 
                                                        : 'border-slate-300 dark:border-slate-600 bg-transparent'
                                                }`}
                                                style={{ 
                                                    backgroundColor: isChecked ? cal.backgroundColor : 'transparent',
                                                }}
                                            >
                                                {isChecked && <Check size={12} style={{ color: cal.foregroundColor }} />}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                                {cal.summary}
                                            </p>
                                            {cal.primary && (
                                                <span className="text-[9px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-wider">Principal</span>
                                            )}
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Calendário Principal */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 relative">
                
                {/* Loader Overlay */}
                {loadingEvents && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 rounded-xl shadow-sm text-blue-600 dark:text-blue-400 text-xs font-bold transition-all">
                        <Loader2 className="animate-spin" size={14} />
                        Sincronizando...
                    </div>
                )}

                <div className="calendar-container dark:text-slate-200">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        buttonText={{
                            today: 'Hoje',
                            month: 'Mês',
                            week: 'Semana',
                            day: 'Dia'
                        }}
                        locale="pt-br"
                        firstDay={1} // Segunda-feira
                        allDayText="Dia int."
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: false
                        }}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false
                        }}
                        nowIndicator={true}
                        editable={true} // Permite arrastar e redimensionar
                        selectable={true} // Permite selecionar data
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={true}
                        
                        // Chamadas
                        datesSet={handleDatesSet}
                        events={filteredEvents}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
                        eventDrop={handleEventDropOrResize}
                        eventResize={handleEventDropOrResize}
                        
                        height="auto"
                    />
                </div>
            </div>

            {/* Modal de Criação / Edição */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                            <h2 className="text-md font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">
                                    {modalMode === 'create' ? 'event_upcoming' : 'edit_calendar'}
                                </span>
                                {modalMode === 'create' ? 'Novo Compromisso' : 'Editar Compromisso'}
                            </h2>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                            
                            {/* Título do Evento */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Título *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Adicionar título"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Escolher Agenda */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Salvar na Agenda</label>
                                <select
                                    disabled={modalMode === 'edit'} // O Google não permite mover eventos entre agendas facilmente via patch
                                    value={eventCalendarId}
                                    onChange={(e) => setEventCalendarId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {calendars
                                        .filter(c => c.accessRole === 'owner' || c.accessRole === 'writer')
                                        .map(cal => (
                                            <option key={cal.id} value={cal.id}>
                                                {cal.summary} {cal.primary ? '(Principal)' : ''}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Dia Inteiro */}
                            <div className="flex items-center gap-2 py-1">
                                <input
                                    type="checkbox"
                                    id="eventAllDay"
                                    checked={eventAllDay}
                                    onChange={(e) => setEventAllDay(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-offset-slate-900"
                                />
                                <label 
                                    htmlFor="eventAllDay"
                                    className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                                >
                                    Dia inteiro
                                </label>
                            </div>

                            {/* Datas e Horários */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Início</label>
                                    <input
                                        type="date"
                                        required
                                        value={eventStartDate}
                                        onChange={(e) => {
                                            setEventStartDate(e.target.value)
                                            // Ajusta data de fim se for menor que a data de início
                                            if (new Date(eventEndDate) < new Date(e.target.value)) {
                                                setEventEndDate(e.target.value)
                                            }
                                        }}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    {!eventAllDay && (
                                        <input
                                            type="time"
                                            required
                                            value={eventStartTime}
                                            onChange={(e) => setEventStartTime(e.target.value)}
                                            className="w-full mt-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Término</label>
                                    <input
                                        type="date"
                                        required
                                        value={eventEndDate}
                                        onChange={(e) => setEventEndDate(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    {!eventAllDay && (
                                        <input
                                            type="time"
                                            required
                                            value={eventEndTime}
                                            onChange={(e) => setEventEndTime(e.target.value)}
                                            className="w-full mt-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Localização */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Localização</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Adicionar local"
                                        value={eventLocation}
                                        onChange={(e) => setEventLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Descrição</label>
                                <div className="relative">
                                    <textarea
                                        placeholder="Adicionar descrição ou observações"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    ></textarea>
                                    <AlignLeft size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                </div>
                            </div>

                            {/* Modal Footer / Ações */}
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                                {modalMode === 'edit' ? (
                                    <button
                                        type="button"
                                        disabled={submittingEvent}
                                        onClick={handleDeleteEvent}
                                        className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold rounded-xl transition-all text-xs"
                                    >
                                        <Trash2 size={14} />
                                        Excluir
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                                
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all text-xs"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingEvent}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs"
                                    >
                                        {submittingEvent && <Loader2 className="animate-spin" size={14} />}
                                        Salvar
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
