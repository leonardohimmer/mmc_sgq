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
    invoiceDate?: string | null
    clientPaymentConfirmed?: boolean
}

export default function RecebimentosPage() {
    const { data: session } = useSession()
    const [requests, setRequests] = useState<TestRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null)
    const [saving, setSaving] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/solicitacoes')
            if (res.ok) {
                const data = await res.json()
                // Only show those in PAGAMENTO
                const filtered = data.filter((req: TestRequest) => req.status === 'PAGAMENTO')
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
    }

    const handleConfirmPayment = async () => {
        if (!selectedRequest || !session?.user?.name) return

        setSaving(true)
        try {
            const bodyData = {
                status: 'PESQUISA_PENDENTE',
                paymentConfirmedAt: new Date().toISOString(),
                paymentConfirmedBy: session.user.name
            }

            const res = await fetch(`/api/solicitacoes/${selectedRequest.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            })

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== selectedRequest.id))
                setSelectedRequest(null)
                setIsSuccessModalOpen(true)
            }
        } catch (error) {
            console.error("Erro ao confirmar pagamento", error)
            toast.error("Erro ao confirmar o pagamento.")
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
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Confirmação de Recebimentos</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Verifique e confirme o recebimento dos pagamentos das faturas emitidas.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                    <span className="material-symbols-outlined">credit_score</span>
                    <span className="font-bold">{requests.length} aguardando</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Pagamentos Aguardando */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                        Pagamentos Pendentes
                    </h2>
                    {requests.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">task_alt</span>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Nenhum pagamento aguardando confirmação.</p>
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
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 uppercase">
                                            Aguardando Pagamento
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase">
                                            {req.invoiceDate ? format(new Date(req.invoiceDate), 'dd MMM yyyy', { locale: ptBR }) : 'S/ Data'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{req.type}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">person</span>
                                        {req.clientName}
                                    </p>
                                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NF: {req.invoiceNumber || "---"}</span>
                                        {req.clientPaymentConfirmed && (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800/50 animate-pulse">
                                                <span className="material-symbols-outlined text-[12px]">notifications_active</span>
                                                PAGO PELO CLIENTE
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detalhes e Confirmação */}
                <div className="lg:col-span-2">
                    {selectedRequest ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Confirmar Recebimento</h2>
                                        <p className="text-sm text-slate-500 mt-1">Valide as informações financeiras antes de concluir o processo.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NF de Cobrança</span>
                                        <p className="text-sm font-bold text-primary">{selectedRequest.invoiceNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 flex-1">
                                {/* Resumo da Fatura */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cliente / Empresa</span>
                                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedRequest.clientName}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Serviço Prestado</span>
                                            <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedRequest.type}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Documentos Relacionados</span>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {selectedRequest.invoicePdfUrl && (
                                                    <a 
                                                        href={selectedRequest.invoicePdfUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">receipt</span>
                                                        Visualizar Nota Fiscal (PDF)
                                                    </a>
                                                )}
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                    <span className="material-symbols-outlined text-[18px]">description</span>
                                                    Relatório: {selectedRequest.reportNumber || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl">currency_exchange</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Status da Fatura</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Emitida em {selectedRequest.invoiceDate ? format(new Date(selectedRequest.invoiceDate), "dd/MM/yyyy") : '---'}
                                            </p>
                                        </div>
                                        <div className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                            Aguardando Transferência
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
                                    <div className="space-y-1">
                                        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                            Certifique-se de que o valor correspondente à NF <strong>{selectedRequest.invoiceNumber}</strong> já foi devidamente creditado na conta da empresa antes de confirmar. Esta ação é irreversível.
                                        </p>
                                        {selectedRequest.clientPaymentConfirmed && (
                                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[16px]">info</span>
                                                O cliente informou no portal que já efetuou o pagamento.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-bold transition-all text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={saving}
                                    className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all disabled:opacity-50 shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 text-sm"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Confirmar Recebimento
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[450px]">
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 text-slate-300">
                                <span className="material-symbols-outlined text-4xl">payments</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-700 dark:text-slate-200">Selecione um processo</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                                Escolha um item na lista lateral para validar o pagamento e finalizar o ciclo financeiro do ensaio.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Pagamento Confirmado!"
                message="O processo foi finalizado e a pesquisa de satisfação será enviada ao cliente."
            />
        </div>
    )
}
