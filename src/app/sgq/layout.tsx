"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { BackButton } from "@/components/BackButton"

export default function SGQLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const pathname = usePathname()

    // Mapping previous Lucide icons to Material Symbols Outlined conceptually
    const navItems = [
        { label: "Dashboard", href: "/sgq", icon: "dashboard" },
        { label: "Meus Ensaios", href: "/sgq/meus-ensaios", icon: "science", restrictTo: ["TÉCNICO DE LABORATÓRIO", "RESPONSÁVEL TÉCNICO", "DIREÇÃO"] },
        { label: "Execução de Ensaios", href: "/sgq/execucao-ensaios", icon: "assignment", restrictTo: ["TÉCNICO DE LABORATÓRIO", "RESPONSÁVEL TÉCNICO", "DIREÇÃO"] },
        { label: "Aprovação", href: "/sgq/aprovacao", icon: "verified", restrictTo: ["RESPONSÁVEL TÉCNICO", "DIREÇÃO"] },
        { label: "Políticas", href: "/sgq/politicas", icon: "menu_book", hideForTech: true },
        { label: "Procedimentos", href: "/sgq/procedimentos", icon: "description", hideForTech: true },
        { label: "Instruções de Trabalho", href: "/sgq/instrucoes", icon: "inventory", hideForTech: true },
        { label: "Gestão de Recursos", href: "/sgq/recursos", icon: "manage_accounts", hideForTech: true },
        { label: "Processos Oper.", href: "/sgq/processos", icon: "work", hideForTech: true },
        { label: "Gestão de Riscos", href: "/sgq/riscos", icon: "gpp_maybe", hideForTech: true },
        { label: "Indicadores", href: "/sgq/indicadores", icon: "bar_chart", hideForTech: true },
        { label: "Fornecedores", href: "/sgq/fornecedores", icon: "local_shipping", hideForTech: true },
        { label: "Equipamentos", href: "/sgq/equipamentos", icon: "build", hideForTech: true },
        { label: "Não Conformidades", href: "/sgq/nc", icon: "report_problem", hideForTech: true },
        { label: "Reclamações", href: "/sgq/reclamacoes", icon: "feedback", hideForTech: true },
        { label: "Auditorias", href: "/sgq/auditorias", icon: "fact_check", hideForTech: true },
        { label: "Análise Crítica", href: "/sgq/analise", icon: "analytics", restrictTo: ["DIREÇÃO", "QUALIDADE"] },
        { label: "Docs e Registros", href: "/sgq/documentos", icon: "folder_open", hideForTech: true },
        { label: "Colaboradores Online", href: "/sgq/colaboradores", icon: "diversity_3" },
        { label: "Cadastros", href: "/sgq/cadastros", icon: "group", restrictTo: ["DESENVOLVEDOR"] },
        { label: "Logs do Sistema", href: "/sgq/logs", icon: "history", restrictTo: ["DIREÇÃO", "QUALIDADE", "DESENVOLVEDOR"] },
    ]

    const userRole = session?.user?.role || ""
    const isTech = userRole === "TÉCNICO DE LABORATÓRIO" || userRole === "RESPONSÁVEL TÉCNICO"

    // Heartbeat de Presença (Ping)
    useEffect(() => {
        if (!session?.user) return

        const pingPresence = async () => {
            try {
                await fetch('/api/users/ping', { method: 'POST' })
            } catch (error) {
                console.error("Erro no ping de presença:", error)
            }
        }

        // Ping imediato no load inicial
        pingPresence()

        // Ping a cada 1 minuto
        const interval = setInterval(pingPresence, 60000)
        return () => clearInterval(interval)
    }, [session])

    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-colors duration-300">
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="MMC LAB"
                            width={140}
                            height={45}
                            className="object-contain dark:brightness-200 dark:grayscale transition-all"
                            priority
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e40af] bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">BETA</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {navItems.map((item) => {
                        if (item.restrictTo && !item.restrictTo.includes(userRole)) return null
                        if (item.hideForTech && isTech) return null

                        const isActive = item.href === "/sgq"
                            ? pathname === "/sgq"
                            : pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? "bg-primary/10 dark:bg-primary/20 text-primary w-full"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 w-full"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-tr-3xl shrink-0 mt-4 transition-colors duration-300">
                    <div className="flex items-center justify-between gap-3 px-2 py-2 mb-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="material-symbols-outlined text-[32px] text-slate-400 dark:text-slate-500">account_circle</span>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{session?.user?.name}</p>
                                <p className="text-xs text-primary font-bold tracking-wide uppercase truncate">{session?.user?.role}</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-6xl mx-auto flex flex-col gap-4">
                        <div className="flex items-center">
                            <BackButton />
                        </div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
