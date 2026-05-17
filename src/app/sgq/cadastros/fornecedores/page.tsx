"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import SuccessModal from "@/components/SuccessModal"
import ConfirmModal from "@/components/ConfirmModal"

type Supplier = {
    id: string
    name: string
    qualified: boolean
    score: number | null
    active: boolean
}

export default function FornecedoresPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filters
    const [filterName, setFilterName] = useState("")
    const [filterInactive, setFilterInactive] = useState(false)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [form, setForm] = useState({ name: "", qualified: true, score: "", active: true })

    // Notification states
    const [notification, setNotification] = useState<{
        isOpen: boolean
        title: string
        message: string
        type: 'success' | 'error' | 'info'
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: 'success'
    })

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

    useEffect(() => {
        if (status === "unauthenticated" || (session?.user && session.user.role !== "DESENVOLVEDOR")) {
            router.push("/sgq")
        } else if (status === "authenticated") {
            fetchData()
        }
    }, [status, session, router])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/suppliers")
            if (res.ok) {
                const data = await res.json()
                setSuppliers(data)
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (supplier?: Supplier) => {
        if (supplier) {
            setEditingSupplier(supplier)
            setForm({ name: supplier.name, qualified: supplier.qualified, score: supplier.score ? String(supplier.score) : "", active: supplier.active })
        } else {
            setEditingSupplier(null)
            setForm({ name: "", qualified: true, score: "", active: true })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : "/api/suppliers"
            const method = editingSupplier ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })

            if (res.ok) {
                setIsModalOpen(false)
                fetchData()
                setNotification({
                    isOpen: true,
                    title: "Sucesso!",
                    message: editingSupplier ? "Fornecedor atualizado com sucesso." : "Fornecedor cadastrado com sucesso.",
                    type: 'success'
                })
            } else {
                setNotification({
                    isOpen: true,
                    title: "Erro",
                    message: "Erro ao salvar fornecedor.",
                    type: 'error'
                })
            }
        } catch (error) {
            console.error(error)
            setNotification({
                isOpen: true,
                title: "Erro",
                message: "Erro de conexão ao salvar fornecedor.",
                type: 'error'
            })
        }
    }

    const handleDelete = async (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Excluir Fornecedor",
            message: "Tem certeza que deseja excluir este fornecedor? Esta ação não poderá ser desfeita.",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" })
                    if (res.ok) {
                        fetchData()
                        setNotification({
                            isOpen: true,
                            title: "Excluído!",
                            message: "Fornecedor excluído com sucesso.",
                            type: 'success'
                        })
                    }
                } catch (error) {
                    console.error(error)
                    setNotification({
                        isOpen: true,
                        title: "Erro",
                        message: "Erro ao excluir fornecedor.",
                        type: 'error'
                    })
                }
            }
        })
    }

    const toggleActive = async (supplier: Supplier) => {
        try {
            const res = await fetch(`/api/suppliers/${supplier.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...supplier, active: !supplier.active })
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const filteredSuppliers = suppliers.filter(s => {
        const matchName = s.name.toLowerCase().includes(filterName.toLowerCase())
        const matchActive = filterInactive ? true : s.active === true
        return matchName && matchActive
    })

    if (isLoading) return <div className="p-8">Carregando...</div>

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cadastro de Fornecedores</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
                    >
                        <span className="text-lg font-bold">+</span> Adicionar Fornecedor
                    </button>
                    <button className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-orange-500/10">
                        <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                        Exportar Excel
                    </button>
                </div>
            </div>

            {/* Painel de Filtros Unificado */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Buscar por Nome</label>
                        <input
                            type="text"
                            placeholder="Digite o nome do fornecedor..."
                            className="px-3.5 py-2 border rounded-xl w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6 justify-between sm:justify-start bg-white dark:bg-slate-950 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Mostrar Inativos</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={filterInactive}
                                onChange={(e) => setFilterInactive(e.target.checked)}
                            />
                            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Listagem */}
            {/* Desktop View */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#2b5c92] text-white">
                            <th className="px-6 py-4 text-sm font-semibold">Nome</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-32">Qualificado</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-32">Nota</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-40">Ativar/Desativar</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-24">Excluir</th>
                            <th className="px-4 py-4 text-center w-12"><span className="material-symbols-outlined text-[18px]">settings</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                <td
                                    className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => handleOpenModal(supplier)}
                                >
                                    {supplier.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${supplier.qualified ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
                                        {supplier.qualified ? "Sim" : "Não"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-center font-semibold text-slate-600 dark:text-slate-400">
                                    {supplier.score !== null ? supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => toggleActive(supplier)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${supplier.active ? 'bg-slate-700 dark:bg-slate-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${supplier.active ? 'left-7 bg-blue-500' : 'left-1'}`}></div>
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => handleDelete(supplier.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        title="Excluir"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </td>
                                <td className="px-4 py-4"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Nenhum fornecedor encontrado.</div>
                )}
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {filteredSuppliers.map((supplier) => (
                    <div 
                        key={supplier.id} 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between animate-in fade-in duration-200"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                <h3 
                                    className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer break-words flex-1"
                                    onClick={() => handleOpenModal(supplier)}
                                >
                                    {supplier.name}
                                </h3>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${supplier.qualified ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
                                    {supplier.qualified ? "Qualificado" : "Não Qualificado"}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Nota de Avaliação</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                    {supplier.score !== null ? supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ativo</span>
                                <button
                                    onClick={() => toggleActive(supplier)}
                                    className={`w-10 h-5.5 rounded-full relative transition-colors ${supplier.active ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-1 transition-all ${supplier.active ? 'left-5.5' : 'left-1'}`}></div>
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenModal(supplier)}
                                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(supplier.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                    title="Excluir"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredSuppliers.length === 0 && (
                    <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl col-span-full">Nenhum fornecedor encontrado.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-4 text-[#2b5c92] dark:text-blue-400">{editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        checked={form.qualified}
                                        onChange={e => setForm({ ...form, qualified: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium">Qualificado?</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nota (0 a 10)</label>
                                <input
                                    type="number" step="0.01" min="0" max="10"
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={form.score} onChange={e => setForm({ ...form, score: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-[#2b5c92] text-white rounded-lg hover:bg-blue-800">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <SuccessModal 
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                autoClose={true}
            />

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type="danger"
            />
        </div>
    )
}
