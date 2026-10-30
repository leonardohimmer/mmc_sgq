"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import MMCLoadingScreen from "@/components/MMCLoadingScreen"
import SuccessModal from "@/components/SuccessModal"

type Supplier = {
    id: string
    name: string
    category?: string
    qualified: boolean
    score: number | null
    active: boolean
}

const SUPPLIER_CATEGORIES = [
    { id: "Calibração", label: "Calibração", icon: "straighten" },
    { id: "Ensaio de Proficiência", label: "Ensaio de Proficiência", icon: "science" },
    { id: "Auditoria", label: "Auditoria", icon: "fact_check" },
] as const

function getCategoryBadgeStyle(cat: string) {
    const normalized = cat.trim().toLowerCase()
    if (normalized.includes("calibra")) {
        return {
            icon: "straighten",
            cls: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60"
        }
    }
    if (normalized.includes("profici") || normalized.includes("ensaio")) {
        return {
            icon: "science",
            cls: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60"
        }
    }
    if (normalized.includes("auditor")) {
        return {
            icon: "fact_check",
            cls: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60"
        }
    }
    return {
        icon: "category",
        cls: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
    }
}

function getSupplierClassBadge(scoreOutOf10: number | null) {
    if (scoreOutOf10 === null) return null
    const pct = Number((scoreOutOf10 * 10).toFixed(1))
    if (pct >= 85) {
        return { cls: "A", label: "ÓTIMO", pct, bg: "bg-[#00b050] text-white" }
    }
    if (pct >= 75) {
        return { cls: "B", label: "BOM", pct, bg: "bg-[#ffff00] text-slate-950" }
    }
    if (pct >= 60) {
        return { cls: "C", label: "REGULAR", pct, bg: "bg-[#ffc000] text-slate-950" }
    }
    return { cls: "D", label: "RUIM", pct, bg: "bg-[#ff0000] text-white" }
}

