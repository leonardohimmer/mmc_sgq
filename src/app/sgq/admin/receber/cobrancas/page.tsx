"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"


type TestRequest = {
    id: string
    type: string
    clientName: string
    status: string
    createdAt: string
    updatedAt: string
    reportNumber?: string | null
    invoiceNumber?: string | null
    invoicePdfUrl?: string | null
}

export default function CobrancasPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    // Form states
    const [invoiceNumber, setInvoiceNumber] = useState("")
    const [invoicePdfUrl, setInvoicePdfUrl] = useState("")

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                // Only show those in COBRANCA
                const filtered = data.filter((req: TestRequest) => req.status === 'COBRANCA')
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
        setInvoiceNumber(req.invoiceNumber || "")
        setInvoicePdfUrl(req.invoicePdfUrl || "")
    }

    const handleSave = async (isAdvance = false) => {
        if (!selectedRequest) return

        setSaving(true)
        try {
            const bodyData: any = {
                invoiceNumber,
                invoicePdfUrl
            }

            if (isAdvance) {
                bodyData.status = 'PAGAMENTO'
                bodyData.invoiceDate = new Date().toISOString()
            }

            const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })

            if (res.ok) {
                if (isAdvance) {
                    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                    setSelectedRequest(null)
                    setIsSuccessModalOpen(true)
                } else {
                    const { request } = await res.json()
                    setRequests(prev => prev.map(r => r.id === request.id ? request : r))
                    setSelectedRequest(request)
                    toast.success("Dados de faturamento salvos!")
                }
            }
        } catch (error) {
            console.error("Erro ao salvar cobrança", error)
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Emissão de Cobranças</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Gerencie o faturamento dos ensaios concluídos e envie as notas fiscais para os clientes.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                    <span className="material-symbols-outlined">payments</span>
                    <span className="font-bold">{requests.length} pendentes</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Cobranças Pendentes */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">list_alt</span>
                        Aguardando Fatura
                    </h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">check_circle</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhuma cobrança pendente no momento.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2">
                            {requests.map(req => (
                                <div
                                    key={req.id}
                                    onClick={() => handleSelectRequest(req)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRequest?.id === req.id ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 uppercase">
                                            Cobrança
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase">
                                            {format(new Date(req.updatedAt), 'dd MMM yyyy', { locale: ptBR })}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{req.type}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">person</span>
                                        {req.clientName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detalhes e Ações */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Dados do Faturamento</h2>
                                        <p className="text-sm text-slate-500 mt-1">Insira as informações da Nota Fiscal para envio ao cliente.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID do Processo</span>
                                        <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{selectedRequest.id.split('-')[0].toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 flex-1">
                                {/* Informações do Ensaio */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cliente</span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{selectedRequest.clientName}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipo de Ensaio</span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{selectedRequest.type}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Número do Relatório</span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{selectedRequest.reportNumber || "Não gerado"}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Finalizado em</span>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{format(new Date(selectedRequest.updatedAt), "dd/MM/yyyy 'às' HH:mm")}</p>
                                    </div>
                                </div>

                                {/* Formulário da NF */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">pin</span>
                                                Número da Nota Fiscal (NF-e)
                                            </label>
                                            <input
                                                type="text"
                                                value={invoiceNumber}
                                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                                placeholder="Ex: 20240001"
                                                className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[20px]">upload_file</span>
                                                Upload da Nota Fiscal (PDF)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setInvoicePdfUrl(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`w-full p-3 rounded-xl bg-white dark:bg-slate-950 border-2 border-dashed ${invoicePdfUrl ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 dark:border-slate-700'} flex items-center justify-between transition-all`}>
                                                    <div className="flex items-center gap-2 truncate">
                                                        <span className={`material-symbols-outlined ${invoicePdfUrl ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                            {invoicePdfUrl ? 'check_circle' : 'description'}
                                                        </span>
                                                        <span className="text-sm text-slate-500 truncate">
                                                            {invoicePdfUrl ? 'Arquivo PDF carregado com sucesso' : 'Clique ou arraste o PDF da nota'}
                                                        </span>
                                                    </div>
                                                    {invoicePdfUrl && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setInvoicePdfUrl(""); }}
                                                            className="text-red-500 hover:text-red-700 z-20"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl flex items-start gap-3">
                                        <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                            Ao avançar, o cliente receberá uma notificação com a fatura e o processo passará para a etapa de <strong>Aguardando Pagamento</strong> no setor técnico.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => handleSave(false)}
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-bold transition-all disabled:opacity-50 text-sm shadow-sm"
                                >
                                    Salvar Alterações
                                </button>
                                <button
                                    onClick={() => handleSave(true)}
                                    disabled={saving || !invoiceNumber}
                                    className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-black transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">send_and_archive</span>
                                            Confirmar e Enviar Cobrança
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[450px]">
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 text-slate-300 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-4xl">receipt_long</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-700 dark:text-slate-200">Selecione uma fatura pendente</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                                Escolha uma solicitação na lista lateral para visualizar os detalhes e emitir a nota fiscal de cobrança.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Cobrança enviada!"
                message="A solicitação foi movida para a etapa de Aguardando Pagamento."
            />
        </div>
    )
}
