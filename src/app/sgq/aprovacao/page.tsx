"use client"

import { useSession } from "next-auth/react"
import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"
import { Suspense, useState, useEffect } from "react"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { getCountdownMessage } from "@/lib/dateUtils"

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
    updatedAt: string
    performedAt?: string | null
    appliedStandard?: string | null
    measuredData?: string | null
    result?: string | null
    technicalObservations?: string | null
    reportNumber?: string | null
    reportPdfUrl?: string | null
    isSigned?: boolean
}

function AprovacaoContent() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const area = searchParams.get('area')
    
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    // Form states
    const [reportNumber, setReportNumber] = useState("")
    const [reportPdfUrl, setReportPdfUrl] = useState("")
    const [isSigned, setIsSigned] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [area])

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const [res, profileRes] = await Promise.all([
                fetch('/api/solicitacoes'),
                fetch('/api/users/profile')
            ])

            if (res.ok && profileRes.ok) {
                const data = await res.json()
                const profileData = await profileRes.json()
                const userPermissions = profileData.profile?.permissions || []
                const userRoles = (profileData.role || "").toUpperCase().split(',').map((r: string) => r.trim())
                
                const isDesenvolvedor = userRoles.includes("DESENVOLVEDOR")
                const isDiretor = userRoles.includes("DIRETOR")
                const isResponsavelTecnico = userRoles.includes("RESPONSÁVEL TÉCNICO") || userRoles.includes("RESPONSAVEL TECNICO")

                // Filter by status and area
                const filtered = data.filter((req: TestRequest) => {
                    if (req.status !== 'AGUARDANDO_APROVACAO') return false
                    
                    const typeNormal = req.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    
                    // 1. Filtro por Área da URL (se houver)
                    if (area) {
                        if (area === 'resp_iso_acustico_lab' && !typeNormal.includes('isolamento acustico em laboratorio')) return false
                        if (area === 'resp_iso_ruido_impacto' && !typeNormal.includes('ruido de impacto')) return false
                        if (area === 'resp_mapa_ruido' && !typeNormal.includes('mapa de ruido')) return false
                        if (area === 'resp_insp_camera_acustica' && !typeNormal.includes('camera acustica')) return false
                        if (area === 'resp_ancoragem' && !typeNormal.includes('ancoragem')) return false
                        if (area === 'resp_esclerometria' && !typeNormal.includes('esclerometria')) return false
                        if (area === 'resp_guarda_corpo' && !typeNormal.includes('guarda-corpo')) return false
                        if (area === 'resp_impacto_corpo' && !typeNormal.includes('impacto de corpo')) return false
                        if (area === 'resp_pit' && !typeNormal.includes('integridade de estacas') && !typeNormal.includes('pit')) return false
                        if (area === 'resp_pecas_suspensas' && !typeNormal.includes('pecas suspensas')) return false
                        if (area === 'resp_percussao' && !typeNormal.includes('percussao')) return false
                        if (area === 'resp_permeabilidade' && !typeNormal.includes('permeabilidade')) return false
                        if (area === 'resp_arrancamento' && !typeNormal.includes('aderencia') && !typeNormal.includes('arrancamento')) return false
                        if (area === 'resp_luminico' && !typeNormal.includes('luminico')) return false
                        if (area === 'resp_insp_fachadas' && !typeNormal.includes('inspecao de fachadas')) return false
                        if (area === 'resp_insp_termografica' && !typeNormal.includes('termografica')) return false
                        
                        // Retrocompatibilidade para parâmetros de área legados
                        if (area === 'acustica' && !typeNormal.includes('acustica')) return false
                        if (area === 'aderencia' && !typeNormal.includes('aderencia')) return false
                        if (area === 'guarda-corpo' && !typeNormal.includes('guarda-corpo')) return false
                        if (area === 'luminico' && !typeNormal.includes('luminico')) return false
                        if (area === 'percussao' && !typeNormal.includes('percussao')) return false
                    }
                    
                    if (isResponsavelTecnico && !isDesenvolvedor && !isDiretor) {
                        // Se o tipo do ensaio corresponde a uma área que ele NÃO tem permissão, filtra fora
                        if (typeNormal.includes('isolamento acustico em laboratorio') && !userPermissions.includes('resp_iso_acustico_lab') && !userPermissions.includes('resp_acustica')) return false
                        if (typeNormal.includes('ruido de impacto') && !userPermissions.includes('resp_iso_ruido_impacto') && !userPermissions.includes('resp_acustica')) return false
                        if (typeNormal.includes('mapa de ruido') && !userPermissions.includes('resp_mapa_ruido') && !userPermissions.includes('resp_acustica')) return false
                        if (typeNormal.includes('camera acustica') && !userPermissions.includes('resp_insp_camera_acustica') && !userPermissions.includes('resp_acustica')) return false
                        if (typeNormal.includes('ancoragem') && !userPermissions.includes('resp_ancoragem')) return false
                        if (typeNormal.includes('esclerometria') && !userPermissions.includes('resp_esclerometria')) return false
                        if (typeNormal.includes('guarda-corpo') && !userPermissions.includes('resp_guarda_corpo')) return false
                        if (typeNormal.includes('impacto de corpo') && !userPermissions.includes('resp_impacto_corpo')) return false
                        if ((typeNormal.includes('integridade de estacas') || typeNormal.includes('pit')) && !userPermissions.includes('resp_pit')) return false
                        if (typeNormal.includes('pecas suspensas') && !userPermissions.includes('resp_pecas_suspensas')) return false
                        if (typeNormal.includes('percussao') && !userPermissions.includes('resp_percussao')) return false
                        if (typeNormal.includes('permeabilidade') && !userPermissions.includes('resp_permeabilidade')) return false
                        if ((typeNormal.includes('aderencia') || typeNormal.includes('arrancamento')) && !userPermissions.includes('resp_arrancamento') && !userPermissions.includes('resp_aderencia')) return false
                        if (typeNormal.includes('luminico') && !userPermissions.includes('resp_luminico')) return false
                        if (typeNormal.includes('inspecao de fachadas') && !userPermissions.includes('resp_insp_fachadas')) return false
                        if (typeNormal.includes('termografica') && !userPermissions.includes('resp_insp_termografica')) return false
                    }
                    
                    return true
                })
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
                bodyData.status = 'COBRANCA'
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
                    setIsSuccessModalOpen(true)
                } else {
                    setRequests(prev => prev.map(r => r.id === request.id ? request : r))
                    setSelectedRequest(request)
                    toast.success("Salvo com sucesso!")
                }
            }
        } catch (error) {
            console.error("Erro ao aprovar execução", error)
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
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Envio do relatório</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Revise os dados medidos, anexe o PDF do relatório e envie para o cliente. Após o envio, o processo seguirá para a Cobrança.
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
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 w-fit">
                                                Aguardando Aprovação
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
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Anexar Relatório (PDF)</label>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setReportPdfUrl(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    setReportPdfUrl("");
                                                }
                                            }}
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                        />
                                        {reportPdfUrl && !reportPdfUrl.startsWith('http') && !reportPdfUrl.startsWith('/') && (
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold mt-2">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Arquivo carregado com sucesso
                                            </p>
                                        )}
                                        {reportPdfUrl && (reportPdfUrl.startsWith('http') || reportPdfUrl.startsWith('/')) && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-bold mt-2">
                                                <span className="material-symbols-outlined text-[14px]">link</span> Relatório anterior via link anexado
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-4">
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

                                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                        <span className="material-symbols-outlined text-blue-500 mt-0.5 text-[20px]">info</span>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium leading-snug">
                                            Ao enviar o relatório, o processo será movido para a etapa de Cobrança no setor técnico.
                                        </p>
                                    </div>
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

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Relatório enviado com sucesso!"
                message="O processo foi movido para a etapa de Cobrança no setor técnico."
            />
        </div>
    )
}

export default function AprovacaoEnsaiosPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="h-8 w-8 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <AprovacaoContent />
        </Suspense>
    )
}

