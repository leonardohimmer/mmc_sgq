"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { getCountdownMessage } from "@/lib/dateUtils"
import SuccessModal from "@/components/SuccessModal"
import { formatOsCode } from "@/lib/os-balance-service"
import { toast } from "sonner"

type ExecutionItem = {
    id: string
    requestId: string
    numeroSequencial: number
    statusExecucao: string
    statusFaturamento: string
    statusEntrega: string
    dataPlanejada?: string | null
    dataExecucao?: string | null
    reportNumber?: string | null
    reportPdfUrl?: string | null
    observacoes?: string | null
}

type TestRequest = {
    id: string
    type: string
    location?: string | null
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
    assignedTo: { name: string; email: string } | null
    createdAt: string
    updatedAt: string
    performedAt?: string | null
    appliedStandard?: string | null
    technicalObservations?: string | null
    quantidadeEnsaios?: number | string | null
    executionItems?: ExecutionItem[]
}

type ItemReportState = {
    checkNumeroRelatorio: boolean
    checkInformacoes: boolean
    checkDados: boolean
    checkFotos: boolean
    reportNumber: string
    reportPdfUrl: string
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

    // Estados dos relatórios por item de ensaio (chave = numeroSequencial)
    const [itemReportStates, setItemReportStates] = useState<{ [seq: number]: ItemReportState }>({})
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

    // Pega os itens de ensaio a elaborar laudo nesta etapa
    const getItemsToReport = (req: TestRequest): { numeroSequencial: number; id?: string; reportNumber?: string | null; reportPdfUrl?: string | null }[] => {
        const items = req.executionItems || []
        // Seleciona os itens recém concluídos/em elaboração que ainda não foram aprovados/enviados
        const ativos = items.filter(i => (i.statusExecucao === 'EM_EXECUCAO' || i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO') && i.statusEntrega !== 'ENVIADO_AO_CLIENTE')
        if (ativos.length > 0) {
            return ativos.map(i => ({
                numeroSequencial: i.numeroSequencial,
                id: i.id,
                reportNumber: i.reportNumber,
                reportPdfUrl: i.reportPdfUrl
            }))
        }

        const count = Math.max(1, typeof req.quantidadeEnsaios === 'number' ? req.quantidadeEnsaios : parseInt(String(req.quantidadeEnsaios || '1')) || 1)
        return Array.from({ length: count }, (_, idx) => ({
            numeroSequencial: idx + 1
        }))
    }

    const handleSelectRequest = (req: TestRequest) => {
        setSelectedRequest(req)
        setObservacoes(req.technicalObservations || "")

        const items = getItemsToReport(req)
        const initialStates: { [seq: number]: ItemReportState } = {}

        items.forEach(item => {
            const existingItem = (req.executionItems || []).find(i => i.numeroSequencial === item.numeroSequencial)
            initialStates[item.numeroSequencial] = {
                checkNumeroRelatorio: false,
                checkInformacoes: false,
                checkDados: false,
                checkFotos: false,
                reportNumber: existingItem?.reportNumber || item.reportNumber || `REL-${formatOsCode(req, item.numeroSequencial)}`,
                reportPdfUrl: existingItem?.reportPdfUrl || item.reportPdfUrl || ""
            }
        })

        setItemReportStates(initialStates)
    }

    const updateItemReportState = (seq: number, field: keyof ItemReportState, value: any) => {
        setItemReportStates(prev => ({
            ...prev,
            [seq]: {
                ...prev[seq],
                [field]: value
            }
        }))
    }

    const handleAvancar = async () => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const itemsToReport = getItemsToReport(selectedRequest)

            // Atualiza cada item com seu número de relatório e link do PDF
            for (const item of itemsToReport) {
                const st = itemReportStates[item.numeroSequencial]
                if (st) {
                    await fetch(`/api/solicitacoes/${selectedRequest.id}/itens`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            numeroSequencial: item.numeroSequencial,
                            reportNumber: st.reportNumber,
                            ...(st.reportPdfUrl ? { reportPdfUrl: st.reportPdfUrl } : {})
                        })
                    })
                }
            }

            // Atualiza a solicitação para AGUARDANDO_APROVACAO
            const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'AGUARDANDO_APROVACAO',
                    step: 6,
                    technicalObservations: observacoes || selectedRequest.technicalObservations
                })
            })

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                setSelectedRequest(null)
                setNotification({
                    isOpen: true,
                    title: "Enviado com sucesso!",
                    message: "Os relatórios foram enviados para a etapa de Aprovação.",
                    type: 'success'
                })
            } else {
                toast.error("Erro ao enviar para aprovação.")
            }
        } catch (error) {
            console.error("Erro ao avançar", error)
            toast.error("Erro de conexão ao salvar relatórios.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    const itemsToReport = selectedRequest ? getItemsToReport(selectedRequest) : []
    const totalContratado = selectedRequest?.quantidadeEnsaios ? (parseInt(String(selectedRequest.quantidadeEnsaios)) || 1) : Math.max(1, selectedRequest?.executionItems?.length || 1)
    const allChecked = itemsToReport.length > 0 && itemsToReport.every(item => {
        const st = itemReportStates[item.numeroSequencial]
        return st && st.checkNumeroRelatorio && st.checkInformacoes && st.checkDados && st.checkFotos
    })

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Elaboração de Relatório</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Confirme o checklist e configure a identificação do relatório individual para cada ensaio antes de enviar para aprovação.
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

                {/* Formulário de Checklist por Ensaio */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4">
                                <div>
                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                        OS {formatOsCode(selectedRequest)}
                                    </span>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">
                                        Checklist dos Relatórios
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Verifique a documentação técnica individual dos {itemsToReport.length} ensaio(s) solicitados (contrato total: {totalContratado} ensaios).
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block ${allChecked ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300'}`}>
                                        {allChecked ? 'Pronto para Aprovação' : 'Pendente de Verificação'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                {/* Lista de Relatórios por Ensaio */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                        <span>Elaboração dos Relatórios ({itemsToReport.length} de {totalContratado})</span>
                                        <span className="text-xs font-normal text-slate-500">Configure cada laudo individualmente</span>
                                    </h3>

                                    {itemsToReport.map((item) => {
                                        const st = itemReportStates[item.numeroSequencial] || {
                                            checkNumeroRelatorio: false,
                                            checkInformacoes: false,
                                            checkDados: false,
                                            checkFotos: false,
                                            reportNumber: `REL-${formatOsCode(selectedRequest, item.numeroSequencial)}`,
                                            reportPdfUrl: ""
                                        }
                                        const isItemReady = st.checkNumeroRelatorio && st.checkInformacoes && st.checkDados && st.checkFotos

                                        return (
                                            <div key={item.numeroSequencial} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-200/80 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                                                            #{item.numeroSequencial}
                                                        </span>
                                                        <div>
                                                            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                                                                Relatório do Ensaio {item.numeroSequencial} de {totalContratado}
                                                            </h4>
                                                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                                                                OS {formatOsCode(selectedRequest, item.numeroSequencial)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                                                        isItemReady ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300'
                                                    }`}>
                                                        <span className="material-symbols-outlined text-[14px]">{isItemReady ? 'check_circle' : 'pending'}</span>
                                                        {isItemReady ? 'Relatório Pronto' : 'Pendente'}
                                                    </span>
                                                </div>

                                                {/* Identificação do Laudo */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                            Número do Relatório #{item.numeroSequencial}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={st.reportNumber}
                                                            onChange={(e) => updateItemReportState(item.numeroSequencial, 'reportNumber', e.target.value)}
                                                            placeholder="Ex: REL-2026-001_1"
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                            Link / URL do PDF do Laudo #{item.numeroSequencial} (Opcional nesta etapa)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={st.reportPdfUrl}
                                                            onChange={(e) => updateItemReportState(item.numeroSequencial, 'reportPdfUrl', e.target.value)}
                                                            placeholder="Ex: https://.../laudo_ensaio_1.pdf"
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Checkpoints de Elaboração do Relatório #N */}
                                                <div className="space-y-2">
                                                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${st.checkNumeroRelatorio ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkNumeroRelatorio}
                                                            onChange={(e) => updateItemReportState(item.numeroSequencial, 'checkNumeroRelatorio', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Número do relatório gerado?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">O número de identificação do relatório #{item.numeroSequencial} está correto.</p>
                                                        </div>
                                                        {st.checkNumeroRelatorio && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>

                                                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${st.checkInformacoes ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkInformacoes}
                                                            onChange={(e) => updateItemReportState(item.numeroSequencial, 'checkInformacoes', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Informações cadastrais revisadas?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Dados do cliente, obra e normas técnicas estão corretos no laudo #{item.numeroSequencial}.</p>
                                                        </div>
                                                        {st.checkInformacoes && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>

                                                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${st.checkDados ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkDados}
                                                            onChange={(e) => updateItemReportState(item.numeroSequencial, 'checkDados', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Medições e dados calculados?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Os resultados das medições do ensaio #{item.numeroSequencial} foram validados.</p>
                                                        </div>
                                                        {st.checkDados && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>

                                                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${st.checkFotos ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkFotos}
                                                            onChange={(e) => updateItemReportState(item.numeroSequencial, 'checkFotos', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Anexo fotográfico conferido?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Fotos das coletas estão legíveis no laudo #{item.numeroSequencial}.</p>
                                                        </div>
                                                        {st.checkFotos && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observações da Elaboração</label>
                                    <textarea
                                        rows={3}
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        placeholder="Observações adicionais para o Responsável Técnico que irá aprovar os laudos..."
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none text-xs"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                    Status: {itemsToReport.filter(i => {
                                        const st = itemReportStates[i.numeroSequencial]
                                        return st && st.checkNumeroRelatorio && st.checkInformacoes && st.checkDados && st.checkFotos
                                    }).length} de {itemsToReport.length} relatório(s) prontos
                                </span>
                                <button
                                    onClick={handleAvancar}
                                    disabled={saving || !allChecked}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                            <p className="text-slate-500 mt-2 max-w-sm text-xs">
                                Selecione um ensaio da lista ao lado para verificar o checklist e laudos.
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
