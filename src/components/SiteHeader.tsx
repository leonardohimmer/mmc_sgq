"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import CursorParticles from "@/components/CursorParticles";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

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
        <header className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-200/50 dark:border-slate-800/50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 lg:py-2 flex items-center justify-between gap-4">

                {/* Logo e Redes Sociais */}
                <div className="flex flex-col items-start lg:items-center gap-[2px] shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="MMC LAB"
                            width={115}
                            height={37}
                            className="object-contain transition-all"
                            priority
                        />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 hidden xs:inline-block">BETA</span>
                    </Link>
                    {/* Redes Sociais Desktop */}
                    <div className="hidden lg:flex items-center gap-[6px]">
                        <a
                            href="https://www.instagram.com/mmc.lab/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100 transition-colors duration-200"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-3 h-3" />
                        </a>
                        <a
                            href="https://www.facebook.com/mmclab.controle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100 transition-colors duration-200"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-3 h-3" />
                        </a>
                        <a
                            href="https://www.youtube.com/@mmclab_canoas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100 transition-colors duration-200"
                            aria-label="YouTube"
                        >
                            <Youtube className="w-3 h-3" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/mmc-lab-controle-tecnologico/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100 transition-colors duration-200"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {/* Nav Desktop */}
                <nav className="hidden lg:flex flex-wrap justify-center items-center gap-2 xl:gap-5.5 text-sm font-bold text-slate-500 dark:text-slate-400">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="premium-hover-link transition-colors whitespace-nowrap"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Ações Desktop */}
                <div className="hidden lg:flex items-center gap-3 shrink-0">
                    <ThemeToggle />
                    <Link
                        href="/login-cliente"
                        className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-bold rounded-2xl text-xs transition-all duration-300 shadow-sm hover:scale-[1.03] flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-[16px]">account_circle</span>
                        Clientes
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-2.5 bg-primary text-slate-950 font-bold rounded-2xl text-xs btn-hover-glow transition-all flex items-center gap-1.5"
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
                    {/* Redes Sociais no Mobile */}
                    <div className="flex items-center gap-4 px-3 py-2.5 my-1 border-t border-slate-100 dark:border-slate-800/50 pt-3">
                        <a
                            href="https://www.instagram.com/mmc.lab/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.facebook.com/mmclab.controle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.youtube.com/@mmclab_canoas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
                            aria-label="YouTube"
                        >
                            <Youtube className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/mmc-lab-controle-tecnologico/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
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
