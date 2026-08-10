"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MMCLoadingScreenProps {
    message?: string;
    submessage?: string;
    fullScreen?: boolean;
    compact?: boolean;
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
    compact = false
}: MMCLoadingScreenProps) {
    const [statusIndex, setStatusIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
                    
                    {/* Compact Spinning Logo Badge */}
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 p-1.5 border border-slate-800 shadow-md">
                        <Image
                            src="/logo.png"
                            alt="MMC LAB"
                            width={32}
                            height={16}
                            className="object-contain animate-pulse"
                            priority
                        />
                        <div className="absolute -inset-1 rounded-xl border border-primary/40 border-t-primary animate-spin" />
                    </div>

                    <div>
                        <p className="text-xs font-black text-white tracking-wide">{message}</p>
                        <p className="text-[10px] text-blue-400 font-bold transition-all duration-500">
                            {currentSubmessage}
                        </p>
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
                <div className="relative mb-8 flex items-center justify-center group cursor-pointer">
                    {/* Brilho neon de fundo */}
                    <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-40 blur-xl animate-pulse" />

                    {/* Anel Orbital Externo */}
                    <div className="absolute -inset-5 rounded-full border-2 border-transparent border-t-blue-400 border-r-indigo-500 animate-[spin_3s_linear_infinite] shadow-lg" />
                    
                    {/* Anel Orbital Interno (Sentido inverso) */}
                    <div className="absolute -inset-2 rounded-full border-2 border-transparent border-b-emerald-400 border-l-purple-500 animate-[spin_2s_linear_infinite_reverse]" />

                    {/* Card de Vidro da Logo Central */}
                    <div className="relative w-28 h-28 rounded-3xl bg-slate-900/90 shadow-2xl border-2 border-slate-800 flex items-center justify-center p-4 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/logo.png"
                            alt="MMC LAB"
                            width={100}
                            height={40}
                            className="object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse"
                            priority
                        />
                    </div>
                </div>

                {/* Título Principal */}
                <h3 className="text-xl font-black tracking-tight text-white mb-1 drop-shadow-md">
                    {message}
                </h3>

                {/* Submensagem dinâmica com troca fluida */}
                <p className="text-xs text-blue-400 font-bold mb-6 h-5 flex items-center justify-center transition-all duration-500 tracking-wide">
                    <span className="material-symbols-outlined text-[14px] mr-1.5 animate-spin text-blue-400">sync</span>
                    {currentSubmessage}
                </p>

                {/* Barra de Progresso Futurista com Shimmer Gradient */}
                <div className="w-56 h-2 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800 shadow-inner">
                    <div className="absolute inset-y-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 w-1/2 rounded-full animate-[shimmer_1.5s_infinite] shadow-md shadow-blue-500/50" />
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
