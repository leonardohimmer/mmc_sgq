"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"

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
    reportNumber?: string | null
    reportPdfUrl?: string | null
    isSigned?: boolean
}

export default function AprovacaoEnsaiosPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)

    // Form states
    const [reportNumber, setReportNumber] = useState("")
    const [reportPdfUrl, setReportPdfUrl] = useState("")
    const [isSigned, setIsSigned] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                // Only show those AGUARDANDO_APROVACAO
                const execRequests = data.filter((req: TestRequest) => req.status === 'AGUARDANDO_APROVACAO')
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
        setReportNumber(req.reportNumber || "")
        setReportPdfUrl(req.reportPdfUrl || "")
        setIsSigned(req.isSigned || false)
    }

    const handleSave = async (isApprove = false) => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const bodyData: any = {
                reportNumber,
                reportPdfUrl,
                isSigned
            }

            if (isApprove) {
                bodyData.status = 'FINALIZADO'
            }

            const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })

            if (res.ok) {
                const { request } = await res.json()

                // Update local list
                if (isApprove) {
                    setRequests(prev => prev.filter(r => r.id !== request.id))
                    setSelectedRequest(null)
                } else {
                    setRequests(prev => prev.map(r => r.id === request.id ? request : r))
                    setSelectedRequest(request)
                }

                alert(isApprove ? "Ensaio Aprovado e Finalizado com sucesso!" : "Salvo com sucesso!")
            }
        } catch (error) {
            console.error("Erro ao aprovar execução", error)
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
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Aprovação de Ensaios</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Revise os dados medidos, anexe o PDF do relatório e aprove os ensaios finalizados pelos técnicos.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Ensaios Aguardando */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Aguardando Avaliação ({requests.length})</h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhuma aprovação pendente.</p>
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
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
                                            Aguardando Aprovação
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

                {/* Formulário de Aprovação */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                <h2 className="text-xl font-bold justify-between flex items-center text-slate-800 dark:text-slate-200">
                                    Aprovação do Ensaio
                                    <span className="text-sm font-normal text-slate-500">ID: {selectedRequest.id.substring(0, 8)}...</span>
                                </h2>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de ensaio</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Norma Aplicada</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.appliedStandard || "Não informada"}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dados Medidos</p>
                                    <pre className="text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap font-sans bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">{selectedRequest.measuredData || "Nenhum dado medido."}</pre>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultado Preliminar</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.result || "Pendente"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Técnico que Executou</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.assignedTo?.name || "Não atribuído"}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observações do Técnico</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium italic">{selectedRequest.technicalObservations || "Nenhuma observação."}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Número do Relatório <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={reportNumber}
                                            onChange={(e) => setReportNumber(e.target.value)}
                                            placeholder="Ex: REL-2026-0012"
                                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Link / URL do PDF do Relatório</label>
                                        <input
                                            type="url"
                                            value={reportPdfUrl}
                                            onChange={(e) => setReportPdfUrl(e.target.value)}
                                            placeholder="https://drive.google.com/... ou link do SharePoint"
                                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center">
                                    <label className="relative flex items-center cursor-pointer gap-3">
                                        <input
                                            type="checkbox"
                                            checked={isSigned}
                                            onChange={(e) => setIsSigned(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Assinar Documento Digitalmente (Responsável Técnico)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all disabled:opacity-50"
                                >
                                    Salvar Alterações
                                </button>
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={saving || !reportNumber || !isSigned}
                                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined">verified</span>
                                    )}
                                    Aprovar e Liberar para Cliente
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                                <span className="material-symbols-outlined text-3xl">fact_check</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Selecione um ensaio para aprovação</h3>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Os ensaios concluídos pelos técnicos aparecem na lista lateral. Leia os dados coletados e realize a aprovação final.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
