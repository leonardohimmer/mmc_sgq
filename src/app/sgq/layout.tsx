"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SGQLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const pathname = usePathname()

    // Mapping previous Lucide icons to Material Symbols Outlined conceptually
    const navItems = [
        { label: "Dashboard", href: "/sgq", icon: "dashboard" },
        { label: "Políticas", href: "/sgq/politicas", icon: "menu_book" },
        { label: "Procedimentos", href: "/sgq/procedimentos", icon: "description" },
        { label: "Instruções de Trabalho", href: "/sgq/instrucoes", icon: "inventory" },
        { label: "Gestão de Recursos", href: "/sgq/recursos", icon: "manage_accounts" },
        { label: "Processos Oper.", href: "/sgq/processos", icon: "work" },
        { label: "Gestão de Riscos", href: "/sgq/riscos", icon: "gpp_maybe" },
        { label: "Indicadores", href: "/sgq/indicadores", icon: "bar_chart" },
        { label: "Fornecedores", href: "/sgq/fornecedores", icon: "local_shipping" },
        { label: "Equipamentos", href: "/sgq/equipamentos", icon: "build" },
        { label: "Não Conformidades", href: "/sgq/nc", icon: "report_problem" },
        { label: "Reclamações", href: "/sgq/reclamacoes", icon: "feedback" },
        { label: "Auditorias", href: "/sgq/auditorias", icon: "fact_check" },
        { label: "Análise Crítica", href: "/sgq/analise", icon: "analytics", restrictTo: ["DIREÇÃO", "QUALIDADE"] },
        { label: "Docs e Registros", href: "/sgq/documentos", icon: "folder_open" },
        { label: "Logs do Sistema", href: "/sgq/logs", icon: "history", restrictTo: ["DIREÇÃO", "QUALIDADE"] },
    ]

    return (
        <div className="min-h-screen bg-background-light text-slate-700 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-sm text-white shadow-sm">
                            M
                        </div>
                        <span className="font-extrabold tracking-tight text-slate-900">SGQ Interno</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {navItems.map((item) => {
                        if (item.restrictTo && !item.restrictTo.includes(session?.user?.role || "")) return null

                        const isActive = item.href === "/sgq"
                            ? pathname === "/sgq"
                            : pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? "bg-primary/10 text-primary w-full"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 w-full"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-slate-400"}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-tr-3xl shrink-0 mt-4">
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        <span className="material-symbols-outlined text-[32px] text-slate-400">account_circle</span>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{session?.user?.name}</p>
                            <p className="text-xs text-primary font-bold tracking-wide uppercase truncate">{session?.user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
