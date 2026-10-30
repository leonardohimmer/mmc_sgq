"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import MMCLoadingScreen from "@/components/MMCLoadingScreen"

type Document = {
    id: string
    code: string
    title: string
    status: string
    version: number
    updatedAt: string
}

export default function DocumentosPage() {
    const { data: session } = useSession()
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/documentos")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDocuments(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const userRoles = (session?.user?.role || "").split(",").map(r => r.trim())
    const isAdminOrAuditor = userRoles.includes("ADMIN") || userRoles.includes("AUDITOR") || userRoles.includes("DESENVOLVEDOR")

    if (loading) {
        return (
            <MMCLoadingScreen
                message="Carregando controle de documentos..."
                submessage="Sincronizando procedimentos, POPs e manuais"
            />
        )
    }

    return (
        <div className="space-y-6 font-sans transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 transition-colors">Controle de Documentos</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">Gerencie todos os POPs, Manuais e Registros do Sistema.</p>
                </div>
                {isAdminOrAuditor && (
                    <button className="flex items-center gap-2 bg-primary hover:bg-teal-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/20 font-bold text-sm">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Novo Documento
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden flex flex-col transition-colors">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 bg-slate-50 dark:bg-slate-800/40">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por código ou título..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Filtros
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Código</th>
                                <th className="px-6 py-4">Título do Documento</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Versão</th>
                                <th className="px-6 py-4">Última Revisão</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 font-bold text-slate-400">Carregando documentos...</td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 font-bold text-slate-400">Nenhum documento encontrado.</td>
                                </tr>
                            ) : documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">{doc.code}</td>
                                    <td className="px-6 py-4 flex items-center gap-3 text-slate-900 dark:text-slate-100 font-bold">
                                        <span className="material-symbols-outlined text-slate-400 text-[18px]">description</span>
                                        {doc.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider border ${doc.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                doc.status === 'DRAFT' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                            }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">v{doc.version}.0</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors" title="Baixar PDF">
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
