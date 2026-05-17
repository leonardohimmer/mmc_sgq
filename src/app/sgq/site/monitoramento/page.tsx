"use client"

import { useEffect, useState } from "react"
import HeatmapView from "@/components/HeatmapView"

interface Click {
    id: string
    path: string
    x: number
    y: number
    viewWidth: number
}

interface ClickStat {
    path: string
    elementText: string
    elementTag: string
    selector: string
    _count: { _all: number }
}

interface PathStat {
    path: string
    _count: { _all: number }
}

export default function MonitoramentoPage() {
    const [viewMode, setViewMode] = useState<"dashboard" | "heatmap">("dashboard")
    const [clicks, setClicks] = useState<Click[]>([])
    const [stats, setStats] = useState<ClickStat[]>([])
    const [pathStats, setPathStats] = useState<PathStat[]>([])
    const [selectedPath, setSelectedPath] = useState("/")
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState("7")

    const fetchStats = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/monitoramento?days=${days}`)
            if (res.ok) {
                const data = await res.json()
                setClicks(data.clicks || [])
                setStats(data.stats || [])
                setPathStats(data.pathStats || [])
                
                if (data.pathStats && data.pathStats.length > 0 && !selectedPath) {
                    setSelectedPath(data.pathStats[0].path)
                }
            }
        } catch (e) {
            console.error("Erro ao buscar stats:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [days])

    // Função para gerar a cor do "termômetro"
    const getThermometerColor = (count: number, max: number) => {
        const percentage = max > 0 ? (count / max) * 100 : 0
        
        if (percentage > 80) return "bg-red-500 text-white shadow-red-200"
        if (percentage > 60) return "bg-orange-500 text-white shadow-orange-200"
        if (percentage > 40) return "bg-yellow-500 text-slate-900 shadow-yellow-200"
        if (percentage > 20) return "bg-emerald-500 text-white shadow-emerald-200"
        return "bg-blue-500 text-white shadow-blue-200"
    }

    const maxClicks = stats.length > 0 ? stats[0]._count._all : 0
    const maxPathClicks = pathStats.length > 0 ? pathStats[0]._count._all : 0

    const formatPath = (path: string) => {
        if (path === "/") return "Página Inicial"
        return path.replace("/", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">ads_click</span>
                        Monitoramento de Cliques
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${viewMode === 'dashboard' ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'}`}>
                            {viewMode === 'dashboard' ? 'Modo Relatório' : 'Modo Mapa de Calor'}
                        </span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Visualize as interações dos clientes
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1 mr-2">
                        <button 
                            onClick={() => setViewMode("dashboard")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'dashboard' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">dashboard</span>
                            Resumo
                        </button>
                        <button 
                            onClick={() => setViewMode("heatmap")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'heatmap' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                            Mapa de Calor
                        </button>
                    </div>

                    <select
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                    >
                        <option value="1">Hoje</option>
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                    </select>
                    <button
                        onClick={fetchStats}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                </div>
            </div>

            {viewMode === "dashboard" ? (
                <>
                    {/* Termômetro de Páginas */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">pages</span>
                                Páginas mais Acessadas
                            </h2>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Menos acessada</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Mais acessada</div>
                            </div>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="py-10 flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                </div>
                            ) : pathStats.length === 0 ? (
                                <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                                    <p className="text-sm">Nenhum dado de página ainda.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {pathStats.map((stat, idx) => (
                                        <div 
                                            key={idx}
                                            className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => { setSelectedPath(stat.path); setViewMode("heatmap"); }}
                                        >
                                            <div className={`flex items-center justify-center min-w-[45px] h-[45px] rounded-xl font-black text-lg ${getThermometerColor(stat._count._all, maxPathClicks)}`}>
                                                {stat._count._all}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{stat.path}</p>
                                                <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{formatPath(stat.path)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Termômetro de Engajamento por Elementos */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">ads_click</span>
                                Termômetro de Engajamento (Elementos)
                            </h2>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-slate-500 animate-pulse font-medium">Analisando cliques...</p>
                                </div>
                            ) : stats.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">touch_app</span>
                                    <p className="text-lg font-bold">Nenhum clique registrado ainda</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stats.map((stat, idx) => (
                                        <div 
                                            key={idx}
                                            className="group relative flex flex-col p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <span className="inline-flex px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 border border-slate-100 dark:border-slate-800 mb-2 uppercase">
                                                        {stat.path === "/" ? "Home" : stat.path.replace("/", "")}
                                                    </span>
                                                    <h3 className="font-extrabold text-slate-900 dark:text-white truncate" title={stat.elementText}>
                                                        {stat.elementText || "Elemento sem texto"}
                                                    </h3>
                                                </div>
                                                <div className={`flex flex-col items-center justify-center min-w-[50px] h-[50px] rounded-xl shadow-sm transition-transform group-hover:scale-110 ${getThermometerColor(stat._count._all, maxClicks)}`}>
                                                    <span className="text-lg font-black leading-none">{stat._count._all}</span>
                                                    <span className="text-[8px] font-bold uppercase mt-0.5 opacity-80">Cliques</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-auto pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-slate-400">tag</span>
                                                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[120px]">{stat.selector}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <span className="material-symbols-outlined text-[14px]">html</span>
                                                    <span className="text-[11px] font-bold">{stat.elementTag}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                            Mapa de Calor Visual
                        </h2>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {pathStats.map((stat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedPath(stat.path)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedPath === stat.path ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {formatPath(stat.path)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <HeatmapView clicks={clicks} path={selectedPath} />
                </div>
            )}

            {/* Dica */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                <div>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Como funciona o termômetro e o mapa de calor?</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        O **Resumo** mostra o ranking por números, enquanto o **Mapa de Calor** visualiza a densidade de cliques diretamente sobre um mockup da página. 
                        A intensidade das cores indica onde houve maior volume de interações.
                    </p>
                </div>
            </div>
        </div>
    )
}
