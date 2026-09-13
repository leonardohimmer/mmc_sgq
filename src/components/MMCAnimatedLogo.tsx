"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export type MMCLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface MMCAnimatedLogoProps {
    size?: MMCLogoSize;
    showText?: boolean;
    subtitle?: string;
    badgeText?: string;
    href?: string;
    className?: string;
    priority?: boolean;
    animate?: boolean;
}

const SIZE_CONFIG = {
    xs: {
        card: "w-7 h-7 rounded-lg p-0.5",
        outerRing: "-inset-1 border-[1.5px]",
        innerRing: "-inset-0.5 border-[1px]",
        glow: "-inset-1 blur-sm",
        logoW: 24,
        logoH: 14,
        title: "text-sm",
        subtitle: "text-[9px]",
        gap: "gap-2",
        wrapperSize: "w-9 h-9"
    },
    sm: {
        card: "w-9 h-9 rounded-xl p-0.5",
        outerRing: "-inset-1.5 border-[2px]",
        innerRing: "-inset-0.5 border-[1.5px]",
        glow: "-inset-2 blur-md",
        logoW: 32,
        logoH: 19,
        title: "text-base",
        subtitle: "text-[10px]",
        gap: "gap-2.5",
        wrapperSize: "w-12 h-12"
    },
    md: {
        card: "w-12 h-12 rounded-2xl p-1",
        outerRing: "-inset-2 border-[2px]",
        innerRing: "-inset-1 border-[1.5px]",
        glow: "-inset-2.5 blur-lg",
        logoW: 44,
        logoH: 26,
        title: "text-lg",
        subtitle: "text-xs",
        gap: "gap-3",
        wrapperSize: "w-16 h-16"
    },
    lg: {
        card: "w-24 h-24 rounded-3xl p-1.5",
        outerRing: "-inset-4 border-[2.5px]",
        innerRing: "-inset-2 border-[2px]",
        glow: "-inset-5 blur-xl",
        logoW: 86,
        logoH: 50,
        title: "text-2xl",
        subtitle: "text-sm",
        gap: "gap-4",
        wrapperSize: "w-32 h-32"
    },
    xl: {
        card: "w-28 h-28 rounded-3xl p-2",
        outerRing: "-inset-5 border-[3px]",
        innerRing: "-inset-2 border-[2px]",
        glow: "-inset-6 blur-xl",
        logoW: 100,
        logoH: 58,
        title: "text-3xl",
        subtitle: "text-base",
        gap: "gap-5",
        wrapperSize: "w-40 h-40"
    },
};

export default function MMCAnimatedLogo({
    size = "md",
    showText = false,
    subtitle,
    badgeText,
    href,
    className = "",
    priority = false,
    animate = true,
}: MMCAnimatedLogoProps) {
    const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;

    const content = (
        <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
            {/* Contêiner da Logo com Anéis Orbitais */}
            <div className={`relative flex items-center justify-center shrink-0 ${config.wrapperSize}`}>
                {/* Brilho Neon de Fundo */}
                {animate && (
                    <div
                        className={`absolute rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 opacity-40 ${config.glow} animate-orbit-pulse pointer-events-none`}
                    />
                )}

                {/* Anel Orbital Externo (Giro Horário) */}
                <div
                    className={`
                        absolute rounded-full border-transparent border-t-blue-400 border-r-indigo-500 shadow-sm pointer-events-none
                        ${config.outerRing}
                        ${animate ? "animate-spin-slow" : ""}
                    `}
                />

                {/* Anel Orbital Interno (Giro Anti-horário) */}
                <div
                    className={`
                        absolute rounded-full border-transparent border-b-emerald-400 border-l-purple-500 pointer-events-none
                        ${config.innerRing}
                        ${animate ? "animate-spin-reverse-slow" : ""}
                    `}
                />

                {/* Card de Vidro da Logo Central */}
                <div
                    className={`
                        relative flex items-center justify-center
                        bg-slate-900/95 dark:bg-slate-900/90
                        border border-slate-700/70 dark:border-slate-800
                        shadow-md shadow-blue-500/10 backdrop-blur-md
                        transition-transform duration-300 group-hover:scale-105
                        ${config.card}
                    `}
                >
                    <Image
                        src="/logo-trimmed.png"
                        alt="MMC LAB"
                        width={config.logoW}
                        height={config.logoH}
                        className={`object-contain max-w-full max-h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.65)] ${
                            animate ? "animate-pulse" : ""
                        }`}
                        priority={priority}
                    />
                </div>
            </div>

            {/* Tipografia Corporativa (Opcional) */}
            {showText && (
                <div className="flex flex-col justify-center leading-tight">
                    <div className="flex items-center gap-2">
                        <span className={`font-black tracking-wider text-slate-900 dark:text-white uppercase ${config.title}`}>
                            MMC <span className="text-primary">LAB</span>
                        </span>
                        {badgeText && (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                {badgeText}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <span className={`text-slate-500 dark:text-slate-400 font-medium tracking-wide ${config.subtitle}`}>
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="group inline-flex items-center focus:outline-none">
                {content}
            </Link>
        );
    }

    return content;
}
