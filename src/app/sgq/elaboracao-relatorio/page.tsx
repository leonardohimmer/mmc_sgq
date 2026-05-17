"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { getCountdownMessage } from "@/lib/dateUtils"
import SuccessModal from "@/components/SuccessModal"

type TestRequest = {
    id: string
    type: string
    location: string
    clientName: string
    status: string
    assignedToId: string | null
    assignedTo: { name: string; email: string } | null
    createdAt: string
    updatedAt: string
    performedAt?: string | null
    appliedStandard?: string | null
    technicalObservations?: string | null
}

export default function ElaboracaoRelatorioPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [notification, setNotification] = useState<{
        isOpen: boolean
        title: string
        message: string
        type: 'success' | 'error' | 'info'
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: 'success'
    })

    // Checklist states
    const [checkNumeroRelatorio, setCheckNumeroRelatorio] = useState(false)
    const [checkInformacoes, setCheckInformacoes] = useState(false)
    const [checkDados, setCheckDados] = useState(false)
    const [checkFotos, setCheckFotos] = useState(false)
    const [observacoes, setObservacoes] = useState("")

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                const filtered = data.filter((req: TestRequest) => req.status === 'ELABORANDO_RELATORIO')
                setRequests(filtered)
            }
        } catch (error) {
            console.error("Erro ao carregar solicitações", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectRequest = (req: TestRequest) => {
        setSelectedRequest(req)
        setCheckNumeroRelatorio(false)
        setCheckInformacoes(false)
        setCheckDados(false)
        setCheckFotos(false)
        setObservacoes("")
    }

    const handleAvancar = async () => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'AGUARDANDO_APROVACAO',
                    technicalObservations: observacoes || selectedRequest.technicalObservations
                })
            })

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                setSelectedRequest(null)
                setNotification({
                    isOpen: true,
                    title: "Enviado com sucesso!",
                    message: "O relatório foi enviado para a etapa de Aprovação.",
                    type: 'success'
                })
            }
        } catch (error) {
            console.error("Erro ao avançar", error)
            setNotification({
                isOpen: true,
                title: "Erro",
                message: "Erro ao enviar para aprovação.",
                type: 'error'
            })
        } finally {
            setSaving(false)
        }
    }

    const allChecked = checkNumeroRelatorio && checkInformacoes && checkDados && checkFotos

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Elaboração de Relatório</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Confirme os itens do relatório antes de enviar para aprovação.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Aguardando Relatório ({requests.length})</h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">description</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhum ensaio aguardando elaboração de relatório.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {requests.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => handleSelectRequest(req)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRequest?.id === req.id ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 w-fit">
                                                Elaborando Relatório
                                            </span>
                                            {(() => {
                                                const countdown = getCountdownMessage(req.performedAt || req.updatedAt);
                                                return (
                                                    <span className={`text-[10px] font-medium flex items-center gap-1 ${countdown.color}`}>
                                                        <span className="material-symbols-outlined text-[12px]">timer</span>
                                                        {countdown.message}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {format(new Date(req.createdAt), 'dd/MM/yyyy')}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{req.type}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
                                        {req.clientName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Formulário de Checklist */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold justify-between flex items-center text-slate-800 dark:text-slate-200">
                                    Checklist do Relatório
                                    <span className="text-sm font-normal text-slate-500">ID: {selectedRequest.id.substring(0, 8)}...</span>
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Verifique todos os itens do relatório antes de enviar para aprovação.
                                </p>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                {/* Info do ensaio */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo de Ensaio</span>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedRequest.type}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cliente</span>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedRequest.clientName}</p>
                                    </div>
                                </div>

                                {/* Checkpoints */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Checklist de Elaboração</label>

                                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkNumeroRelatorio ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30'}`}>
                                        <input
                                            type="checkbox"
                                            checked={checkNumeroRelatorio}
                                            onChange={(e) => setCheckNumeroRelatorio(e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Número do relatório?</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">O número do relatório foi gerado e inserido corretamente.</p>
                                        </div>
                                        {checkNumeroRelatorio && <span className="material-symbols-outlined text-emerald-500 ml-auto">check_circle</span>}
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkInformacoes ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30'}`}>
                                        <input
                                            type="checkbox"
                                            checked={checkInformacoes}
                                            onChange={(e) => setCheckInformacoes(e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Informações?</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">As informações do cliente, ensaio e local estão corretas.</p>
                                        </div>
                                        {checkInformacoes && <span className="material-symbols-outlined text-emerald-500 ml-auto">check_circle</span>}
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkDados ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30'}`}>
                                        <input
                                            type="checkbox"
                                            checked={checkDados}
                                            onChange={(e) => setCheckDados(e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Dados?</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Os dados técnicos e medições foram preenchidos corretamente.</p>
                                        </div>
                                        {checkDados && <span className="material-symbols-outlined text-emerald-500 ml-auto">check_circle</span>}
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checkFotos ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30'}`}>
                                        <input
                                            type="checkbox"
                                            checked={checkFotos}
                                            onChange={(e) => setCheckFotos(e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Fotos?</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">As fotos foram inseridas e estão legíveis no relatório.</p>
                                        </div>
                                        {checkFotos && <span className="material-symbols-outlined text-emerald-500 ml-auto">check_circle</span>}
                                    </label>
                                </div>

                                {/* Progresso */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${([checkNumeroRelatorio, checkInformacoes, checkDados, checkFotos].filter(Boolean).length / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">
                                        {[checkNumeroRelatorio, checkInformacoes, checkDados, checkFotos].filter(Boolean).length}/4
                                    </span>
                                </div>

                                {/* Observações */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observações</label>
                                    <textarea
                                        rows={3}
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        placeholder="Observações adicionais sobre o relatório..."
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                                <button
                                    onClick={handleAvancar}
                                    disabled={saving || !allChecked}
                                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    )}
                                    Avançar para Aprovação do Relatório
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <span className="material-symbols-outlined text-3xl">description</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum ensaio selecionado</h3>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Selecione um ensaio da lista ao lado para verificar o checklist do relatório.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                autoClose={true}
            />
        </div>
    )
}
