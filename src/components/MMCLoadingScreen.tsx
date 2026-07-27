"use client";

import React from "react";
import Image from "next/image";

interface MMCLoadingScreenProps {
    message?: string;
    submessage?: string;
    fullScreen?: boolean;
    compact?: boolean;
}

export default function MMCLoadingScreen({
    message = "Carregando informações...",
    submessage = "Sincronizando seus dados em tempo real com a MMC LAB",
    fullScreen = true,
    compact = false
}: MMCLoadingScreenProps) {
    if (compact) {
        return (
            <div className="flex items-center justify-center p-8 w-full animate-in fade-in duration-300">
                <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-lg">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{message}</p>
                        {submessage && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{submessage}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`
            ${fullScreen ? "fixed inset-0 z-50 min-h-screen" : "w-full py-20 min-h-[400px] rounded-3xl"} 
            flex flex-col items-center justify-center 
            bg-gradient-to-b from-slate-50 via-slate-100/90 to-slate-200/50 
            dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-950 
            text-slate-800 dark:text-slate-100 
            transition-all duration-500 animate-in fade-in duration-300 backdrop-blur-md
        `}>
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl -top-10 -left-10 pointer-events-none animate-pulse"></div>
            <div className="absolute w-72 h-72 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto px-6 text-center">
                {/* Logo with Glow Ring */}
                <div className="relative mb-8 flex items-center justify-center">
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/30 via-emerald-500/20 to-blue-500/30 blur-lg animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-3">
                        <Image
                            src="/logo.png"
                            alt="MMC LAB"
                            width={80}
                            height={32}
                            className="object-contain animate-pulse"
                            priority
                        />
                    </div>
                    {/* Spinning ring */}
                    <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-primary border-r-emerald-500 animate-spin"></div>
                </div>

                {/* Main Message */}
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-1">
                    {message}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
                    {submessage}
                </p>

                {/* Progress bar animation */}
                <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                    <div className="absolute inset-y-0 bg-gradient-to-r from-blue-500 via-primary to-emerald-500 w-1/2 rounded-full animate-[shimmer_1.5s_infinite] shadow-sm"></div>
                </div>

                {/* Subtle indicator tag */}
                <div className="mt-8 flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>MMC LAB SISTEMA DE GESTÃO</span>
                </div>
            </div>
        </div>
    );
}
