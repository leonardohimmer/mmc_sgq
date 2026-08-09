"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"
import { formatOsCode } from "@/lib/os-balance-service"

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
    clientPhone?: string | null
    clientEmail?: string | null
    createdAt: string
    quantidadeEnsaios?: string | number | null
    qtdContratada?: number | null
    executionItems?: any[]
    partialInvoices?: any[]
}

export default function AguardandoAgendamentoPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    // Form states
    const [scheduledConfirmed, setScheduledConfirmed] = useState(false)
    const [qtdAgendar, setQtdAgendar] = useState<number>(1)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                const execRequests = data.filter((req: TestRequest) => req.status === 'AGUARDANDO_AGENDAMENTO')
                setRequests(execRequests)
            }
        } catch (error) {
            console.error("Erro ao carregar solicitações", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectRequest = (req: TestRequest) => {
        setSelectedRequest(req)
        setScheduledConfirmed(false)
        const total = Math.max(
            req.quantidadeEnsaios ? parseInt(String(req.quantidadeEnsaios)) || 1 : 1,
            req.executionItems?.length || 1
        )
        const entregues = (req.executionItems || []).filter(
            (i: any) => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO'
        ).length
        const agendadosPeloCliente = (req.executionItems || []).filter(
            (i: any) => i.statusExecucao === 'AGENDADO'
        ).length
        const disp = Math.max(0, total - entregues)
        setQtdAgendar(agendadosPeloCliente > 0 ? agendadosPeloCliente : (disp > 0 ? disp : 1))
    }

    const handleSave = async () => {
        if (!selectedRequest || !scheduledConfirmed) return

        setSaving(true)
        try {
            const res = await fetch(`/api/solicitacoes/iniciar-execucao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: selectedRequest.id,
                    user: session?.user?.name,
                    qtdAExecutar: qtdAgendar
                })
            })

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                setSelectedRequest(null)
                setIsSuccessModalOpen(true)
            } else {
                toast.error("Erro ao confirmar.")
            }
        } catch (error) {
            console.error("Erro ao avançar pedido", error)
            toast.error("Erro ao salvar os dados.")
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

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Aguardando Agendamento</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Propostas aceitas pelo cliente. Confirme a negociação do agendamento para liberar a execução do ensaio.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Ensaios Aguardando Proposta */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Aguardando Agendamento ({requests.length})</h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhuma solicitação aguardando agendamento no momento.</p>
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

                {/* Confirmar Agendamento */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                <h2 className="text-xl font-bold justify-between flex items-center text-slate-800 dark:text-slate-200">
                                    Resumo do Contato
                                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                        OS {formatOsCode(selectedRequest)}
                                    </span>
                                </h2>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente (Sistema)</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.clientName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Contratante</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.contractorName || "Não informado"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail do Cliente</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.clientEmail || "Não informado"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone do Cliente</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.clientPhone || "Não informado"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de ensaio</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Desejada Pelo Cliente</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{format(new Date(selectedRequest.desiredDate), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Obra e Local</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.location}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Localização para Referência</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.address || "Não informado"}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail de Contato (Relatórios / Propostas)</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                                        Propostas: {selectedRequest.proposalEmail || "Não informado"} <br/>
                                        Relatórios: {selectedRequest.reportEmail || "Não informado"}
                                    </p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observações e Datas Alternativas</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium italic">{selectedRequest.observations || "Nenhuma observação informada."}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-5 flex-1">
                                {/* Seção de Saldo e Quantidade a Realizar */}
                                {(() => {
                                    const totalContratado = Math.max(
                                        selectedRequest.quantidadeEnsaios ? parseInt(String(selectedRequest.quantidadeEnsaios)) || 1 : 1,
                                        selectedRequest.executionItems?.length || 1
                                    );
                                    const qtdConcluida = (selectedRequest.executionItems || []).filter(
                                        (i: any) => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO'
                                    ).length;
                                    const totalDisponivel = Math.max(0, totalContratado - qtdConcluida);

                                    return (
                                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 shadow-xs">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">account_balance_wallet</span>
                                                        Saldo de Ensaios do Contrato
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        Escolha a quantidade de ensaios que serão executados nesta visita/coleta
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-extrabold text-xs rounded-full shadow-xs">
                                                        Total Disponível: <strong className="text-blue-900 dark:text-white text-sm ml-1">{totalDisponivel}</strong> de {totalContratado}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Indicadores numéricos de Saldo */}
                                            <div className="grid grid-cols-3 gap-3 text-center">
                                                <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Contratado</span>
                                                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{totalContratado} {totalContratado === 1 ? 'ensaio' : 'ensaios'}</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Laudos Entregues</span>
                                                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{qtdConcluida}</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
                                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Saldo Restante</span>
                                                    <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-300">{totalDisponivel}</span>
                                                </div>
                                            </div>

                                            {/* Seleção de Quantidade a Realizar */}
                                            <div className="pt-2 space-y-2">
                                                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                    <span>Quantidade de Ensaios a Realizar nesta Visita:</span>
                                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                                                        {qtdAgendar} {qtdAgendar === 1 ? 'ensaio selecionado' : 'ensaios selecionados'}
                                                    </span>
                                                </label>

                                                {totalDisponivel > 0 ? (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {Array.from({ length: totalDisponivel }, (_, i) => i + 1).map((num) => (
                                                            <button
                                                                key={num}
                                                                type="button"
                                                                onClick={() => setQtdAgendar(num)}
                                                                className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1 border shadow-xs ${
                                                                    qtdAgendar === num
                                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                                                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                                }`}
                                                            >
                                                                <span>{num} {num === 1 ? 'Ensaio' : 'Ensaios'}</span>
                                                                {num === totalDisponivel && totalDisponivel > 1 && (
                                                                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-bold ml-1 ${qtdAgendar === num ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                                        Total
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400 text-xs font-bold">
                                                        Todos os ensaios do contrato já foram executados.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="pt-2 flex items-center">
                                    <label className="relative flex items-center cursor-pointer gap-3 p-4 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl w-full">
                                        <input
                                            type="checkbox"
                                            checked={scheduledConfirmed}
                                            onChange={(e) => setScheduledConfirmed(e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                        />
                                        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                                            Confirmo que o agendamento da coleta / ensaio foi combinado em definitivo com o cliente.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !scheduledConfirmed}
                                    className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all disabled:opacity-50 shadow-sm flex items-center gap-2 w-full sm:w-auto"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined">event_available</span>
                                    )}
                                    Avançar para Execução do Ensaio
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-3xl">event_upcoming</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Selecione uma solicitação aceita</h3>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Aqui aparecem as propostas já aceitas pelos clientes. Entre em contato para confirmar o agendamento e marque a solicitação.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Agendamento confirmado com sucesso!"
                message="A solicitação foi movida para a etapa de Execução de Ensaios."
            />
        </div>
    )
}
