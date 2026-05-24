"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import CursorParticles from "@/components/CursorParticles";

export function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Início" },
        { href: "/sobre", label: "Sobre" },
        { href: "/ensaios", label: "Ensaios" },
        { href: "/simulacoes", label: "Simulações" },
        { href: "/acustica", label: "Acústica" },
        { href: "/cases", label: "Cases" },
        { href: "/industria", label: "Indústria" },
        { href: "/blog", label: "Blog" },
        { href: "/contato", label: "Contato" },
    ];

    return (
        <>
        <CursorParticles />
        <header className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <Image
                        src="/logo.png"
                        alt="MMC LAB"
                        width={130}
                        height={42}
                        className="object-contain transition-all"
                        priority
                    />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 hidden xs:inline-block">BETA</span>
                </Link>

                {/* Nav Desktop */}
                <nav className="hidden lg:flex flex-wrap justify-center items-center gap-3 xl:gap-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-primary transition-colors whitespace-nowrap"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Ações Desktop */}
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                    <ThemeToggle />
                    <Link
                        href="/login-cliente"
                        className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-[16px]">account_circle</span>
                        Clientes
                    </Link>
                    <Link
                        href="/login"
                        className="px-3 py-2 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-primary/20 dark:shadow-none flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-[16px]">badge</span>
                        Colaboradores
                    </Link>
                </div>

                {/* Ações Mobile */}
                <div className="flex lg:hidden items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Abrir menu"
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            {menuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Menu Mobile Dropdown */}
            {menuOpen && (
                <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-3 flex flex-col gap-2">
                        <Link
                            href="/login-cliente"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">account_circle</span>
                            Área do Cliente
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-2.5 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">badge</span>
                            Acesso Colaboradores
                        </Link>
                    </div>
                </div>
            )}
        </header>
        </>
    );
}
