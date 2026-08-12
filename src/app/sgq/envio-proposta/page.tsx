"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"
import ConfirmModal from "@/components/ConfirmModal"
import { formatOsCode } from "@/lib/os-balance-service"

type TestRequest = {
    id: string
    type: string
    location: string
    contractorName?: string | null
    constructionCompany?: string | null
    workName?: string | null
    address?: string | null
    rua?: string | null
    numero?: string | null
    bairro?: string | null
    cidade?: string | null
    estado?: string | null
    cep?: string | null
    emailsProposta?: string[]
    emailsRelatorio?: string[]
    proposalEmail?: string | null
    reportEmail?: string | null
    desiredDate: string
    datasDesejadas?: string | null
    quantidadeEnsaios?: string | null
    observations: string | null
    status: string
    clientName: string
    clientEmail?: string | null
    clientPhone?: string | null
    createdAt: string
    updatedAt: string
}

export default function EnvioPropostaPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [awaitingAcceptance, setAwaitingAcceptance] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    // Confirm Modal
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        title: string
        message: string
        onConfirm: () => void
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {}
    })

    // Form states
    const [proposalCode, setProposalCode] = useState("")
    const [proposalPdfUrl, setProposalPdfUrl] = useState("")
    const [emailConfirmed, setEmailConfirmed] = useState(false)

    // Manual Acceptance Modal States
    const [acceptanceModalRequest, setAcceptanceModalRequest] = useState<TestRequest | null>(null)
    const [acceptanceChannel, setAcceptanceChannel] = useState<string>("WhatsApp")
    const [acceptanceProofUrl, setAcceptanceProofUrl] = useState<string>("")
    const [acceptanceNotes, setAcceptanceNotes] = useState<string>("")
    const [submittingAcceptance, setSubmittingAcceptance] = useState<boolean>(false)

    useEffect(() => {
        fetchRequests()
        const interval = setInterval(fetchRequests, 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                const pending = data.filter((req: TestRequest) => req.status === 'RECEBIDO')
                const sent = data.filter((req: TestRequest) => req.status === 'AGUARDANDO_ACEITE')
                
                setRequests(pending)
                setAwaitingAcceptance(sent)
            }
        } catch (error) {
            console.error("Erro ao carregar solicitações", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectRequest = (req: TestRequest) => {
        setSelectedRequest(req)
        setProposalCode("")
        setProposalPdfUrl("")
        setEmailConfirmed(false)
    }

    const handleDeleteRequest = (req: TestRequest, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        setConfirmModal({
            isOpen: true,
            title: "Excluir Proposta",
            message: `Tem certeza que deseja excluir a proposta de "${req.type}" (${req.clientName})? Esta ação não pode ser desfeita.`,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/solicitacoes/${req.id}`, { method: 'DELETE' })
                    if (res.ok) {
                        toast.success("Proposta excluída com sucesso!")
                        if (selectedRequest?.id === req.id) setSelectedRequest(null)
                        fetchRequests()
                    } else {
                        toast.error("Erro ao excluir proposta.")
                    }
                } catch (error) {
                    console.error("Erro ao excluir", error)
                    toast.error("Erro de conexão ao excluir proposta.")
                }
            }
        })
    }

    const handleSave = async () => {
        if (!selectedRequest || !proposalCode || !emailConfirmed) return

        setSaving(true)
        try {
            const res = await fetch(`/api/solicitacoes/envio-proposta`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: selectedRequest.id,
                    proposalCode,
                    proposalPdfUrl,
                    user: session?.user?.name
                })
            })

            if (res.ok) {
                const data = await res.json()
                setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                setAwaitingAcceptance(prev => [data.updatedRequest, ...prev])
                setSelectedRequest(null)
                setIsSuccessModalOpen(true)
            } else {
                toast.error("Erro ao enviar a proposta.")
            }
        } catch (error) {
            console.error("Erro ao enviar proposta", error)
            toast.error("Erro ao salvar os dados.")
        } finally {
            setSaving(false)
        }
    }

    const handleOpenManualAcceptance = (req: TestRequest, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        setAcceptanceModalRequest(req)
        setAcceptanceChannel("WhatsApp")
        setAcceptanceProofUrl("")
        setAcceptanceNotes("")
    }

    const handleSubmitManualAcceptance = async () => {
        if (!acceptanceModalRequest) return
        if (!acceptanceProofUrl) {
            toast.error("O anexo do comprovante de aceite é obrigatório.")
            return
        }

        setSubmittingAcceptance(true)
        try {
            const res = await fetch('/api/solicitacoes/aceite-proposta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: acceptanceModalRequest.id,
                    user: session?.user?.name || "Colaborador",
                    acceptanceProofUrl,
                    acceptanceChannel,
                    acceptanceNotes
                })
            })

            if (res.ok) {
                toast.success("Aceite registrado com sucesso! Solicitação avançada para o Agendamento.")
                setAcceptanceModalRequest(null)
                fetchRequests()
            } else {
                const data = await res.json()
                toast.error(data.error || "Erro ao registrar o aceite.")
            }
        } catch (error) {
            console.error("Erro ao registrar aceite manual", error)
            toast.error("Erro de conexão ao registrar o aceite.")
        } finally {
            setSubmittingAcceptance(false)
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
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Envio da Proposta</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Gere o código, anexe a proposta e confirme o envio por e-mail para solicitar o aceite do cliente.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Ensaios Aguardando Proposta */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Aguardando Envio ({requests.length})</h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">check_circle</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhuma solicitação nova pendente de proposta.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {requests.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => handleSelectRequest(req)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all relative group ${selectedRequest?.id === req.id ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="flex justify-between items-start mb-2 pr-6">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${req.observations?.includes('SOLICITAÇÃO REVISADA') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
                                            {req.observations?.includes('SOLICITAÇÃO REVISADA') ? 'Revisada pelo Cliente' : 'Recém Recebido'}
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

                {/* Formulário de Envio de Proposta */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                                <h2 className="text-xl font-bold justify-between flex items-center text-slate-800 dark:text-slate-200">
                                    Preenchimento da Proposta
                                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-500/30">
                                        OS {formatOsCode(selectedRequest)}
                                    </span>
                                </h2>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/30 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente / Contratante</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.contractorName || selectedRequest.clientName}</p>
                                    <p className="text-[10px] text-slate-400">{selectedRequest.clientEmail} • {selectedRequest.clientPhone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Empresa / Construtora</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.constructionCompany || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Serviço / Tipo</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-bold text-primary">{selectedRequest.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Obra e Local</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.workName || selectedRequest.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Datas Desejadas</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.datasDesejadas || format(new Date(selectedRequest.desiredDate), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qtd. Ensaios</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">{selectedRequest.quantidadeEnsaios || "-"}</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Endereço da Obra</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                                        {selectedRequest.rua ? `${selectedRequest.rua}, ${selectedRequest.numero} - ${selectedRequest.bairro}, ${selectedRequest.cidade}/${selectedRequest.estado} (CEP: ${selectedRequest.cep})` : selectedRequest.address}
                                    </p>
                                </div>
                                <div className="space-y-1.5 md:col-span-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 p-3.5 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">mail</span>
                                            E-mails Destinados para Receber a Proposta
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {((selectedRequest.emailsProposta && selectedRequest.emailsProposta.length > 0)
                                            ? selectedRequest.emailsProposta
                                            : (selectedRequest.proposalEmail ? [selectedRequest.proposalEmail] : (selectedRequest.clientEmail ? [selectedRequest.clientEmail] : []))
                                        ).map((email, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-blue-950 dark:text-blue-100 border border-blue-300 dark:border-blue-700/60 shadow-xs">
                                                <span className="material-symbols-outlined text-[15px] text-blue-600 dark:text-blue-400">alternate_email</span>
                                                <span className="select-all">{email}</span>
                                            </span>
                                        ))}
                                        {(!selectedRequest.emailsProposta || selectedRequest.emailsProposta.length === 0) && !selectedRequest.proposalEmail && !selectedRequest.clientEmail && (
                                            <span className="text-xs text-slate-500 dark:text-slate-400 italic">Nenhum e-mail informado</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1 md:col-span-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observações / Mensagem do Cliente</p>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium italic text-sm whitespace-pre-wrap bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mt-1">
                                        {selectedRequest.observations || "Nenhuma observação."}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Código da Proposta <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={proposalCode}
                                            onChange={(e) => setProposalCode(e.target.value)}
                                            placeholder="Ex: PROP-2026-0001"
                                            className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Anexar Proposta (PDF) <span className="text-red-500">*</span></label>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setProposalPdfUrl(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    setProposalPdfUrl("");
                                                }
                                            }}
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            required
                                        />
                                        {proposalPdfUrl && (
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold mt-2">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Arquivo pronto ({Math.round(proposalPdfUrl.length / 1024)} KB)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center">
                                    <label className="relative flex items-center cursor-pointer gap-3 p-4 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl w-full">
                                        <input
                                            type="checkbox"
                                            checked={emailConfirmed}
                                            onChange={(e) => setEmailConfirmed(e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded bg-emerald-100 border-emerald-300 focus:ring-emerald-500 focus:ring-2"
                                        />
                                        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                                            Confirmo que a proposta foi enviada por e-mail para o cliente.
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !proposalCode || !emailConfirmed || !proposalPdfUrl}
                                    className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all disabled:opacity-50 shadow-sm flex items-center gap-2 w-full sm:w-auto"
                                >
                                    {saving ? (
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined">send</span>
                                    )}
                                    Avançar (Solicitar Aceite)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-3xl">outgoing_mail</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Selecione uma solicitação para avaliar</h3>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                As solicitações enviadas pelos clientes estão disponíveis na lista. Analise e anexe a proposta correspondente.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Nova Seção: Propostas Aguardando Aceite */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Aguardando Aceite do Cliente</h2>
                            <p className="text-sm text-slate-500">Propostas já enviadas que aguardam a confirmação do cliente para iniciar o processo.</p>
                        </div>
                    </div>
                </div>

                {awaitingAcceptance.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-slate-500">Nenhuma proposta aguardando aceite no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {awaitingAcceptance.map(req => (
                            <div key={req.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all animate-in fade-in zoom-in-95 duration-300 relative group flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3 pr-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                            Aguardando Aceite
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            Enviada em {format(new Date(req.updatedAt || req.createdAt), 'dd/MM/yyyy')}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{req.type}</h4>
                                    <p className="text-sm text-slate-500 mt-1 truncate">{req.clientName}</p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        <span className="truncate">{req.location}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleOpenManualAcceptance(req, e)}
                                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        title="Registrar Aceite do Cliente (E-mail / WhatsApp)"
                                    >
                                        <span className="material-symbols-outlined text-sm">task_alt</span>
                                        Registrar Aceite
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Proposta enviada com sucesso!"
                message="O processo agora aguarda o aceite do cliente para prosseguir."
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type="danger"
            />

            {/* Modal de Registro Manual de Aceite da Proposta */}
            {acceptanceModalRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">mark_email_read</span>
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Registrar Aceite do Cliente</h3>
                                    <p className="text-xs text-slate-400">
                                        OS {formatOsCode(acceptanceModalRequest)} • {acceptanceModalRequest.type}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAcceptanceModalRequest(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Canal de Aceite */}
                            <div className="space-y-2">
                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    Canal de Recebimento do Aceite <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["WhatsApp", "E-mail", "Outro"].map((channel) => (
                                        <button
                                            key={channel}
                                            type="button"
                                            onClick={() => setAcceptanceChannel(channel)}
                                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                acceptanceChannel === channel
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700 shadow-xs"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                {channel === "WhatsApp" ? "chat" : channel === "E-mail" ? "mail" : "article"}
                                            </span>
                                            {channel}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Upload do Comprovante (Obrigatório) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        Comprovante do Aceite (Print / E-mail) <span className="text-red-500">* (Obrigatório)</span>
                                    </label>
                                </div>
                                
                                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-4 transition-colors bg-slate-50/50 dark:bg-slate-950/40 text-center">
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setAcceptanceProofUrl(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            } else {
                                                setAcceptanceProofUrl("");
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="space-y-1">
                                        <span className="material-symbols-outlined text-3xl text-emerald-600 dark:text-emerald-400">
                                            {acceptanceProofUrl ? "task_alt" : "cloud_upload"}
                                        </span>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                            {acceptanceProofUrl ? "Comprovante carregado com sucesso!" : "Clique ou arraste o comprovante (imagem ou PDF)"}
                                        </p>
                                        <p className="text-[11px] text-slate-400">PNG, JPG, WEBP ou PDF</p>
                                    </div>
                                </div>

                                {acceptanceProofUrl ? (
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-base">check_circle</span>
                                            Arquivo pronto ({Math.round(acceptanceProofUrl.length / 1024)} KB)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setAcceptanceProofUrl("")}
                                            className="text-red-500 hover:text-red-700 font-normal underline text-[11px]"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                                        ⚠️ O comprovante (print do WhatsApp, foto ou PDF do e-mail) é obrigatório para prosseguir.
                                    </p>
                                )}
                            </div>

                            {/* Observações Opcionais */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    Observações do Aceite (Opcional)
                                </label>
                                <textarea
                                    value={acceptanceNotes}
                                    onChange={(e) => setAcceptanceNotes(e.target.value)}
                                    placeholder="Ex: Cliente deu o aceite verbal no WhatsApp e confirmou a proposta enviada."
                                    rows={2}
                                    className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setAcceptanceModalRequest(null)}
                                disabled={submittingAcceptance}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitManualAcceptance}
                                disabled={!acceptanceProofUrl || submittingAcceptance}
                                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submittingAcceptance ? (
                                    <span className="material-symbols-outlined animate-spin text-base">refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined text-base">task_alt</span>
                                )}
                                Confirmar e Avançar para Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
