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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-500 text-3xl">local_shipping</span>
                Fornecedores
            </h1>

            <div className="flex flex-col gap-4">
                {/* Filters Row */}
                <div className="flex flex-wrap items-end gap-6 w-full justify-between">
                    <div className="flex gap-6 items-end">
                        <div className="flex flex-col">
                            <label className="text-sm text-slate-500 dark:text-slate-400 mb-1">Nome do Fornecedor</label>
                            <input
                                type="text"
                                className="px-3 py-1.5 border rounded w-64 bg-transparent border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500"
                                value={filterName}
                                placeholder="Buscar..."
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition">
                        Exportar Relatório
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
                            <th className="px-6 py-3 text-sm font-semibold text-center w-32">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-blue-50/50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {supplier.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-400">
                                    {supplier.qualified ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            Sim
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                            Não
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-400">
                                    {supplier.score !== null ? (
                                        <span className={`font-bold ${supplier.score >= 7 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                            {supplier.score.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-400">
                                    <span className="text-green-600 dark:text-green-400 font-medium text-xs border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-full">Ativo</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredSuppliers.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum fornecedor ativo encontrado.</div>
                )}
            </div>

        </div>
    )
}
