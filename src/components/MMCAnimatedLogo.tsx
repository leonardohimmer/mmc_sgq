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
        card: "w-14 h-11 rounded-xl p-1",
        glow: "-inset-1 blur-sm",
        logoW: 48,
        logoH: 28,
        title: "text-sm",
        subtitle: "text-[9px]",
        gap: "gap-2",
        wrapperSize: "w-15 h-12"
    },
    sm: {
        card: "w-20 h-14 rounded-2xl p-1.5",
        glow: "-inset-1.5 blur-md",
        logoW: 68,
        logoH: 40,
        title: "text-base",
        subtitle: "text-[10px]",
        gap: "gap-2.5",
        wrapperSize: "w-22 h-16"
    },
    md: {
        card: "w-28 h-16 sm:w-32 sm:h-[70px] rounded-2xl px-2.5 py-1.5",
        glow: "-inset-2 blur-md",
        logoW: 112,
        logoH: 65,
        title: "text-lg",
        subtitle: "text-xs",
        gap: "gap-3",
        wrapperSize: "w-30 h-18 sm:w-34 sm:h-[74px]"
    },
    lg: {
        card: "w-40 h-26 rounded-3xl px-3.5 py-2.5",
        glow: "-inset-2.5 blur-lg",
        logoW: 140,
        logoH: 82,
        title: "text-2xl",
        subtitle: "text-sm",
        gap: "gap-4",
        wrapperSize: "w-42 h-28"
    },
    xl: {
        card: "w-48 h-32 rounded-3xl px-4 py-3",
        glow: "-inset-3 blur-xl",
        logoW: 168,
        logoH: 98,
        title: "text-3xl",
        subtitle: "text-base",
        gap: "gap-5",
        wrapperSize: "w-50 h-34"
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
            {/* Contêiner da Logo com Efeito Pulsante Discreto (Sem Anéis Orbitais) */}
            <div className={`relative flex items-center justify-center shrink-0 ${config.wrapperSize}`}>
                {/* Halo Pulsante Discreto */}
                {animate && (
                    <div
                        className={`absolute rounded-3xl bg-primary/20 dark:bg-primary/25 ${config.glow} animate-orbit-pulse pointer-events-none`}
                    />
                )}

                {/* Card Central da Logo */}
                <div
                    className={`
                        relative flex items-center justify-center
                        bg-white/95 dark:bg-slate-900/95
                        border border-slate-200/80 dark:border-slate-800
                        shadow-sm shadow-primary/10 backdrop-blur-md
                        transition-all duration-300 group-hover:scale-[1.03]
                        ${config.card}
                    `}
                >
                    <Image
                        src="/logo-trimmed.png"
                        alt="MMC LAB"
                        width={config.logoW}
                        height={config.logoH}
                        className={`object-contain max-w-full max-h-full drop-shadow-[0_0_6px_rgba(77,182,172,0.25)] ${
                            animate ? "animate-logo-pulse" : ""
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
