"use client"

import { useState, useMemo } from "react"

interface Click {
    id: string
    path: string
    x: number
    y: number
    viewWidth: number
}

interface HeatmapViewProps {
    clicks: Click[]
    path: string
}

export default function HeatmapView({ clicks, path }: HeatmapViewProps) {
    const [opacity, setOpacity] = useState(0.6)
    const [pointSize, setPointSize] = useState(30)

    const filteredClicks = useMemo(() => {
        return clicks.filter(c => c.path === path && c.x !== null && c.y !== null)
    }, [clicks, path])

    const getBackgroundImage = (p: string) => {
        if (p === "/") return "/heatmap/home.png"
        if (p === "/sobre") return "/heatmap/sobre.png"
        if (p === "/servicos") return "/heatmap/servicos.png"
        if (p === "/contato") return "/heatmap/contato.png"
        if (p === "/ensaios" || p === "/simulacoes") return "/heatmap/ensaios.png"
        if (p === "/login" || p === "/sgq/login") return "/heatmap/login.png"
        return "/heatmap/home.png" // fallback
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Opacidade do Calor</label>
                        <input 
                            type="range" min="0.1" max="1" step="0.1" 
                            value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Tamanho do Ponto</label>
                        <input 
                            type="range" min="10" max="100" step="5" 
                            value={pointSize} onChange={(e) => setPointSize(parseInt(e.target.value))}
                            className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-500">Pontos de Calor: <span className="text-primary">{filteredClicks.length}</span></p>
                </div>
            </div>

            <div className="relative w-full aspect-video bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
                {/* Imagem de Fundo (Página Real) */}
                <img 
                    src={getBackgroundImage(path)} 
                    alt="Página Real" 
                    className="w-full h-full object-cover object-top shadow-inner"
                />

                {/* Camada de Calor com Filtro de Densidade */}
                <div className="absolute inset-0 pointer-events-none" style={{ opacity, filter: 'url(#heatmap-color-ramp)' }}>
                    {filteredClicks.map((click) => (
                        <div 
                            key={click.id}
                            className="absolute rounded-full"
                            style={{
                                left: `${click.x * 100}%`,
                                top: `${click.y * 100}%`,
                                width: `${pointSize}px`,
                                height: `${pointSize}px`,
                                transform: 'translate(-50%, -50%)',
                                background: 'radial-gradient(circle, rgba(0,0,0,1) 0%, transparent 80%)',
                                mixBlendMode: 'screen',
                            }}
                        />
                    ))}
                </div>

                {/* Filtro SVG para Escala de Cores (Azul -> Verde -> Amarelo -> Vermelho) */}
                <svg width="0" height="0" className="absolute">
                    <filter id="heatmap-color-ramp">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={pointSize / 4} result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 20 -2
                        " result="alpha-mask" />
                        <feComponentTransfer in="alpha-mask">
                            <feFuncR type="table" tableValues="0 0 0.5 1 1" />
                            <feFuncG type="table" tableValues="0 0.5 1 0.5 0" />
                            <feFuncB type="table" tableValues="1 1 0.5 0 0" />
                        </feComponentTransfer>
                    </filter>
                </svg>

                {/* Overlay de Legenda */}
                <div className="absolute bottom-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-xl text-white border border-white/10">
                    <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Mapa de Calor Ativo</p>
                    <p className="text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {path === "/" ? "Home Page" : path}
                    </p>
                </div>
            </div>
        </div>
    )
}
