"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MMCAnimatedLogo from "@/components/MMCAnimatedLogo";

interface MMCLoadingScreenProps {
    message?: string;
    submessage?: string;
    fullScreen?: boolean;
    compact?: boolean;
    duration?: number;
}

const LOADING_STATUS_CYCLES = [
    "Sincronizando com a nuvem MMC LAB...",
    "Verificando saldos contratuais e laudos...",
    "Otimizando cache e integridade dos processos...",
    "Carregando informações em tempo real...",
    "Praticamente pronto! Finalizando carregamento..."
];

export default function MMCLoadingScreen({
    message = "Carregando informações...",
    submessage,
    fullScreen = true,
    compact = false,
    duration = 2200
}: MMCLoadingScreenProps) {
    const [statusIndex, setStatusIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [progress, setProgress] = useState(0);

    // Simulação do progresso iniciando estritamente do zero e carregando até 100%
    useEffect(() => {
        setProgress(0);
        const startTime = Date.now();
        const totalDuration = duration || 2200;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const factor = Math.min(elapsed / totalDuration, 1);

            // Curva de progresso fluida e orgânica
            let current = 0;
            if (factor < 0.25) {
                // Arrancada inicial de 0% a 40%
                current = (factor / 0.25) * 40;
            } else if (factor < 0.65) {
                // Avanço constante de 40% a 78%
                current = 40 + ((factor - 0.25) / 0.4) * 38;
            } else if (factor < 0.9) {
                // Desaceleração realista de 78% a 94%
                current = 78 + ((factor - 0.65) / 0.25) * 16;
            } else {
                // Conclusão até 100%
                current = 94 + ((factor - 0.9) / 0.1) * 6;
            }

            const clamped = Math.min(Math.round(current), 100);
            setProgress(clamped);

            if (factor >= 1) {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [duration]);

    // Rotação dinâmica de mensagens secundárias caso não fornecida explicitamente
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % LOADING_STATUS_CYCLES.length);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!fullScreen) return;
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) / 35;
        const moveY = (clientY - window.innerHeight / 2) / 35;
        setMousePos({ x: moveX, y: moveY });
    };

    const currentSubmessage = submessage || LOADING_STATUS_CYCLES[statusIndex];

    if (compact) {
        return (
            <div className="flex items-center justify-center p-8 w-full animate-in fade-in duration-300">
                <div className="flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 animate-pulse pointer-events-none" />
                    
                    {/* Compact Orbital Logo */}
                    <div className="shrink-0 flex items-center justify-center">
                        <MMCAnimatedLogo size="sm" priority />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white tracking-wide">{message}</p>
                        <p className="text-[10px] text-blue-400 font-bold transition-all duration-500 truncate">
                            {currentSubmessage}
                        </p>
                        {/* Mini Barra de Progresso Compacta */}
                        <div className="w-44 h-1.5 bg-slate-950 rounded-full overflow-hidden relative border border-slate-800/80 mt-2 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-75 ease-out shadow-sm relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            onMouseMove={handleMouseMove}
            className={`
                ${fullScreen ? "fixed inset-0 z-50 min-h-screen" : "w-full py-20 min-h-[400px] rounded-3xl"} 
                flex flex-col items-center justify-center 
                bg-slate-950/95 backdrop-blur-xl 
                text-white select-none
                transition-all duration-300 animate-in fade-in duration-300 relative overflow-hidden
            `}
        >
            {/* Fundo com Orbes de Brilho Dinâmicos */}
            <div 
                className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-20 -left-20 pointer-events-none animate-pulse duration-1000 transition-transform ease-out"
                style={{ transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px)` }}
            />
            <div 
                className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none animate-pulse duration-1000 transition-transform ease-out"
                style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)` }}
            />
            <div className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping duration-1000" />

            <div 
                className="relative z-10 flex flex-col items-center max-w-md mx-auto px-6 text-center transition-transform duration-200 ease-out"
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            >
                {/* LOGO CENTRALIZADO COM ANÉIS ORBITAIS E GLOW FUTURISTA */}
                <MMCAnimatedLogo size="xl" className="mb-8" priority />

                {/* Título Principal */}
                <h3 className="text-xl font-black tracking-tight text-white mb-1 drop-shadow-md">
                    {message}
                </h3>

                {/* Submensagem dinâmica com troca fluida */}
                <p className="text-xs text-blue-400 font-bold mb-6 h-5 flex items-center justify-center transition-all duration-500 tracking-wide">
                    <span className="material-symbols-outlined text-[14px] mr-1.5 animate-spin text-blue-400">sync</span>
                    {currentSubmessage}
                </p>

                {/* Barra de Progresso Futurista com Simulação de Carregamento de 0% a 100% */}
                <div className="w-64 sm:w-72 h-2.5 bg-slate-900/90 rounded-full overflow-hidden relative border border-slate-800/80 shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_14px_rgba(59,130,246,0.6)] relative overflow-hidden" 
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Badge de Rodapé Informativo */}
                <div className="mt-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-extrabold uppercase tracking-widest text-slate-300 shadow-lg backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>MMC LAB • TECNOLOGIA & QUALIDADE</span>
                </div>
            </div>
        </div>
    );
}
