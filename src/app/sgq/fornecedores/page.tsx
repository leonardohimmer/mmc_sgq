"use client"

import { useState, useEffect } from "react"

type Supplier = {
    id: string
    name: string
    qualified: boolean
    score: number | null
    active: boolean
}

export default function FornecedoresQualidadePage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filters
    const [filterName, setFilterName] = useState("")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            // Reaproveita o endpoint para buscar os fornecedores.
            const res = await fetch("/api/suppliers")
            if (res.ok) {
                const data = await res.json()
                // Aqui na Qualidade podemos querer ver apenas os fornecedores ativos,
                // mas caso a pessoa queira ver todos:
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

    if (isLoading) return <div className="p-8">Carregando...</div>

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-500 text-3xl">local_shipping</span>
                    Fornecedores e Qualificação
                </h1>
                <button className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-orange-500/10">
                    <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                    Exportar Relatório
                </button>
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
                            <th className="px-6 py-4 text-sm font-semibold">Nome</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-32">Qualificado</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-32">Nota</th>
                            <th className="px-6 py-4 text-sm font-semibold text-center w-32">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                                    {supplier.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    {supplier.qualified ? (
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50">
                                            Sim
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50">
                                            Não
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    {supplier.score !== null ? (
                                        <span className={`font-bold text-sm ${supplier.score >= 7 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                            {supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className="text-green-600 dark:text-green-400 font-medium text-xs border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-2.5 py-1 rounded-full">Ativo</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Nenhum fornecedor ativo encontrado.</div>
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
                                <h3 className="text-base font-bold text-slate-900 dark:text-white break-words flex-1">
                                    {supplier.name}
                                </h3>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${supplier.qualified ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'}`}>
                                    {supplier.qualified ? "Qualificado" : "Não Qualificado"}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm py-2 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Nota de Avaliação</span>
                                <span className={`font-bold text-base ${supplier.score !== null && supplier.score >= 7 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                    {supplier.score !== null ? supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50 text-xs">
                            <span className="text-slate-400 font-medium">Situação Cadastral</span>
                            <span className="text-green-600 dark:text-green-400 font-semibold border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-full">Ativo</span>
                        </div>
                    </div>
                ))}
                {filteredSuppliers.length === 0 && (
                    <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl col-span-full">Nenhum fornecedor ativo encontrado.</div>
                )}
            </div>

        </div>
    )
}
