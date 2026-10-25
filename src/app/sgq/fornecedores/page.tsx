"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import MMCLoadingScreen from "@/components/MMCLoadingScreen"

type Supplier = {
    id: string
    name: string
    qualified: boolean
    score: number | null
    active: boolean
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

    const filteredSuppliers = suppliers.filter(s => {
        return s.name.toLowerCase().includes(filterName.toLowerCase()) && s.active
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
                    <Link
                        href="/sgq/fornecedores/avaliacao"
                        className="px-4 py-2.5 bg-[#2b5c92] hover:bg-blue-800 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">rate_review</span>
                        Avaliar Fornecedor (F35)
                    </Link>
                    <button className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-orange-500/10">
                        <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nome do Fornecedor</label>
                    <input
                        type="text"
                        placeholder="Digite o nome para buscar..."
                        className="px-3.5 py-2.5 border rounded-xl w-full sm:max-w-md bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop View Table */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mt-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#2b5c92] text-white">
                            <th className="px-6 py-4 text-sm font-semibold">Nome do Fornecedor</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-36">Homologado</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-40">IQF (%) / Nota</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-40">Classe F35</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-32">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-right w-40">Avaliação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredSuppliers.map((supplier) => {
                            const classInfo = getSupplierClassBadge(supplier.score)
                            return (
                                <tr key={supplier.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {supplier.name}
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
                    return (
                        <div 
                            key={supplier.id} 
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between animate-in fade-in duration-200"
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white break-words flex-1">
                                        {supplier.name}
                                    </h3>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${supplier.qualified ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
                                        {supplier.qualified ? "Qualificado" : "Não Qualificado"}
                                    </span>
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
        </div>
    )
}
