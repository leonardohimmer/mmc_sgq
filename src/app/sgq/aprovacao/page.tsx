"use client"

import { useSession } from "next-auth/react"
import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"
import { Suspense, useState, useEffect } from "react"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"
import { getCountdownMessage } from "@/lib/dateUtils"
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
    quantidadeEnsaios?: number | string | null
    executionItems?: ExecutionItem[]
}

type ItemApprovalState = {
    reportNumber: string
    reportPdfUrl: string
    fileName?: string
    isApproved: boolean
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

    // Estados de aprovação por item de ensaio
    const [itemApprovalStates, setItemApprovalStates] = useState<{ [seq: number]: ItemApprovalState }>({})
    const [globalReportPdfUrl, setGlobalReportPdfUrl] = useState("")

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

                const filtered = data.filter((req: TestRequest) => {
                    if (req.status !== 'AGUARDANDO_APROVACAO') return false
                    
                    const typeNormal = req.type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    
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
                    }
                    
                    if (isResponsavelTecnico && !isDesenvolvedor && !isDiretor) {
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

    const getItemsToApprove = (req: TestRequest): { numeroSequencial: number; id?: string }[] => {
        const items = req.executionItems || []
        const pendentes = items.filter(i => i.statusEntrega !== 'ENVIADO_AO_CLIENTE')
        if (pendentes.length > 0) {
            return pendentes.map(i => ({ numeroSequencial: i.numeroSequencial, id: i.id }))
        }

        const count = Math.max(1, typeof req.quantidadeEnsaios === 'number' ? req.quantidadeEnsaios : parseInt(String(req.quantidadeEnsaios || '1')) || 1)
        return Array.from({ length: count }, (_, idx) => ({
            numeroSequencial: idx + 1
        }))
    }

    const handleSelectRequest = (req: TestRequest) => {
        setSelectedRequest(req)
        setGlobalReportPdfUrl(req.reportPdfUrl || "")

        const items = getItemsToApprove(req)
        const initialStates: { [seq: number]: ItemApprovalState } = {}

        items.forEach(item => {
            const existingItem = (req.executionItems || []).find(i => i.numeroSequencial === item.numeroSequencial)
            const pdfUrl = existingItem?.reportPdfUrl || req.reportPdfUrl || ""
            initialStates[item.numeroSequencial] = {
                reportNumber: existingItem?.reportNumber || `REL-${formatOsCode(req, item.numeroSequencial)}`,
                reportPdfUrl: pdfUrl,
                fileName: pdfUrl ? (pdfUrl.startsWith('data:') ? `Laudo_Ensaio_${item.numeroSequencial}.pdf` : 'Arquivo PDF Anexado') : '',
                isApproved: true
            }
        })

        setItemApprovalStates(initialStates)
    }

    const updateItemApprovalState = (seq: number, field: keyof ItemApprovalState, value: any) => {
        setItemApprovalStates(prev => ({
            ...prev,
            [seq]: {
                ...prev[seq],
                [field]: value
            }
        }))
    }

    const handleFileUpload = (seq: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                updateItemApprovalState(seq, 'reportPdfUrl', result)
                updateItemApprovalState(seq, 'fileName', file.name)
                toast.success(`PDF "${file.name}" anexado ao Laudo #${seq}!`)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async (isApproveAndSend = false) => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const itemsToApprove = getItemsToApprove(selectedRequest)

            // 1. Atualiza os dados de laudo por item e faz envio parcial
            for (const item of itemsToApprove) {
                const st = itemApprovalStates[item.numeroSequencial]
                if (st) {
                    await fetch(`/api/solicitacoes/${selectedRequest.id}/itens`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            numeroSequencial: item.numeroSequencial,
                            reportNumber: st.reportNumber,
                            reportPdfUrl: st.reportPdfUrl || globalReportPdfUrl,
                            ...(isApproveAndSend ? { statusEntrega: 'ENVIADO_AO_CLIENTE', statusFaturamento: 'LIBERADO' } : {})
                        })
                    })

                    if (isApproveAndSend) {
                        // Notifica o cliente e gera pesquisa de satisfação para cada laudo aprovado
                        await fetch(`/api/solicitacoes/${selectedRequest.id}/enviar-relatorio-parcial`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                numeroSequencial: item.numeroSequencial,
                                reportNumber: st.reportNumber,
                                reportPdfUrl: st.reportPdfUrl || globalReportPdfUrl
                            })
                        })
                    }
                }
            }

            // 2. Se aprovar e enviar relatórios ao cliente, avança a solicitação para COBRANCA
            if (isApproveAndSend) {
                const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'COBRANCA',
                        step: 7,
                        isSigned: true,
                        reportPdfUrl: globalReportPdfUrl
                    })
                })

                if (res.ok) {
                    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                    setSelectedRequest(null)
                    setIsSuccessModalOpen(true)
                } else {
                    toast.error("Erro ao finalizar aprovação.")
                }
            } else {
                toast.success("Informações dos laudos salvas com sucesso!")
            }
        } catch (error) {
            console.error("Erro ao aprovar e enviar relatórios", error)
            toast.error("Erro de conexão ao processar aprovação.")
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

    const itemsToApprove = selectedRequest ? getItemsToApprove(selectedRequest) : []
    const totalContratado = selectedRequest?.quantidadeEnsaios ? (parseInt(String(selectedRequest.quantidadeEnsaios)) || 1) : Math.max(1, selectedRequest?.executionItems?.length || 1)
    
    // Validação estrita: Todos os ensaios da aprovação PRECISAM ter um arquivo PDF anexado
    const allItemsHavePdf = itemsToApprove.length > 0 && itemsToApprove.every(item => {
        const st = itemApprovalStates[item.numeroSequencial]
        return st && Boolean(st.reportPdfUrl && st.reportPdfUrl.trim().length > 0)
    })

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Aprovação e Envio de Relatórios</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Anexe os arquivos PDF e aprove os laudos individuais dos ensaios realizados para enviar diretamente ao cliente.
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
                                    <div className="flex justify-between items-start mb-2 gap-2">
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
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4">
                                <div>
                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                        OS {formatOsCode(selectedRequest)}
                                    </span>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">
                                        Aprovação dos Relatórios
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Anexe os arquivos PDF e envie os laudos técnicos dos {itemsToApprove.length} ensaio(s) solicitados (contrato total: {totalContratado} ensaios).
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block ${
                                        allItemsHavePdf ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300'
                                    }`}>
                                        {allItemsHavePdf ? 'Todos PDFs Anexados' : `${itemsToApprove.filter(i => itemApprovalStates[i.numeroSequencial]?.reportPdfUrl).length}/${itemsToApprove.length} PDFs Anexados`}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                {/* Informações do Cliente */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Cliente</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedRequest.clientName}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tipo de Ensaio</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedRequest.type}</span>
                                    </div>
                                </div>

                                {/* Lista de Laudos a Aprovar por Ensaio */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                        <span>Anexo dos Relatórios para Envio ({itemsToApprove.length} de {totalContratado})</span>
                                        <span className="text-xs font-normal text-slate-500">Obrigatório anexar o PDF de cada laudo</span>
                                    </h3>

                                    {itemsToApprove.map((item) => {
                                        const st = itemApprovalStates[item.numeroSequencial] || {
                                            reportNumber: `REL-${formatOsCode(selectedRequest, item.numeroSequencial)}`,
                                            reportPdfUrl: selectedRequest.reportPdfUrl || "",
                                            fileName: "",
                                            isApproved: true
                                        }

                                        const hasPdf = Boolean(st.reportPdfUrl && st.reportPdfUrl.trim().length > 0)

                                        return (
                                            <div key={item.numeroSequencial} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
                                                <div className="flex justify-between items-center pb-3 border-b border-slate-200/80 dark:border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                            #{item.numeroSequencial}
                                                        </span>
                                                        <div>
                                                            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                                                                Laudo Técnico - Ensaio {item.numeroSequencial} de {totalContratado}
                                                            </h4>
                                                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                                                                OS {formatOsCode(selectedRequest, item.numeroSequencial)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                                                        hasPdf ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-300'
                                                    }`}>
                                                        <span className="material-symbols-outlined text-[13px]">{hasPdf ? 'task_alt' : 'error'}</span>
                                                        {hasPdf ? 'PDF Anexado' : 'PDF Pendente'}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                            Número do Laudo #{item.numeroSequencial}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={st.reportNumber}
                                                            onChange={(e) => updateItemApprovalState(item.numeroSequencial, 'reportNumber', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </div>

                                                    {/* Caixa de Anexo do PDF por Laudo */}
                                                    <div className="space-y-1.5">
                                                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                            Anexar Arquivo do Laudo #{item.numeroSequencial} <span className="text-red-500">*</span>
                                                        </label>

                                                        {hasPdf ? (
                                                            <div className="flex items-center justify-between p-3.5 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                                                                        <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                                                                    </div>
                                                                    <div className="truncate">
                                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                                                                            {st.fileName || `Laudo_Ensaio_${item.numeroSequencial}.pdf`}
                                                                        </span>
                                                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                                            ✓ PDF Anexado e Pronto para Envio
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    {st.reportPdfUrl.startsWith('http') && (
                                                                        <a
                                                                            href={st.reportPdfUrl}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="px-2.5 py-1 text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                                                                        >
                                                                            Visualizar
                                                                        </a>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            updateItemApprovalState(item.numeroSequencial, 'reportPdfUrl', '')
                                                                            updateItemApprovalState(item.numeroSequencial, 'fileName', '')
                                                                        }}
                                                                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                                                                        title="Remover arquivo"
                                                                    >
                                                                        <span className="material-symbols-outlined text-xl">delete</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center group cursor-pointer">
                                                                <input
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    onChange={(e) => handleFileUpload(item.numeroSequencial, e)}
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                />
                                                                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                                                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors">
                                                                        upload_file
                                                                    </span>
                                                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                        Clique para selecionar ou arraste o PDF do Laudo #{item.numeroSequencial}
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400">
                                                                        Selecione o arquivo do relatório final em PDF
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <input
                                                            type="text"
                                                            value={st.reportPdfUrl.startsWith('data:') ? '' : st.reportPdfUrl}
                                                            onChange={(e) => {
                                                                updateItemApprovalState(item.numeroSequencial, 'reportPdfUrl', e.target.value)
                                                                updateItemApprovalState(item.numeroSequencial, 'fileName', e.target.value ? 'Link Externo PDF' : '')
                                                            }}
                                                            placeholder="Ou informe aqui a URL/link do PDF..."
                                                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-all disabled:opacity-50"
                                >
                                    Salvar Alterações
                                </button>
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={saving || !allItemsHavePdf}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-[16px]">send</span>
                                    )}
                                    Aprovar e Enviar Relatórios ao Cliente
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum ensaio selecionado</h3>
                            <p className="text-slate-500 mt-2 max-w-sm text-xs">
                                Selecione um ensaio da lista ao lado para aprovar os relatórios e enviar ao cliente.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Relatórios Aprovados e Enviados!"
                message="Os laudos individuais foram enviados para o cliente junto com a Pesquisa de Satisfação. A solicitação avançou para a Cobrança."
            />
        </div>
    )
}

export default function AprovacaoPage() {
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
