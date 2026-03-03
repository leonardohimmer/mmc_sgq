import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
    return (
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="MMC LAB"
                        width={160}
                        height={50}
                        className="object-contain dark:brightness-200 dark:grayscale transition-all"
                        priority
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">BETA</span>
                </Link>

                <nav className="hidden lg:flex flex-wrap justify-center items-center gap-3 xl:gap-5 text-sm font-bold text-slate-500 dark:text-slate-400">
                    <Link href="/" className="text-primary hover:text-teal-500 transition-colors">Início</Link>
                    <Link href="/sobre" className="hover:text-primary transition-colors">Sobre</Link>
                    <Link href="/ensaios" className="hover:text-primary transition-colors">Ensaios</Link>
                    <Link href="/simulacoes" className="hover:text-primary transition-colors">Simulações</Link>
                    <Link href="/acustica" className="hover:text-primary transition-colors">Acústica</Link>
                    <Link href="/cases" className="hover:text-primary transition-colors">Cases</Link>
                    <Link href="/industria" className="hover:text-primary transition-colors">Indústria</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
                </nav>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <ThemeToggle />
                    <Link
                        href="/login-cliente"
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        Clientes
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-primary/20 dark:shadow-none flex items-center gap-2"
                    >
                        Colaboradores
                    </Link>
                </div>
            </div>
        </header>
    );
}
