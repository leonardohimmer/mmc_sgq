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
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])
    const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

    const toggleGroup = (title: string) => {
        setCollapsedGroups(prev =>
            prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
        )
    }

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
        )
    }

    const navGroups = [
        {
            title: "Qualidade",
            items: [
                { label: "Dashboard", href: "/sgq", icon: "dashboard" },
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
            ]
        },
        {
            title: "Técnico",
            items: [
                { label: "Meus Ensaios", href: "/sgq/meus-ensaios", icon: "science", restrictTo: ["TÉCNICO DE LABORATÓRIO", "RESPONSÁVEL TÉCNICO", "DIREÇÃO", "DESENVOLVEDOR"] },
                { label: "Execução de Ensaios", href: "/sgq/execucao-ensaios", icon: "assignment", restrictTo: ["TÉCNICO DE LABORATÓRIO", "RESPONSÁVEL TÉCNICO", "DIREÇÃO", "DESENVOLVEDOR"] },
                { label: "Aprovação", href: "/sgq/aprovacao", icon: "verified", restrictTo: ["RESPONSÁVEL TÉCNICO", "DIREÇÃO", "DESENVOLVEDOR"] },
            ]
        },
        {
            title: "Administrativo",
            items: [
                {
                    label: "Contas a Pagar", icon: "payments",
                    subItems: [
                        { label: "Cadastro de fornecedores", href: "/sgq/admin/pagar/fornecedores" },
                        { label: "Lançamento de despesas", href: "/sgq/admin/pagar/despesas" },
                        { label: "Vencimentos e prazos", href: "/sgq/admin/pagar/vencimentos" },
                        { label: "Pagamentos", href: "/sgq/admin/pagar/pagamentos" },
                        { label: "Multas e descontos", href: "/sgq/admin/pagar/multas" },
                        { label: "Anexos", href: "/sgq/admin/pagar/anexos" },
                        { label: "Status", href: "/sgq/admin/pagar/status" },
                    ]
                },
                {
                    label: "Contas a Receber", icon: "request_quote",
                    subItems: [
                        { label: "Cadastro de clientes", href: "/sgq/admin/receber/clientes" },
                        { label: "Emissão de cobranças", href: "/sgq/admin/receber/cobrancas" },
                        { label: "Vencimentos", href: "/sgq/admin/receber/vencimentos" },
                        { label: "Recebimentos", href: "/sgq/admin/receber/recebimentos" },
                        { label: "Juros e multas", href: "/sgq/admin/receber/juros" },
                        { label: "Inadimplência", href: "/sgq/admin/receber/inadimplencia" },
                        { label: "Histórico", href: "/sgq/admin/receber/historico" },
                    ]
                },
                {
                    label: "Fluxo de Caixa", icon: "account_balance_wallet",
                    subItems: [
                        { label: "Análise de Períodos", href: "/sgq/admin/fluxo/periodos" },
                        { label: "Entradas x Saídas", href: "/sgq/admin/fluxo/entradas-saidas" },
                        { label: "Saldo", href: "/sgq/admin/fluxo/saldo" },
                        { label: "Projeção", href: "/sgq/admin/fluxo/projecao" },
                        { label: "Previsto x Realizado", href: "/sgq/admin/fluxo/comparativo" },
                    ]
                },
                {
                    label: "Gestão Bancária", icon: "account_balance",
                    subItems: [
                        { label: "Contas Bancárias", href: "/sgq/admin/banco/contas" },
                        { label: "Conciliação", href: "/sgq/admin/banco/conciliacao" },
                        { label: "Extratos", href: "/sgq/admin/banco/extratos" },
                        { label: "Transferências", href: "/sgq/admin/banco/transferencias" },
                        { label: "Tarifas", href: "/sgq/admin/banco/tarifas" },
                    ]
                },
                {
                    label: "Centro de Custos", icon: "pie_chart",
                    subItems: [
                        { label: "Cadastros", href: "/sgq/admin/custos/cadastros" },
                        { label: "Rateio", href: "/sgq/admin/custos/rateio" },
                        { label: "Análise de custos", href: "/sgq/admin/custos/analise" },
                        { label: "Relatórios", href: "/sgq/admin/custos/relatorios" },
                    ]
                },
                {
                    label: "Plano de Contas", icon: "schema",
                    subItems: [
                        { label: "Estrutura", href: "/sgq/admin/plano-contas/estrutura" },
                        { label: "Classificação", href: "/sgq/admin/plano-contas/classificacao" },
                        { label: "Vínculos", href: "/sgq/admin/plano-contas/vinculos" },
                        { label: "Padronização", href: "/sgq/admin/plano-contas/padronizacao" },
                    ]
                },
                {
                    label: "Faturamento e NF", icon: "receipt_long",
                    subItems: [
                        { label: "Emissão de NF", href: "/sgq/admin/faturamento/emissao" },
                        { label: "Integração", href: "/sgq/admin/faturamento/integracao" },
                        { label: "Impostos", href: "/sgq/admin/faturamento/impostos" },
                        { label: "Cancelamento", href: "/sgq/admin/faturamento/cancelamento" },
                        { label: "Histórico", href: "/sgq/admin/faturamento/historico" },
                    ]
                },
                {
                    label: "Impostos e Obrigações", icon: "price_check",
                    subItems: [
                        { label: "Cálculo", href: "/sgq/admin/impostos/calculo" },
                        { label: "Tributos", href: "/sgq/admin/impostos/tributos" },
                        { label: "Relatórios contábeis", href: "/sgq/admin/impostos/relatorios" },
                        { label: "Agenda fiscal", href: "/sgq/admin/impostos/agenda" },
                    ]
                }
            ]
        },
        {
            title: "Sistema",
            items: [
                { label: "Colaboradores Online", href: "/sgq/colaboradores", icon: "diversity_3" },
                { label: "Cadastros", href: "/sgq/cadastros", icon: "group", restrictTo: ["DESENVOLVEDOR"] },
                { label: "Logs do Sistema", href: "/sgq/logs", icon: "history", restrictTo: ["DIREÇÃO", "QUALIDADE", "DESENVOLVEDOR"] },
            ]
        }
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

                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {navGroups.map((group, groupIdx) => {
                        const visibleItems = group.items.filter(item => {
                            // @ts-ignore
                            if (item.restrictTo && !item.restrictTo.includes(userRole)) return false;
                            // @ts-ignore
                            if (item.hideForTech && isTech) return false;
                            return true;
                        });

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={groupIdx} className="flex flex-col space-y-1">
                                {!isCollapsed && (
                                    <button
                                        onClick={() => toggleGroup(group.title)}
                                        className="flex items-center justify-between w-full px-2 mb-2 mt-2 group outline-none"
                                        title={collapsedGroups.includes(group.title) ? "Expandir grupo" : "Recolher grupo"}
                                    >
                                        <h3 className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                            {group.title}
                                        </h3>
                                        <span className={`material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 transition-transform ${collapsedGroups.includes(group.title) ? '' : 'rotate-180'} group-hover:text-slate-600 dark:group-hover:text-slate-300`}>
                                            expand_more
                                        </span>
                                    </button>
                                )}
                                {isCollapsed && groupIdx > 0 && <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2" />}

                                {(!collapsedGroups.includes(group.title) || isCollapsed) && (
                                    <div className="flex flex-col space-y-1">                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {visibleItems.map((item: any, itemIdx: number) => {
                                            // @ts-ignore
                                            const hasSubItems = item.subItems && item.subItems.length > 0;
                                            const isActive = item.href
                                                ? (item.href === "/sgq" ? pathname === "/sgq" : pathname.startsWith(item.href))
                                                // @ts-ignore
                                                : (item.subItems?.some((sub) => pathname.startsWith(sub.href || '')) || false);

                                            const isExpanded = expandedMenus.includes(item.label);

                                            const content = (
                                                <>
                                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                                                        {item.icon}
                                                    </span>
                                                    {!isCollapsed && (
                                                        <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                                                    )}
                                                    {!isCollapsed && hasSubItems && (
                                                        <span className={`material-symbols-outlined text-[16px] text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                            expand_more
                                                        </span>
                                                    )}
                                                </>
                                            );

                                            const itemClass = `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive && !hasSubItems
                                                ? "bg-primary/10 dark:bg-primary/20 text-primary w-full"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 w-full"
                                                } ${isCollapsed ? "justify-center px-0" : ""}`;

                                            return (
                                                <div key={itemIdx} className="flex flex-col">
                                                    {hasSubItems ? (
                                                        <button
                                                            onClick={() => {
                                                                if (isCollapsed) setIsCollapsed(false);
                                                                toggleMenu(item.label);
                                                            }}
                                                            title={isCollapsed ? item.label : undefined}
                                                            className={itemClass}
                                                        >
                                                            {content}
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={item.href || '#'}
                                                            title={isCollapsed ? item.label : undefined}
                                                            className={itemClass}
                                                        >
                                                            {content}
                                                        </Link>
                                                    )}

                                                    {hasSubItems && isExpanded && !isCollapsed && (
                                                        <div className="mt-1 mb-2 ml-[34px] flex flex-col space-y-1 relative before:content-[''] before:absolute before:left-[-14px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800 before:rounded-full">
                                                            {/* @ts-ignore */}
                                                            {item.subItems.map((subItem, subIdx) => {
                                                                const isSubActive = pathname.startsWith(subItem.href || '');
                                                                return (
                                                                    <Link
                                                                        key={subIdx}
                                                                        href={subItem.href || '#'}
                                                                        className={`flex items-center py-1.5 px-3 text-[13px] rounded-lg transition-colors ${isSubActive
                                                                            ? "text-primary bg-primary/5 font-bold"
                                                                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                                            }`}
                                                                    >
                                                                        <span className="truncate">{subItem.label}</span>
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
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
