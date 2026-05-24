"use client"

import { useEffect, useState } from "react"
import ConfirmModal from "@/components/ConfirmModal"
import { toast } from "sonner"

interface Orcamento {
    id: string
    nomeCompleto?: string
    nomeContratante?: string
    nomeConstrutora?: string
    nomeObra?: string
    email?: string
    telefone?: string
    nomeEmpresa?: string
    tipoPessoa?: string
    rua?: string
    numero?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
    enderecoCompleto?: string
    emailsProposta: string[]
    emailsRelatorio: string[]
    servicoDesejado?: string
    quantidadeEnsaios?: string
    datasDesejadas?: string
    mensagem?: string
    status: string
    createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    NOVO: { label: "Novo", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800", icon: "fiber_new" },
    VISUALIZADO: { label: "Visualizado", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800", icon: "visibility" },
    EM_CONTATO: { label: "Em Contato", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800", icon: "phone_in_talk" },
    FINALIZADO: { label: "Finalizado", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800", icon: "task_alt" },
}

export default function OrcamentosPage() {
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>("todos")
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string,
        message: string,
        onConfirm: () => void,
        type?: 'primary' | 'danger' | 'warning'
    }>({
        title: "",
        message: "",
        onConfirm: () => {}
    })
    const [credentialsModal, setCredentialsModal] = useState<{
        isOpen: boolean
        email: string
        password?: string
        clientName: string
    }>({
        isOpen: false,
        email: "",
        clientName: ""
    })

    const fetchOrcamentos = async () => {
        try {
            const res = await fetch("/api/orcamentos?limit=100")
            if (res.ok) {
                const data = await res.json()
                setOrcamentos(data.orcamentos || [])
            }
        } catch (e) {
            console.error("Erro ao buscar orçamentos:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrcamentos()
    }, [])

    const updateStatus = async (id: string, status: string, skipFlow: boolean = false) => {
        setUpdatingId(id)
        try {
            const res = await fetch(`/api/orcamentos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, skipFlow }),
            })
            if (res.ok) {
                const data = await res.json()
                setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status } : o))

                // Se um novo usuário foi criado mas o e-mail SMTP falhou, exibe as credenciais na tela
                if (data.generatedPassword && !data.emailSent) {
                    setCredentialsModal({
                        isOpen: true,
                        email: data.email || "",
                        password: data.generatedPassword,
                        clientName: data.nomeContratante || data.nomeCompleto || "Cliente"
                    })
                }
            }
        } catch (e) {
            console.error("Erro ao atualizar:", e)
        } finally {
            setUpdatingId(null)
        }
    }

    const deleteOrcamento = async (id: string) => {
        setConfirmConfig({
            title: "Excluir Orçamento",
            message: "Tem certeza que deseja excluir este orçamento? Esta ação não poderá ser desfeita.",
            type: 'danger',
            onConfirm: async () => {
                try {
                    await fetch(`/api/orcamentos/${id}`, { method: "DELETE" })
                    setOrcamentos(prev => prev.filter(o => o.id !== id))
                    if (selectedId === id) setSelectedId(null)
                } catch (e) {
                    console.error("Erro ao deletar:", e)
                }
            }
        })
        setShowConfirmModal(true)
    }

    const filtered = orcamentos.filter(o => {
        const matchStatus = filterStatus === "todos" || o.status === filterStatus
        const matchSearch = !searchTerm ||
            (o.nomeCompleto || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.nomeContratante || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.nomeEmpresa || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.nomeObra || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.servicoDesejado || "").toLowerCase().includes(searchTerm.toLowerCase())
        return matchStatus && matchSearch
    })

    const selectedOrcamento = orcamentos.find(o => o.id === selectedId)

    const counts = {
        todos: orcamentos.length,
        NOVO: orcamentos.filter(o => o.status === "NOVO").length,
        VISUALIZADO: orcamentos.filter(o => o.status === "VISUALIZADO").length,
        EM_CONTATO: orcamentos.filter(o => o.status === "EM_CONTATO").length,
        FINALIZADO: orcamentos.filter(o => o.status === "FINALIZADO").length,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">request_quote</span>
                        Orçamentos do Site
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Pedidos de orçamento recebidos pelo formulário do site público
                    </p>
                </div>
                <button
                    onClick={fetchOrcamentos}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-bold"
                >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Atualizar
                </button>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { key: "NOVO", label: "Novos", icon: "fiber_new", color: "from-blue-500 to-blue-600" },
                    { key: "VISUALIZADO", label: "Visualizados", icon: "visibility", color: "from-yellow-500 to-yellow-600" },
                    { key: "EM_CONTATO", label: "Em Contato", icon: "phone_in_talk", color: "from-purple-500 to-purple-600" },
                    { key: "FINALIZADO", label: "Finalizados", icon: "task_alt", color: "from-emerald-500 to-emerald-600" },
                ].map(item => (
                    <button
                        key={item.key}
                        onClick={() => setFilterStatus(prev => prev === item.key ? "todos" : item.key)}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 text-left ${filterStatus === item.key ? 'ring-2 ring-white/50 scale-[1.02]' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="material-symbols-outlined text-[24px] opacity-90">{item.icon}</span>
                            <span className="text-2xl font-extrabold">{counts[item.key as keyof typeof counts]}</span>
                        </div>
                        <p className="text-sm font-bold opacity-90">{item.label}</p>
                    </button>
                ))}
            </div>

            {/* Pesquisa e filtro */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, e-mail, empresa ou serviço..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/30 outline-none font-bold"
                >
                    <option value="todos">Todos ({counts.todos})</option>
                    <option value="NOVO">Novos ({counts.NOVO})</option>
                    <option value="VISUALIZADO">Visualizados ({counts.VISUALIZADO})</option>
                    <option value="EM_CONTATO">Em Contato ({counts.EM_CONTATO})</option>
                    <option value="FINALIZADO">Finalizados ({counts.FINALIZADO})</option>
                </select>
            </div>

            {/* Layout de duas colunas: lista + detalhe */}
            <div className="flex gap-4 min-h-[500px]">
                {/* Lista */}
                <div className={`flex flex-col gap-2 ${selectedOrcamento ? 'w-full lg:w-[420px] lg:min-w-[320px] lg:max-w-[420px]' : 'w-full'}`}>
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
                            <span className="material-symbols-outlined text-[64px] mb-4 opacity-40">inbox</span>
                            <p className="text-lg font-bold">Nenhum orçamento encontrado</p>
                            <p className="text-sm mt-1">Quando os clientes enviarem o formulário, eles aparecerão aqui.</p>
                        </div>
                    ) : (
                        filtered.map(o => {
                            const statusConf = STATUS_CONFIG[o.status] || STATUS_CONFIG["NOVO"]
                            const isSelected = selectedId === o.id
                            return (
                                <button
                                    key={o.id}
                                    onClick={() => {
                                        setSelectedId(isSelected ? null : o.id)
                                        if (!isSelected && o.status === "NOVO") updateStatus(o.id, "VISUALIZADO")
                                    }}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all ${isSelected
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{o.nomeContratante || o.nomeCompleto}</p>
                                                {o.status === "NOVO" && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" title="Novo" />
                                                )}
                                            </div>
                                            {(o.nomeEmpresa || o.nomeConstrutora) && <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{o.nomeEmpresa || o.nomeConstrutora}</p>}
                                            {o.servicoDesejado && <p className="text-xs text-primary font-bold mt-1 truncate">{o.servicoDesejado}</p>}
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${statusConf.color}`}>
                                                {statusConf.label}
                                            </span>
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                                {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Detalhe */}
                {selectedOrcamento && (
                    <div className="hidden lg:flex flex-1 flex-col">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sticky top-4 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
                            {/* Cabeçalho */}
                            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedOrcamento.nomeContratante || selectedOrcamento.nomeCompleto}</h2>
                                    {(selectedOrcamento.nomeEmpresa || selectedOrcamento.nomeConstrutora) && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{selectedOrcamento.nomeEmpresa || selectedOrcamento.nomeConstrutora}</p>
                                    )}
                                    <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                        Recebido em {new Date(selectedOrcamento.createdAt).toLocaleString("pt-BR")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Seção: Contato */}
                            <div>
                                <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">contact_page</span>
                                    Informações de Contato
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Tipo de Pessoa</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedOrcamento.tipoPessoa || "Não informado"}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Melhor e-mail (Login)</p>
                                        <a href={`mailto:${selectedOrcamento.email}`} className="text-sm font-bold text-primary hover:underline break-all">
                                            {selectedOrcamento.email || "Não informado"}
                                        </a>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Telefone / WhatsApp</p>
                                        <a href={`tel:${selectedOrcamento.telefone}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                                            {selectedOrcamento.telefone || "Não informado"}
                                        </a>
                                    </div>
                                    {(selectedOrcamento.nomeEmpresa || selectedOrcamento.nomeConstrutora) && (
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Empresa / Construtora</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {selectedOrcamento.nomeEmpresa || selectedOrcamento.nomeConstrutora}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Seção: Local da Obra */}
                            <div>
                                <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    Dados da Obra / Local
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Nome da Obra</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedOrcamento.nomeObra || "Não informado"}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Endereço Completo</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                                            {selectedOrcamento.rua ? (
                                                <>
                                                    {selectedOrcamento.rua}, {selectedOrcamento.numero} <br />
                                                    {selectedOrcamento.bairro} - {selectedOrcamento.cidade}/{selectedOrcamento.estado} <br />
                                                    CEP: {selectedOrcamento.cep}
                                                </>
                                            ) : (
                                                selectedOrcamento.enderecoCompleto || "Não informado"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Seção: Detalhes do Serviço */}
                            <div>
                                <h3 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">build</span>
                                    Detalhes do Serviço
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 col-span-2">
                                        <p className="text-[10px] font-bold text-primary uppercase mb-1 tracking-wider">Serviço Desejado</p>
                                        <p className="text-sm font-extrabold text-primary">{selectedOrcamento.servicoDesejado || "Não especificado"}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Quantidade de Ensaios</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedOrcamento.quantidadeEnsaios || "-"}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Datas Desejadas</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={selectedOrcamento.datasDesejadas}>{selectedOrcamento.datasDesejadas || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Seção: E-mails para Envio */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">description</span>
                                        E-mails Proposta
                                    </p>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {selectedOrcamento.emailsProposta?.length > 0 ? (
                                            selectedOrcamento.emailsProposta.map((e, idx) => (
                                                <p key={idx} className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">{e}</p>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-slate-400 italic">Nenhum</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">analytics</span>
                                        E-mails Relatório
                                    </p>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {selectedOrcamento.emailsRelatorio?.length > 0 ? (
                                            selectedOrcamento.emailsRelatorio.map((e, idx) => (
                                                <p key={idx} className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">{e}</p>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-slate-400 italic">Nenhum</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mensagem */}
                            {selectedOrcamento.mensagem && (
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">chat</span>
                                        Observações Adicionais
                                    </p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedOrcamento.mensagem}</p>
                                </div>
                            )}

                            {/* Alterar Status */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">Alterar Status do Pedido</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                                        <button
                                            key={key}
                                            onClick={() => updateStatus(selectedOrcamento.id, key)}
                                            disabled={selectedOrcamento.status === key || updatingId === selectedOrcamento.id}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${selectedOrcamento.status === key
                                                ? conf.color + ' cursor-default shadow-sm ring-1 ring-inset ring-black/5'
                                                : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                } disabled:opacity-60`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">{conf.icon}</span>
                                            {conf.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ações */}
                            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => updateStatus(selectedOrcamento.id, "FINALIZADO", false)}
                                    disabled={selectedOrcamento.status === "FINALIZADO" || updatingId === selectedOrcamento.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all text-sm shadow-md disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                                    Prosseguir
                                </button>
                                <button
                                    onClick={() => updateStatus(selectedOrcamento.id, "FINALIZADO", true)}
                                    disabled={selectedOrcamento.status === "FINALIZADO" || updatingId === selectedOrcamento.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-500 hover:bg-slate-600 text-white rounded-xl font-bold transition-all text-sm shadow-md disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">archive</span>
                                    Arquivar
                                </button>
                                <button
                                    onClick={() => deleteOrcamento(selectedOrcamento.id)}
                                    className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors border border-transparent hover:border-red-200"
                                    title="Excluir orçamento"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
            />

            {/* Modal de Contingência de Credenciais */}
            {credentialsModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setCredentialsModal(prev => ({ ...prev, isOpen: false }))}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setCredentialsModal(prev => ({ ...prev, isOpen: false }))}
                            className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-110"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">report_problem</span>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                    Acesso Criado com Alerta
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    O perfil de <strong>{credentialsModal.clientName}</strong> foi criado com sucesso, mas o e-mail de boas-vindas não pôde ser enviado via SMTP.
                                </p>
                            </div>

                            {/* Credenciais */}
                            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left space-y-3 font-medium text-sm text-slate-700 dark:text-slate-300 mt-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">E-mail de Login</span>
                                    <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2">
                                        <span className="font-mono text-slate-900 dark:text-white truncate">{credentialsModal.email}</span>
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(credentialsModal.email)
                                                toast.success("E-mail copiado!")
                                            }}
                                            className="text-primary hover:text-primary-hover shrink-0 flex items-center"
                                            title="Copiar e-mail"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Senha Inicial</span>
                                    <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2">
                                        <span className="font-mono text-slate-900 dark:text-white truncate">{credentialsModal.password}</span>
                                        <button 
                                            onClick={() => {
                                                if (credentialsModal.password) {
                                                    navigator.clipboard.writeText(credentialsModal.password)
                                                    toast.success("Senha copiada!")
                                                }
                                            }}
                                            className="text-primary hover:text-primary-hover shrink-0 flex items-center"
                                            title="Copiar senha"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                Por favor, copie estes dados e envie-os manualmente ao cliente por WhatsApp ou e-mail pessoal.
                            </p>

                            <button 
                                onClick={() => setCredentialsModal(prev => ({ ...prev, isOpen: false }))}
                                className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 mt-4 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Entendi, fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
