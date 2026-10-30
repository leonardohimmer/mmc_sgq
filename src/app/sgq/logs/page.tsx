"use client"

import { useState, useEffect } from "react"

type Log = {
    id: string
    action: string
    entity: string
    entityId: string
    details: string
    ipAddress: string
    createdAt: string
    user: {
        name: string
        role: string
    }
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/logs")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLogs(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div className="space-y-6 font-sans transition-colors duration-300">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                    <span className="material-symbols-outlined text-[24px]">gpp_bad</span>
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1 transition-colors">Trilhas de Auditoria (Logs)</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm transition-colors">Acesso Restrito. Registro imutável de ações do sistema (Requisito Inmetro).</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Data/Hora</th>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Ação</th>
                                <th className="px-6 py-4">Entidade Modificada</th>
                                <th className="px-6 py-4">IP de Origem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 font-bold text-slate-400">Carregando logs de auditoria...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 font-bold text-slate-400">Nenhum log registrado ainda.</td>
                                </tr>
                            ) : logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4 font-mono text-[12px] text-slate-400 font-bold">
                                        {new Date(log.createdAt).toLocaleString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div>
                                            <div className="font-extrabold text-slate-900 dark:text-slate-100">{log.user.name}</div>
                                            <div className="text-[10px] uppercase tracking-wider font-bold text-primary">{log.user.role}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider border ${log.action === 'CREATE' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                log.action === 'UPDATE' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' :
                                                    log.action === 'DELETE' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700 dark:text-slate-200">{log.entity}</div>
                                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]" title={log.entityId}>
                                            ID: {log.entityId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[14px]">router</span>
                                            {log.ipAddress}
                                        </div>
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
