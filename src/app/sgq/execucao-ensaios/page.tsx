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
    appliedStandard?: string | null
    measuredData?: string | null
    result?: string | null
    technicalObservations?: string | null
}

export default function ExecucaoEnsaiosPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)

    // Form states
    const [appliedStandard, setAppliedStandard] = useState("")
    const [measuredData, setMeasuredData] = useState("")
    const [result, setResult] = useState("")
    const [technicalObservations, setTechnicalObservations] = useState("")

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                // Only show those EM_EXECUCAO
                const execRequests = data.filter((req: TestRequest) => req.status === 'EM_EXECUCAO')
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
        setAppliedStandard(req.appliedStandard || "")
        setMeasuredData(req.measuredData || "")
        setResult(req.result || "")
        setTechnicalObservations(req.technicalObservations || "")
    }

    const handleSave = async (isSubmitForApproval = false) => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const bodyData: any = {
                appliedStandard,
                measuredData,
                result,
                technicalObservations
            }

            if (isSubmitForApproval) {
                // If it's submitted for approval, let's say it moves to "AGUARDANDO_APROVACAO"
                bodyData.status = 'AGUARDANDO_APROVACAO'
            }

            const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })

            if (res.ok) {
                const { request } = await res.json()

                // Update local list
                if (isSubmitForApproval) {
                    setRequests(prev => prev.filter(r => r.id !== request.id))
                    setSelectedRequest(null)
                } else {
                    setRequests(prev => prev.map(r => r.id === request.id ? request : r))
                    setSelectedRequest(request)
                }

                alert(isSubmitForApproval ? "Enviado para aprovação com sucesso!" : "Salvo com sucesso!")
            }
        } catch (error) {
            console.error("Erro ao salvar execução", error)
            alert("Erro ao salvar os dados.")
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
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Execução de Ensaios</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Preencha os dados técnicos e resultados dos ensaios em andamento.
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
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                            {req.status}
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

                {/* Formulário de Execução */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold justify-between flex items-center text-slate-800 dark:text-slate-200">
                                    Preenchimento de Ensaio
                                    <span className="text-sm font-normal text-slate-500">ID: {selectedRequest.id.substring(0, 8)}...</span>
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Preencha detalhadamente os dados coletados abaixo.
                                </p>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de ensaio (Referência)</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedRequest.type}
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Norma Aplicada</label>
                                    <input
                                        type="text"
                                        value={appliedStandard}
                                        onChange={(e) => setAppliedStandard(e.target.value)}
                                        placeholder="Ex: NBR 15575-4"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dados Medidos / Resultados Numéricos</label>
                                    <textarea
                                        rows={4}
                                        value={measuredData}
                                        onChange={(e) => setMeasuredData(e.target.value)}
                                        placeholder="Preencha os dados brutos ou medições obtidas..."
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resultado da Avaliação</label>
                                    <select
                                        value={result}
                                        onChange={(e) => setResult(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="" disabled>Selecione um resultado...</option>
                                        <option value="Aprovado">Aprovado</option>
                                        <option value="Reprovado">Reprovado</option>
                                        <option value="Inconclusivo">Inconclusivo</option>
                                        <option value="Aprovado com Restrições">Aprovado com Restrições</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observações Técnicas</label>
                                    <textarea
                                        rows={4}
                                        value={technicalObservations}
                                        onChange={(e) => setTechnicalObservations(e.target.value)}
                                        placeholder="Condições atípicas, ressalvas ou comentários do técnico..."
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all disabled:opacity-50"
                                >
                                    Salvar Rascunho
                                </button>
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={saving || !result || !appliedStandard}
                                    className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined">send</span>
                                    )}
                                    Enviar para Aprovação
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <span className="material-symbols-outlined text-3xl">edit_note</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum ensaio selecionado</h3>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Selecione um ensaio da lista ao lado para iniciar ou continuar o preenchimento dos dados.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
