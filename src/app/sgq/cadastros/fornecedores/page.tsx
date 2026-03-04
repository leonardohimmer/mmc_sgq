"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

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
            } else {
                alert("Erro ao salvar fornecedor.")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return
        try {
            const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" })
            if (res.ok) fetchData()
        } catch (error) {
            console.error(error)
        }
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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Cadastro de Fornecedores</h1>

            <div className="flex flex-col gap-4">
                {/* Top bar with Add button */}
                <div className="flex">
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition flex items-center gap-2"
                    >
                        <span className="font-bold">+</span> Adicionar
                    </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-end gap-6 w-full justify-between">
                    <div className="flex gap-6 items-end">
                        <div className="flex flex-col">
                            <label className="text-sm text-slate-500 dark:text-slate-400 mb-1">Nome</label>
                            <input
                                type="text"
                                className="px-3 py-1.5 border rounded w-64 bg-transparent border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-sm text-slate-500 dark:text-slate-400 mb-2">Inativos</label>
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={filterInactive}
                                onChange={(e) => setFilterInactive(e.target.checked)}
                            />
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                        Filtrar
                    </button>
                </div>

                {/* Export button */}
                <div className="flex">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition">
                        Exportar dados para Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#2b5c92] text-white">
                            <th className="px-6 py-3 text-sm font-semibold">Nome</th>
                            <th className="px-6 py-3 text-sm font-semibold text-center w-32">Qualificado</th>
                            <th className="px-6 py-3 text-sm font-semibold text-center w-32">Nota</th>
                            <th className="px-6 py-3 text-sm font-semibold text-center w-40">Ativar/Desativar</th>
                            <th className="px-6 py-3 text-sm font-semibold text-center w-24">Excluir</th>
                            <th className="px-4 py-3 text-center w-12"><span className="material-symbols-outlined text-[18px]">settings</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-blue-50/50 dark:hover:bg-slate-800/30">
                                <td
                                    className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                                    onClick={() => handleOpenModal(supplier)}
                                >
                                    {supplier.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-400">
                                    {supplier.qualified ? "Sim" : "Não"}
                                </td>
                                <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-400">
                                    {supplier.score !== null ? supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => toggleActive(supplier)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${supplier.active ? 'bg-slate-700' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${supplier.active ? 'left-7' : 'left-1'}`}></div>
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
                    <div className="p-8 text-center text-slate-500">Nenhum fornecedor encontrado.</div>
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
        </div>
    )
}
