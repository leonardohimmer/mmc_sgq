"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type TestRequest = {
    id: string
    type: string
    location: string
    contractorName?: string | null
    constructionCompany?: string | null
    workName?: string | null
    address?: string | null
    proposalEmail?: string | null
    reportEmail?: string | null
    desiredDate: string
    observations: string | null
    status: string
    clientName: string
    assignedToId: string | null
    assignedTo: { name: string, email: string } | null
    createdAt: string
    step?: number
}

type TechUser = {
    id: string
    name: string
}

export default function MeusEnsaiosPage() {
    const { data: session } = useSession()

    const [requests, setRequests] = useState<TestRequest[]>([])
    const [techUsers, setTechUsers] = useState<TechUser[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("TODOS")
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [historyModalOpen, setHistoryModalOpen] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [reqRes, usersRes] = await Promise.all([
                fetch('/api/solicitacoes'),
                fetch('/api/users/tecnicos')
            ])

            if (reqRes.ok) setRequests(await reqRes.json())
            if (usersRes.ok) setTechUsers(await usersRes.json())
        } catch (error) {
            console.error("Erro ao carregar dados", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/solicitacoes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                const { request } = await res.json()
                setRequests(prev => prev.map(req => req.id === id ? request : req))
            }
        } catch (error) {
            console.error("Erro ao atualizar status", error)
        } finally {
            setUpdatingId(null)
        }
    }

    const handleUpdateStep = async (id: string, newStep: number) => {
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/solicitacoes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step: newStep })
            })

            if (res.ok) {
                const { request } = await res.json()
                setRequests(prev => prev.map(req => req.id === id ? request : req))
            }
        } catch (error) {
            console.error("Erro ao atualizar etapa", error)
        } finally {
            setUpdatingId(null)
        }
    }

    const handleAssignUser = async (id: string, assignedToId: string) => {
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/solicitacoes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedToId })
            })

            if (res.ok) {
                const { request } = await res.json()
                setRequests(prev => prev.map(req => req.id === id ? request : req))
            }
        } catch (error) {
            console.error("Erro ao atribuir responsável", error)
        } finally {
            setUpdatingId(null)
        }
    }

    const filteredRequests = requests.filter(req => {
        if (filter === "TODOS") return true
        if (filter === "MEUS") return req.assignedTo?.email === session?.user?.email
        return req.status === filter
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "RECEBIDO":
                return <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wider rounded-md border border-amber-200 dark:border-amber-500/30">RECEBIDO</span>
            case "EM_EXECUCAO":
                return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider rounded-md border border-blue-200 dark:border-blue-500/30">EM EXECUÇÃO</span>
            case "FINALIZADO":
                return <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider rounded-md border border-emerald-200 dark:border-emerald-500/30">FINALIZADO</span>
            default:
                return <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold tracking-wider rounded-md">DESCONHECIDO</span>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-[32px] text-primary">science</span>
                        Gerenciador de Ensaios
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Gestão de todas as solicitações técnicas e andamentos.
                    </p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button onClick={() => setFilter("TODOS")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "TODOS" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Todos</button>
                    <button onClick={() => setFilter("MEUS")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "MEUS" ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Meus Ensaios</button>
                    <button onClick={() => setFilter("RECEBIDO")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "RECEBIDO" ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Pendentes</button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-16 text-center transition-colors">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-[40px] text-slate-400 dark:text-slate-500">search_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Nenhuma solicitação encontrada
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                        Não existem requisições de clientes cadastradas para o filtro selecionado no momento.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative group">

                            {updatingId === req.id && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                                </div>
                            )}

                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                {/* Info Principal */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(req.status)}
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            #{req.id.split('-')[0].toUpperCase()}
                                        </span>
                                        <button
                                            onClick={() => setHistoryModalOpen(req.id)}
                                            className="ml-auto xl:ml-2 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">history</span>
                                            Histórico
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                            {req.type}
                                        </h3>
                                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 space-y-1.5">
                                            <p className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                                                <span className="text-slate-700 dark:text-slate-300">{req.contractorName || req.clientName}</span>
                                            </p>
                                            {req.constructionCompany && (
                                                <p className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px] text-emerald-500">handyman</span>
                                                    <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{req.constructionCompany}</span>
                                                </p>
                                            )}
                                            <p className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">domain</span>
                                                <span className="text-slate-700 dark:text-slate-300">{req.workName || 'Obra não especificada'}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                                                <span className="text-slate-700 dark:text-slate-300">{req.address || req.location}</span>
                                            </p>
                                            {(req.proposalEmail || req.reportEmail) && (
                                                <div className="flex gap-4 mt-2">
                                                    {req.proposalEmail && (
                                                        <p className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[16px] text-emerald-500">mail</span>
                                                            <span className="text-slate-700 dark:text-slate-300 text-xs">Prop: {req.proposalEmail}</span>
                                                        </p>
                                                    )}
                                                    {req.reportEmail && (
                                                        <p className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[16px] text-blue-500">drafts</span>
                                                            <span className="text-slate-700 dark:text-slate-300 text-xs">Rel: {req.reportEmail}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 inline-block">
                                        <strong className="text-slate-900 dark:text-white mr-2">Data Desejada:</strong>
                                        {format(new Date(req.desiredDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                    </div>
                                    {req.observations && (
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                            <strong className="text-amber-800 dark:text-amber-500 block mb-1 text-xs uppercase tracking-wider">Observações do Cliente</strong>
                                            {req.observations}
                                        </div>
                                    )}
                                </div>

                                {/* Ações / Controles */}
                                <div className="flex flex-col sm:flex-row xl:flex-col gap-4 min-w-[280px]">

                                    {/* Responsável Técnico seleciton removed as requested */}                                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Alterar Status</label>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={req.status === "EM_EXECUCAO"}
                                                onClick={() => handleUpdateStatus(req.id, "EM_EXECUCAO")}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${req.status === "EM_EXECUCAO" ? "bg-blue-500 text-white cursor-default" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:border-blue-500 hover:text-blue-500"}`}
                                            >
                                                Executar
                                            </button>
                                            <button
                                                disabled={req.status === "FINALIZADO"}
                                                onClick={() => handleUpdateStatus(req.id, "FINALIZADO")}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${req.status === "FINALIZADO" ? "bg-emerald-500 text-white cursor-default" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:border-emerald-500 hover:text-emerald-500"}`}
                                            >
                                                Finalizar
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Process Timeline */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">linear_scale</span>
                                    Fluxograma de Processo de Ensaio
                                </h4>
                                <ProcessTimeline currentStep={req.step || 1} onChange={(newStep) => handleUpdateStep(req.id, newStep)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {historyModalOpen && (
                <HistoryModal
                    requestId={historyModalOpen}
                    onClose={() => setHistoryModalOpen(null)}
                    getStatusBadge={getStatusBadge}
                />
            )}
        </div>
    )
}

function HistoryModal({ requestId, onClose, getStatusBadge }: { requestId: string, onClose: () => void, getStatusBadge: (s: string) => any }) {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/solicitacoes/${requestId}`)
            .then(res => res.json())
            .then(data => {
                setHistory(data)
                setLoading(false)
            })
    }, [requestId])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-primary">history</span>
                        Histórico da Solicitação
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <p className="text-center text-slate-500 py-10 font-medium">Nenhum registro de alteração para esta solicitação.</p>
                    ) : (
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                            {history.map((log, index) => (
                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                        <span className="material-symbols-outlined text-[20px]">update</span>
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                                        <div className="flex flex-col gap-1 mb-3">
                                            <span className="text-xs font-bold text-primary">{format(new Date(log.createdAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}</span>
                                            <strong className="text-sm text-slate-900 dark:text-white">{log.changedBy}</strong>
                                        </div>
                                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400 flex flex-col gap-2">
                                            {log.oldStatus !== log.newStatus && (
                                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    Status: {getStatusBadge(log.oldStatus)} <span className="material-symbols-outlined text-[16px]">arrow_forward</span> {getStatusBadge(log.newStatus)}
                                                </div>
                                            )}
                                            {/* Could add attribution log if desired */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ProcessTimeline({ currentStep, onChange }: { currentStep: number, onChange: (step: number) => void }) {
    const stepsData = [
        { id: 1, label: "Solicitação do Cliente", icon: "mark_email_unread", color: "bg-blue-500", text: "text-blue-700 dark:text-blue-300", bgLight: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
        { id: 2, label: "Envio da Proposta", icon: "send_and_archive", color: "bg-amber-500", text: "text-amber-700 dark:text-amber-300", bgLight: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
        { id: 3, label: "Aceite da Proposta", icon: "handshake", color: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", bgLight: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
        { id: 4, label: "Agendamento", icon: "calendar_month", color: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-300", bgLight: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-200 dark:border-indigo-800" },
        { id: 5, label: "Execução do Ensaio", icon: "science", color: "bg-purple-500", text: "text-purple-700 dark:text-purple-300", bgLight: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800" },
        { id: 6, label: "Elaboração do Relatório", icon: "edit_document", color: "bg-orange-500", text: "text-orange-700 dark:text-orange-300", bgLight: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800" },
        { id: 7, label: "Aprovação do Relatório", icon: "fact_check", color: "bg-red-500", text: "text-red-700 dark:text-red-300", bgLight: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
        { id: 8, label: "Envio do Relatório", icon: "forward_to_inbox", color: "bg-teal-500", text: "text-teal-700 dark:text-teal-300", bgLight: "bg-teal-50 dark:bg-teal-900/20", border: "border-teal-200 dark:border-teal-800" },
        { id: 9, label: "Pesquisa de Satisfação", icon: "sentiment_satisfied", color: "bg-cyan-500", text: "text-cyan-700 dark:text-cyan-300", bgLight: "bg-cyan-50 dark:bg-cyan-900/20", border: "border-cyan-200 dark:border-cyan-800" },
    ]

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 -mx-2 px-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="flex items-center min-w-max gap-3 relative">
                {/* Background line connecting all elements */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 hidden sm:block"></div>

                {stepsData.map((s) => {
                    const isCompleted = s.id < currentStep
                    const isCurrent = s.id === currentStep
                    const isFuture = s.id > currentStep

                    return (
                        <div
                            key={s.id}
                            onClick={() => onChange(s.id)}
                            title={`Mudar para etapa: ${s.id} - ${s.label}`}
                            className={`
                                relative z-10 flex flex-col items-center justify-center p-3 w-[140px] h-full min-h-[110px] rounded-xl border-2 transition-all duration-300 cursor-pointer group shrink-0
                                ${isCompleted ? 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0 scale-95 hover:scale-100' : ''}
                                ${isCurrent ? `opacity-100 scale-105 shadow-lg ${s.border} ring-2 ring-offset-2 ring-primary ring-offset-white dark:ring-offset-slate-900` : ''}
                                ${isFuture ? 'opacity-90 hover:opacity-100 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-dashed' : ''}
                                ${!isFuture && !isCurrent ? `${s.bgLight} ${s.border}` : ''}
                                ${isCurrent ? s.bgLight : ''}
                            `}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white shadow-sm transition-all duration-300 ${s.color} ${isFuture ? 'opacity-30 grayscale' : 'opacity-100'} ${isCurrent ? 'scale-110 shadow-md' : ''}`}>
                                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 absolute top-1 right-2 opacity-50">{s.id}</span>
                            <span className={`text-[11px] font-bold text-center leading-tight transition-colors duration-300 ${isCurrent || isCompleted ? s.text : 'text-slate-500 dark:text-slate-400'}`}>
                                {s.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
