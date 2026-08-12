"use client"

import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import MMCLoadingScreen from "@/components/MMCLoadingScreen"
import { formatOsCode } from "@/lib/os-balance-service"

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
    assignedTo: { name: string, email: string } | null
    createdAt: string
    appliedStandard?: string | null
    measuredData?: string | null
    result?: string | null
    technicalObservations?: string | null
    updatedAt: string
    performedAt?: string | null
    quantidadeEnsaios?: number | string | null
    executionItems?: ExecutionItem[]
}

type ItemState = {
    checkPlanilha: boolean
    checkFotos: boolean
    checkFinalizado: boolean
    observacoes: string
}

export default function ExecucaoEnsaiosPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    // Estados por item de ensaio (chave = numeroSequencial)
    const [itemStates, setItemStates] = useState<{ [seq: number]: ItemState }>({})
    const [globalObservations, setGlobalObservations] = useState("")

    useEffect(() => {
        try {
            const cached = localStorage.getItem("sgq_cache_execucao_ensaios")
            if (cached) {
                const parsed = JSON.parse(cached)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setRequests(parsed)
                    setLoading(false)
                }
            }
        } catch (e) {}
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                const execRequests = data.filter((req: TestRequest) => req.status === 'EM_EXECUCAO')
                setRequests(execRequests)
                try {
                    localStorage.setItem("sgq_cache_execucao_ensaios", JSON.stringify(execRequests))
                } catch (e) {}
            }
        } catch (error) {
            console.error("Erro ao carregar solicitações", error)
        } finally {
            setLoading(false)
        }
    }

    // Filtra EXCLUSIVAMENTE os ensaios agendados/solicitados para a execução atual
    const getItemsToExecute = (req: TestRequest): { numeroSequencial: number; id?: string; observacoes?: string | null }[] => {
        const items = req.executionItems || []
        
        // 1. Ensaios marcados especificamente para a visita atual (EM_EXECUCAO ou AGENDADO)
        const ativosNaVisita = items.filter(i => i.statusExecucao === 'EM_EXECUCAO' || i.statusExecucao === 'AGENDADO')
        if (ativosNaVisita.length > 0) {
            return ativosNaVisita.map(i => ({ numeroSequencial: i.numeroSequencial, id: i.id, observacoes: i.observacoes }))
        }

        // 2. Se não houver itens com EM_EXECUCAO ou AGENDADO, pega apenas o 1º item pendente de execução
        const pendentesSemEntrega = items.filter(i => i.statusEntrega !== 'ENVIADO_AO_CLIENTE' && i.statusExecucao !== 'CONCLUIDO' && i.statusExecucao !== 'APROVADO')
        if (pendentesSemEntrega.length > 0) {
            return [pendentesSemEntrega[0]].map(i => ({ numeroSequencial: i.numeroSequencial, id: i.id, observacoes: i.observacoes }))
        }

        return [{ numeroSequencial: 1, observacoes: null }]
    }

    const handleSelectRequest = (req: TestRequest) => {
        setSelectedRequest(req)
        setGlobalObservations(req.technicalObservations || "")

        const items = getItemsToExecute(req)
        const initialStates: { [seq: number]: ItemState } = {}

        items.forEach(item => {
            const existingItem = (req.executionItems || []).find(i => i.numeroSequencial === item.numeroSequencial)
            const isCompleted = existingItem?.statusExecucao === 'CONCLUIDO' || existingItem?.statusExecucao === 'APROVADO'

            initialStates[item.numeroSequencial] = {
                checkPlanilha: isCompleted,
                checkFotos: isCompleted,
                checkFinalizado: isCompleted,
                observacoes: existingItem?.observacoes || item.observacoes || ""
            }
        })

        setItemStates(initialStates)
    }

    const updateItemState = (seq: number, field: keyof ItemState, value: any) => {
        setItemStates(prev => ({
            ...prev,
            [seq]: {
                ...prev[seq],
                [field]: value
            }
        }))
    }

    const handleSave = async (isSubmitForApproval = false) => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const itemsToExec = getItemsToExecute(selectedRequest)

            // 1. Atualizar status individual de cada item de ensaio via API
            for (const item of itemsToExec) {
                const st = itemStates[item.numeroSequencial] || { checkPlanilha: false, checkFotos: false, checkFinalizado: false, observacoes: "" }
                const isItemDone = st.checkPlanilha && st.checkFotos && st.checkFinalizado

                await fetch(`/api/solicitacoes/${selectedRequest.id}/itens`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        numeroSequencial: item.numeroSequencial,
                        statusExecucao: isItemDone ? 'CONCLUIDO' : 'EM_EXECUCAO',
                        dataExecucao: new Date().toISOString(),
                        observacoes: st.observacoes
                    })
                })
            }

            // 2. Se for para avançar de etapa, atualiza a solicitação para ELABORANDO_RELATORIO
            if (isSubmitForApproval) {
                const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'ELABORANDO_RELATORIO',
                        step: 5,
                        performedAt: new Date().toISOString(),
                        technicalObservations: globalObservations
                    })
                })

                if (res.ok) {
                    try { localStorage.removeItem("sgq_cache_execucao_ensaios") } catch (e) {}
                    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                    setSelectedRequest(null)
                    setIsSuccessModalOpen(true)
                } else {
                    toast.error("Erro ao avançar etapa para Elaboração do Relatório.")
                }
            } else {
                toast.success("Progresso dos ensaios salvo com sucesso!")
            }
        } catch (error) {
            console.error("Erro ao salvar execução", error)
            toast.error("Erro ao salvar os dados.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <MMCLoadingScreen
                compact={true}
                message="Carregando ensaios em execução..."
                submessage="Sincronizando tarefas de laboratório com a MMC LAB"
            />
        )
    }

    const itemsToExecute = selectedRequest ? getItemsToExecute(selectedRequest) : []
    const totalContratado = selectedRequest?.quantidadeEnsaios ? (parseInt(String(selectedRequest.quantidadeEnsaios)) || 1) : Math.max(1, selectedRequest?.executionItems?.length || 1)
    const allItemsValidated = itemsToExecute.length > 0 && itemsToExecute.every(item => {
        const st = itemStates[item.numeroSequencial]
        return st && st.checkPlanilha && st.checkFotos && st.checkFinalizado
    })

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Execução de Ensaios</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Confirme as etapas e a validação dos ensaios solicitados nesta visita para enviar para elaboração do relatório.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Ensaios em Execução */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Em Execução ({requests.length})</h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">assignment_turned_in</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhum ensaio em execução no momento.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {requests.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => handleSelectRequest(req)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRequest?.id === req.id ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                            OS {formatOsCode(req)}
                                        </span>
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

                {/* Formulário de Execução dos Ensaios */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4">
                                <div>
                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                        OS {formatOsCode(selectedRequest)}
                                    </span>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">
                                        Preenchimento de Ensaio
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Confirme os checkpoints dos {itemsToExecute.length} ensaio(s) solicitados nesta visita (contrato total: {totalContratado} ensaios).
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Status da Validação</span>
                                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block mt-1 ${allItemsValidated ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300'}`}>
                                        {allItemsValidated ? 'Todos Validados' : 'Pendente de Validação'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de ensaio (Referência)</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedRequest.type}
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed font-medium"
                                    />
                                </div>

                                {/* Lista dos Ensaios a Preencher */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                        <span>Ensaios Solicitados nesta Visita ({itemsToExecute.length} de {totalContratado})</span>
                                        <span className="text-xs font-normal text-slate-500">Valide cada ensaio individualmente</span>
                                    </h3>

                                    {itemsToExecute.map((item) => {
                                        const st = itemStates[item.numeroSequencial] || { checkPlanilha: false, checkFotos: false, checkFinalizado: false, observacoes: "" }
                                        const isItemComplete = st.checkPlanilha && st.checkFotos && st.checkFinalizado

                                        return (
                                            <div key={item.numeroSequencial} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-200/80 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                            #{item.numeroSequencial}
                                                        </span>
                                                        <div>
                                                            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                                                                Ensaio {item.numeroSequencial} de {totalContratado}
                                                            </h4>
                                                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                                                                OS {formatOsCode(selectedRequest, item.numeroSequencial)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                                                        isItemComplete ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300'
                                                    }`}>
                                                        <span className="material-symbols-outlined text-[14px]">{isItemComplete ? 'check_circle' : 'pending'}</span>
                                                        {isItemComplete ? 'Ensaio Concluído' : 'Pendente'}
                                                    </span>
                                                </div>

                                                {/* Checklist do Ensaio #N */}
                                                <div className="space-y-2.5">
                                                    <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${st.checkPlanilha ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkPlanilha}
                                                            onChange={(e) => updateItemState(item.numeroSequencial, 'checkPlanilha', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Planilha preenchida?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">A planilha de dados do ensaio #{item.numeroSequencial} (OS {formatOsCode(selectedRequest, item.numeroSequencial)}) foi totalmente preenchida.</p>
                                                        </div>
                                                        {st.checkPlanilha && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>

                                                    <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${st.checkFotos ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkFotos}
                                                            onChange={(e) => updateItemState(item.numeroSequencial, 'checkFotos', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Fotos registradas?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">As fotos do ensaio #{item.numeroSequencial} foram tiradas e organizadas.</p>
                                                        </div>
                                                        {st.checkFotos && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>

                                                    <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${st.checkFinalizado ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/15' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={st.checkFinalizado}
                                                            onChange={(e) => updateItemState(item.numeroSequencial, 'checkFinalizado', e.target.checked)}
                                                            className="w-4 h-4 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Ensaio finalizado?</span>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Todas as medições e coletas do ensaio #{item.numeroSequencial} foram concluídas.</p>
                                                        </div>
                                                        {st.checkFinalizado && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </label>
                                                </div>

                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                        Observações Técnicas do Ensaio #{item.numeroSequencial}
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={st.observacoes}
                                                        onChange={(e) => updateItemState(item.numeroSequencial, 'observacoes', e.target.value)}
                                                        placeholder={`Condições atípicas, ressalvas ou observações do ensaio #${item.numeroSequencial}...`}
                                                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observações Gerais do Processo (Opcional)</label>
                                    <textarea
                                        rows={3}
                                        value={globalObservations}
                                        onChange={(e) => setGlobalObservations(e.target.value)}
                                        placeholder="Comentários gerais para a equipe de relatório..."
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none text-xs"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                    Validação: {itemsToExecute.filter(i => {
                                        const st = itemStates[i.numeroSequencial]
                                        return st && st.checkPlanilha && st.checkFotos && st.checkFinalizado
                                    }).length} de {itemsToExecute.length} ensaio(s) validados
                                </span>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleSave(false)}
                                        disabled={saving}
                                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-all disabled:opacity-50"
                                    >
                                        Salvar Rascunho
                                    </button>
                                    <button
                                        onClick={() => handleSave(true)}
                                        disabled={saving || !allItemsValidated}
                                        className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-[16px]">send</span>
                                        )}
                                        Avançar para Elaboração do Relatório
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <span className="material-symbols-outlined text-3xl">edit_note</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum ensaio selecionado</h3>
                            <p className="text-slate-500 mt-2 max-w-sm text-xs">
                                Selecione um ensaio da lista ao lado para iniciar ou continuar o preenchimento dos dados.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Enviado com sucesso!"
                message="A solicitação foi movida para a etapa de Elaboração do Relatório."
            />
        </div>
    )
}
