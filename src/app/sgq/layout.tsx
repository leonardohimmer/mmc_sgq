"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { BackButton } from "@/components/BackButton"
import { ModalPasswordChange } from "@/components/ModalPasswordChange"

export default function SGQLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

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

    // Heartbeat de Presença (Ping) e buscar Perfil
    useEffect(() => {
        if (!session?.user) return

        const pingPresence = async () => {
            try {
                await fetch('/api/users/ping', { method: 'POST' })
            } catch (error) {
                console.error("Erro no ping de presença:", error)
            }
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/users/profile')
                if (res.ok) {
                    const data = await res.json()
                    setUserAvatar(data.avatarUrl || null)
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error)
            }
        }

        // Executa imediatamente de forma assíncrona
        pingPresence()
        fetchProfile()

        // Ping a cada 1 minuto
        const interval = setInterval(pingPresence, 60000)
        return () => clearInterval(interval)
    }, [session])

    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`${isCollapsed ? "w-20" : "w-64"} z-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm transition-all duration-300 relative`}>

                {/* Botão de ocultar/abrir na borda */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all z-50 group"
                    title={isCollapsed ? "Expandir Menu" : "Ocultar Menu"}
                >
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                        {isCollapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>

                <div className={`h-20 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-6"} border-b border-slate-100 dark:border-slate-800 shrink-0 overflow-hidden`}>
                    {isCollapsed ? (
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-md">
                            M
                        </div>
                    ) : (
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
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
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
                                title={isCollapsed ? item.label : undefined}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? "bg-primary/10 dark:bg-primary/20 text-primary w-full"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 w-full"
                                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                <div className={`p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-tr-3xl shrink-0 transition-colors duration-300 ${isCollapsed ? 'flex flex-col items-center gap-4' : ''}`}>
                    <div className={`flex ${isCollapsed ? 'flex-col justify-center' : 'items-center justify-between'} gap-3 px-2 py-2 mb-2 w-full`}>
                        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                            {userAvatar ? (
                                <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700" />
                            ) : (
                                <span className="material-symbols-outlined text-[40px] text-slate-400 dark:text-slate-500 shrink-0">account_circle</span>
                            )}
                            {!isCollapsed && (
                                <div className="overflow-hidden flex-1 flex justify-between items-center group">
                                    <div className="overflow-hidden pr-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{session?.user?.name}</p>
                                        <p className="text-xs text-primary font-bold tracking-wide uppercase truncate">{session?.user?.role}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="text-slate-400 hover:text-blue-500 transition-colors shrink-0"
                                        title="Alterar Senha"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">key</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={isCollapsed ? 'mt-2' : ''}>
                            <ThemeToggle />
                        </div>
                    </div>
                    {isCollapsed && (
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-500 rounded-xl transition-colors"
                            title="Alterar Senha"
                        >
                            <span className="material-symbols-outlined text-[20px]">key</span>
                        </button>
                    )}
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        title={isCollapsed ? "Sair do Sistema" : undefined}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors ${isCollapsed ? 'justify-center px-0 w-10 h-10' : 'w-full'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        {!isCollapsed && "Sair do Sistema"}
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

            {/* Modal de Mudança de Senha */}
            <ModalPasswordChange
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    )
}