export default function FornecedoresQualidadePage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterName, setFilterName] = useState("")
    const [filterCategory, setFilterCategory] = useState("TODAS")

    // Modal state for Novo / Editar Fornecedor
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [form, setForm] = useState<{
        name: string
        categories: string[]
        qualified: boolean
        score: string
        active: boolean
    }>({
        name: "",
        categories: ["Calibração"],
        qualified: true,
        score: "10",
        active: true,
    })

    const [notification, setNotification] = useState<{
        isOpen: boolean
        title: string
        message: string
        type: "success" | "error" | "info"
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "success",
    })

    useEffect(() => {
        fetchData()
    }, [])

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
            const parsedCategories = supplier.category
                ? supplier.category.split(",").map(c => c.trim()).filter(Boolean)
                : ["Calibração"]
            setForm({
                name: supplier.name,
                categories: parsedCategories.length > 0 ? parsedCategories : ["Calibração"],
                qualified: supplier.qualified,
                score: supplier.score !== null && supplier.score !== undefined ? String(supplier.score) : "",
                active: supplier.active,
            })
        } else {
            setEditingSupplier(null)
            setForm({
                name: "",
                categories: ["Calibração"],
                qualified: true,
                score: "10",
                active: true,
            })
        }
        setIsModalOpen(true)
    }

    const toggleFormCategory = (catLabel: string) => {
        setForm(prev => {
            const exists = prev.categories.includes(catLabel)
            if (exists) {
                if (prev.categories.length === 1) return prev
                return { ...prev, categories: prev.categories.filter(c => c !== catLabel) }
            }
            return { ...prev, categories: [...prev.categories, catLabel] }
        })
    }

    const handleSaveSupplier = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return

        setIsSaving(true)
        try {
            const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : "/api/suppliers"
            const method = editingSupplier ? "PUT" : "POST"
            const payload = {
                name: form.name.trim(),
                category: form.categories.join(", "),
                qualified: form.qualified,
                score: form.score !== "" ? form.score : null,
                active: form.active,
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                setIsModalOpen(false)
                await fetchData()
                setNotification({
                    isOpen: true,
                    title: editingSupplier ? "Fornecedor Atualizado!" : "Fornecedor Cadastrado!",
                    message: editingSupplier
                        ? `Os dados de "${payload.name}" foram atualizados com sucesso.`
                        : `O fornecedor "${payload.name}" (${payload.category}) foi adicionado com sucesso.`,
                    type: "success",
                })
            } else {
                setNotification({
                    isOpen: true,
                    title: "Erro ao salvar",
                    message: "Não foi possível salvar o fornecedor. Verifique suas permissões.",
                    type: "error",
                })
            }
        } catch (error) {
            console.error("Erro ao salvar fornecedor:", error)
            setNotification({
                isOpen: true,
                title: "Erro de conexão",
                message: "Falha ao comunicar com o servidor.",
                type: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const filteredSuppliers = suppliers.filter(s => {
        const matchesName = s.name.toLowerCase().includes(filterName.toLowerCase())
        const supCategory = (s.category || "Calibração").toLowerCase()
        const matchesCategory =
            filterCategory === "TODAS" || supCategory.includes(filterCategory.toLowerCase())
        return matchesName && matchesCategory && s.active
    })

    if (isLoading) {
        return (
            <MMCLoadingScreen
                message="Carregando fornecedores e qualificação..."
                submessage="Sincronizando homologações e registros da Qualidade"
            />
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-500 text-3xl">local_shipping</span>
                        Fornecedores e Qualificação (SGQ)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Controle de provedores externos homologados e classificação conforme planilha F35 (Revisão 03).
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2.5 bg-[#2b5c92] hover:bg-blue-800 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Novo Fornecedor
                    </button>
                    <button className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-orange-500/10 cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex flex-col flex-1 max-w-md">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nome do Fornecedor</label>
                        <input
                            type="text"
                            placeholder="Digite o nome para buscar..."
                            className="px-3.5 py-2.5 border rounded-xl w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:w-64">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Categoria</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3.5 py-2.5 border rounded-xl w-full bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-sm"
                        >
                            <option value="TODAS">Todas as categorias</option>
                            <option value="Calibração">Calibração</option>
                            <option value="Ensaio de Proficiência">Ensaio de Proficiência</option>
                            <option value="Auditoria">Auditoria</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Desktop View Table */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#2b5c92] text-white">
                            <th className="px-6 py-4 text-sm font-semibold">Nome do Fornecedor</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-56">Categoria</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-36">Homologado</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-40">IQF (%) / Nota</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-40">Classe F35</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-28">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-right w-40">Avaliação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredSuppliers.map((supplier) => {
                            const classInfo = getSupplierClassBadge(supplier.score)
                            const categoriesList = (supplier.category || "Calibração")
                                .split(",")
                                .map(c => c.trim())
                                .filter(Boolean)

                            return (
                                <tr key={supplier.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                    <td
                                        className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        onClick={() => handleOpenModal(supplier)}
                                        title="Clique para editar fornecedor"
                                    >
                                        {supplier.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <div
                                            onClick={() => handleOpenModal(supplier)}
                                            title="Clique para alterar a categoria"
                                            className="flex flex-wrap items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            {categoriesList.map((cat, idx) => {
                                                const badge = getCategoryBadgeStyle(cat)
                                                return (
                                                    <span
                                                        key={idx}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                                                        {cat}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        {supplier.qualified ? (
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50">
                                                Qualificado
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50">
                                                Reprovado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        {supplier.score !== null && classInfo ? (
                                            <span className={`font-bold text-sm ${supplier.score >= 7.5 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                                {classInfo.pct}% ({supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                            </span>
                                        ) : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        {classInfo ? (
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-black ${classInfo.bg}`}>
                                                Classe {classInfo.cls} • {classInfo.label}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">Não avaliado</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <span className="text-green-600 dark:text-green-400 font-medium text-xs border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-2.5 py-1 rounded-full">Ativo</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <Link
                                            href={`/sgq/fornecedores/avaliacao?supplierId=${supplier.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">fact_check</span>
                                            Avaliar F35
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Nenhum fornecedor ativo encontrado.</div>
                )}
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {filteredSuppliers.map((supplier) => {
                    const classInfo = getSupplierClassBadge(supplier.score)
                    const categoriesList = (supplier.category || "Calibração")
                        .split(",")
                        .map(c => c.trim())
                        .filter(Boolean)

                    return (
                        <div 
                            key={supplier.id} 
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between animate-in fade-in duration-200"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <h3
                                        onClick={() => handleOpenModal(supplier)}
                                        className="text-base font-bold text-slate-900 dark:text-white break-words flex-1 cursor-pointer hover:text-blue-500"
                                    >
                                        {supplier.name}
                                    </h3>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${supplier.qualified ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
                                        {supplier.qualified ? "Qualificado" : "Não Qualificado"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {categoriesList.map((cat, idx) => {
                                        const badge = getCategoryBadgeStyle(cat)
                                        return (
                                            <span
                                                key={idx}
                                                onClick={() => handleOpenModal(supplier)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border cursor-pointer ${badge.cls}`}
                                            >
                                                <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                                                {cat}
                                            </span>
                                        )
                                    })}
                                </div>
                                
                                <div className="flex items-center justify-between text-sm py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">IQF / Classe F35</span>
                                    {classInfo ? (
                                        <span className={`px-2 py-0.5 rounded text-xs font-black ${classInfo.bg}`}>
                                            {classInfo.pct}% (Classe {classInfo.cls})
                                        </span>
                                    ) : (
                                        <span className="text-xs text-slate-400">-</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50 text-xs">
                                <span className="text-green-600 dark:text-green-400 font-semibold border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-full">Ativo</span>
                                <Link
                                    href={`/sgq/fornecedores/avaliacao?supplierId=${supplier.id}`}
                                    className="px-3 py-1.5 rounded-lg bg-[#2b5c92] text-white font-bold"
                                >
                                    Avaliar F35
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal Novo / Editar Fornecedor */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <h2 className="text-xl font-bold text-[#2b5c92] dark:text-blue-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[22px]">
                                    {editingSupplier ? "edit_square" : "add_business"}
                                </span>
                                {editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveSupplier} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Nome do Fornecedor *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Laboratório RBC, Provedor EP..."
                                    className="w-full px-3.5 py-2.5 border rounded-xl bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-sm"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Categoria *
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {SUPPLIER_CATEGORIES.map((cat) => {
                                        const isSelected = form.categories.includes(cat.label)
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => toggleFormCategory(cat.label)}
                                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                                                    isSelected
                                                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs"
                                                        : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                                                }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                                                    {cat.label}
                                                </span>
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {isSelected ? "check_circle" : "radio_button_unchecked"}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Selecione uma ou mais categorias de fornecimento.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nota Inicial (0 a 10)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        placeholder="Ex: 10.00"
                                        className="w-full px-3.5 py-2 border rounded-xl bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 text-sm"
                                        value={form.score}
                                        onChange={(e) => setForm({ ...form, score: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col justify-end pb-1">
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-[#2b5c92]"
                                            checked={form.qualified}
                                            onChange={(e) => setForm({ ...form, qualified: e.target.checked })}
                                        />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Qualificado
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-5 py-2 bg-[#2b5c92] hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    {isSaving ? "Salvando..." : "Salvar Fornecedor"}
                                </button>
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
        </div>
    )
}
