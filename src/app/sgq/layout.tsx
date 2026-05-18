"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
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
    const [userPermissions, setUserPermissions] = useState<string[]>([])
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const lastActivityRef = useRef<number>(Date.now())

    // Recupera o estado do localStorage quando o componente é montado no cliente
    useEffect(() => {
        setIsMounted(true)
        try {
            const savedIsCollapsed = localStorage.getItem("sgq:sidebar:isCollapsed")
            if (savedIsCollapsed !== null) setIsCollapsed(JSON.parse(savedIsCollapsed))

            const savedExpandedMenus = localStorage.getItem("sgq:sidebar:expandedMenus")
            if (savedExpandedMenus !== null) setExpandedMenus(JSON.parse(savedExpandedMenus))

            const savedCollapsedGroups = localStorage.getItem("sgq:sidebar:collapsedGroups")
            if (savedCollapsedGroups !== null) setCollapsedGroups(JSON.parse(savedCollapsedGroups))
        } catch (e) {
            console.error("Failed to parse sidebar state from localStorage", e)
        }
    }, [])

    const handleSetIsCollapsed = (value: boolean) => {
        setIsCollapsed(value)
        try {
            localStorage.setItem("sgq:sidebar:isCollapsed", JSON.stringify(value))
        } catch (e) { }
    }

    const toggleGroup = (title: string) => {
        setCollapsedGroups(prev => {
            const newState = prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
            try {
                localStorage.setItem("sgq:sidebar:collapsedGroups", JSON.stringify(newState))
            } catch (e) { }
            return newState
        })
    }

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev => {
            const newState = prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
            try {
                localStorage.setItem("sgq:sidebar:expandedMenus", JSON.stringify(newState))
            } catch (e) { }
            return newState
        })
    }

    const navGroups = [
        {
            title: "Técnico",
            items: [
                { label: "Painel de controle", href: "/sgq/tecnico-dashboard", icon: "dashboard", permissionId: "tecnico_dashboard" },
                { label: "Envio da Proposta", href: "/sgq/envio-proposta", icon: "send_money", permissionId: "tecnico_envio_proposta" },
                { label: "Aguardando agendamento", href: "/sgq/aguardando-agendamento", icon: "pending_actions", permissionId: "tecnico_aguardando_agendamento" },
                { label: "Execução de Ensaios", href: "/sgq/execucao-ensaios", icon: "assignment", permissionId: "tecnico_execucao_ensaios" },
                { label: "Elaboração de Relatório", href: "/sgq/elaboracao-relatorio", icon: "edit_document", permissionId: "tecnico_elaboracao_relatorio" },
                {
                    label: "Aprovação", icon: "fact_check", permissionId: "tecnico_aprovacao",
                    subItems: [
                        { label: "Acústica", href: "/sgq/aprovacao?area=acustica", permissionId: "resp_acustica" },
                        { label: "Aderência", href: "/sgq/aprovacao?area=aderencia", permissionId: "resp_aderencia" },
                        { label: "Guarda-corpo", href: "/sgq/aprovacao?area=guarda-corpo", permissionId: "resp_guarda_corpo" },
                        { label: "Lumínico", href: "/sgq/aprovacao?area=luminico", permissionId: "resp_luminico" },
                        { label: "Percussão", href: "/sgq/aprovacao?area=percussao", permissionId: "resp_percussao" },
                        { label: "Impermeabilização", href: "/sgq/aprovacao?area=impermeabilizacao", permissionId: "resp_impermeabilizacao" }
                    ]
                },
                { label: "Emissão de cobranças", href: "/sgq/admin/receber/cobrancas", icon: "receipt", permissionId: "tecnico_cobrancas" },
                { label: "Recebimentos", href: "/sgq/admin/receber/recebimentos", icon: "payments", permissionId: "tecnico_recebimentos" },
                { label: "Pesquisa de Satisfação", href: "/sgq/pesquisa-satisfacao", icon: "sentiment_satisfied", permissionId: "tecnico_pesquisa_satisfacao" },
                { label: "Histórico de processos", href: "/sgq/historico-processos", icon: "history", permissionId: "tecnico_pesquisa_satisfacao" },
            ]
        },
        {
            title: "Qualidade",
            items: [
                { label: "Painel de controle", href: "/sgq", icon: "dashboard", permissionId: "qualidade_dashboard" },
                { label: "Políticas", href: "/sgq/politicas", icon: "menu_book", permissionId: "qualidade_politicas" },
                { label: "Procedimentos", href: "/sgq/procedimentos", icon: "description", permissionId: "qualidade_procedimentos" },
                { label: "Instruções de Trabalho", href: "/sgq/instrucoes", icon: "inventory", permissionId: "qualidade_instrucoes" },
                { label: "Gestão de Recursos", href: "/sgq/recursos", icon: "manage_accounts", permissionId: "qualidade_recursos" },
                { label: "Processos Oper.", href: "/sgq/processos", icon: "work", permissionId: "qualidade_processos" },
                { label: "Gestão de Riscos", href: "/sgq/riscos", icon: "gpp_maybe", permissionId: "qualidade_riscos" },
                { label: "Indicadores", href: "/sgq/indicadores", icon: "bar_chart", permissionId: "qualidade_indicadores" },
                {
                    label: "Fornecedores", icon: "local_shipping", permissionId: "qualidade_fornecedores",
                    subItems: [
                        { label: "Lista de Fornecedores", href: "/sgq/fornecedores" },
                        { label: "Avaliação", href: "/sgq/fornecedores/avaliacao" }
                    ]
                },
                { label: "Equipamentos", href: "/sgq/equipamentos", icon: "build", permissionId: "qualidade_equipamentos" },
                { label: "Não Conformidades", href: "/sgq/nc", icon: "report_problem", permissionId: "qualidade_nc" },
                { label: "Reclamações", href: "/sgq/reclamacoes", icon: "feedback", permissionId: "qualidade_reclamacoes" },
                { label: "Auditorias", href: "/sgq/auditorias", icon: "fact_check", permissionId: "qualidade_auditorias" },
                { label: "Análise Crítica", href: "/sgq/analise", icon: "analytics", permissionId: "qualidade_analise_critica" },
                { label: "Docs e Registros", href: "/sgq/documentos", icon: "folder_open", permissionId: "qualidade_docs_registros" },
            ]
        },
        {
            title: "Projetos",
            items: [
                { label: "Concepção e modelagem", href: "/sgq/projetos/concepcao", icon: "design_services", permissionId: "projetos_concepcao" },
                { label: "Cálculos e dimensionamento", href: "/sgq/projetos/calculos", icon: "calculate", permissionId: "projetos_calculos" },
                { label: "Documentação e normas", href: "/sgq/projetos/documentacao", icon: "architecture", permissionId: "projetos_documentacao" },
                { label: "Visitas técnicas", href: "/sgq/projetos/visitas", icon: "engineering", permissionId: "projetos_visitas" },
            ]
        },
        {
            title: "Administrativo",
            items: [
                {
                    label: "Contas a Pagar", icon: "payments", permissionId: "admin_contas_pagar",
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
                    label: "Contas a Receber", icon: "request_quote", permissionId: "admin_contas_receber",
                    subItems: [
                        { label: "Cadastro de clientes", href: "/sgq/admin/receber/clientes" },
                        { label: "Vencimentos", href: "/sgq/admin/receber/vencimentos" },
                        { label: "Juros e multas", href: "/sgq/admin/receber/juros" },
                        { label: "Inadimplência", href: "/sgq/admin/receber/inadimplencia" },
                        { label: "Histórico", href: "/sgq/admin/receber/historico" },
                    ]
                },
                {
                    label: "Fluxo de Caixa", icon: "account_balance_wallet", permissionId: "admin_fluxo_caixa",
                    subItems: [
                        { label: "Análise de Períodos", href: "/sgq/admin/fluxo/periodos" },
                        { label: "Entradas x Saídas", href: "/sgq/admin/fluxo/entradas-saidas" },
                        { label: "Saldo", href: "/sgq/admin/fluxo/saldo" },
                        { label: "Projeção", href: "/sgq/admin/fluxo/projecao" },
                        { label: "Previsto x Realizado", href: "/sgq/admin/fluxo/comparativo" },
                    ]
                },
                {
                    label: "Gestão Bancária", icon: "account_balance", permissionId: "admin_gestao_bancaria",
                    subItems: [
                        { label: "Contas Bancárias", href: "/sgq/admin/banco/contas" },
                        { label: "Conciliação", href: "/sgq/admin/banco/conciliacao" },
                        { label: "Extratos", href: "/sgq/admin/banco/extratos" },
                        { label: "Transferências", href: "/sgq/admin/banco/transferencias" },
                        { label: "Tarifas", href: "/sgq/admin/banco/tarifas" },
                    ]
                },
                {
                    label: "Centro de Custos", icon: "pie_chart", permissionId: "admin_centro_custos",
                    subItems: [
                        { label: "Cadastros", href: "/sgq/admin/custos/cadastros" },
                        { label: "Rateio", href: "/sgq/admin/custos/rateio" },
                        { label: "Análise de custos", href: "/sgq/admin/custos/analise" },
                        { label: "Relatórios", href: "/sgq/admin/custos/relatorios" },
                    ]
                },
                {
                    label: "Plano de Contas", icon: "schema", permissionId: "admin_plano_contas",
                    subItems: [
                        { label: "Estrutura", href: "/sgq/admin/plano-contas/estrutura" },
                        { label: "Classificação", href: "/sgq/admin/plano-contas/classificacao" },
                        { label: "Vínculos", href: "/sgq/admin/plano-contas/vinculos" },
                        { label: "Padronização", href: "/sgq/admin/plano-contas/padronizacao" },
                    ]
                },
                {
                    label: "Faturamento e NF", icon: "receipt_long", permissionId: "admin_faturamento_nf",
                    subItems: [
                        { label: "Emissão de NF", href: "/sgq/admin/faturamento/emissao" },
                        { label: "Integração", href: "/sgq/admin/faturamento/integracao" },
                        { label: "Impostos", href: "/sgq/admin/faturamento/impostos" },
                        { label: "Cancelamento", href: "/sgq/admin/faturamento/cancelamento" },
                        { label: "Histórico", href: "/sgq/admin/faturamento/historico" },
                    ]
                },
                {
                    label: "Impostos e Obrigações", icon: "price_check", permissionId: "admin_impostos_obrigacoes",
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
                { label: "Agenda", href: "/sgq/agenda", icon: "calendar_month", permissionId: "sistema_agenda" },
                { label: "Colaboradores Online", href: "/sgq/colaboradores", icon: "diversity_3", permissionId: "sistema_colaboradores" },
                {
                    label: "Cadastros", icon: "group", permissionId: "sistema_cadastros",
                    subItems: [
                        { label: "Colaboradores", href: "/sgq/cadastros" },
                        { label: "Responsável técnico", href: "/sgq/cadastros/responsavel-tecnico" },
                        { label: "Clientes", href: "/sgq/cadastros/clientes" },
                        { label: "Fornecedores", href: "/sgq/cadastros/fornecedores" },
                        { label: "Equipamentos", href: "/sgq/cadastros/equipamentos" }
                    ]
                },
                { label: "Logs do Sistema", href: "/sgq/logs", icon: "history", permissionId: "sistema_logs" },
                {
                    label: "Site", icon: "language", permissionId: "sistema_site",
                    subItems: [
                        { label: "Gerenciar Site", href: "/sgq/site" },
                        { label: "Construtoras", href: "/sgq/site/clientes" },
                        { label: "Orçamentos", href: "/sgq/site/orcamentos" },
                        { label: "Monitoramento", href: "/sgq/site/monitoramento" },
                    ]
                },
            ]
        }
    ]

    const userRole = session?.user?.role || ""
    const userRoles = userRole.split(',').map((r: string) => r.trim())

    const handleSignOut = async () => {
        try {
            await fetch('/api/users/offline', { method: 'POST' })
        } catch (error) {
            console.error("Erro ao registrar saída:", error)
        } finally {
            signOut({ callbackUrl: "/" })
        }
    }

    // Rastrear interações do usuário para determinar inatividade
    useEffect(() => {
        if (typeof window === "undefined") return

        const handleActivity = () => {
            lastActivityRef.current = Date.now()
        }

        window.addEventListener('mousemove', handleActivity)
        window.addEventListener('keydown', handleActivity)
        window.addEventListener('click', handleActivity)
        window.addEventListener('scroll', handleActivity)

        return () => {
            window.removeEventListener('mousemove', handleActivity)
            window.removeEventListener('keydown', handleActivity)
            window.removeEventListener('click', handleActivity)
            window.removeEventListener('scroll', handleActivity)
        }
    }, [])

    // Heartbeat de Presença (Ping), buscar Perfil e checar Inatividade
    useEffect(() => {
        if (!session?.user) return

        const pingPresence = async () => {
            // Em caso de inatividade por mais de 1.5 minutos,
            // evita enviar o ping para que os outros usuários o vejam como "ausente"
            if (Date.now() - lastActivityRef.current > 90000) {
                return
            }

            try {
                await fetch('/api/users/ping', { method: 'POST' })
            } catch (error) {
                console.error("Erro no ping de presença:", error)
            }
        }

        const checkInactivity = async () => {
            // Se inativo por mais de 5 minutos, desconecta e vai pra home
            if (Date.now() - lastActivityRef.current > 5 * 60 * 1000) {
                try {
                    await fetch('/api/users/offline', { method: 'POST' })
                } catch (e) { }
                signOut({ callbackUrl: "/" })
            }
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/users/profile')
                if (res.ok) {
                    const data = await res.json()
                    setUserAvatar(data.avatarUrl || null)
                    setUserPermissions(data.profile?.permissions || [])
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error)
            }
        }

        // Executa imediatamente de forma assíncrona
        pingPresence()
        fetchProfile()

        // Ping a cada 1 minuto e checagem de inatividade a cada 15 segundos
        const pingInterval = setInterval(pingPresence, 60000)
        const inactivityInterval = setInterval(checkInactivity, 15000)

        return () => {
            clearInterval(pingInterval)
            clearInterval(inactivityInterval)
        }
    }, [session])

    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950 text-slate-700 dark:text-slate-300 flex font-sans transition-colors duration-300">

            {/* Barra superior mobile */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shadow-sm">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Abrir menu"
                >
                    <span className="material-symbols-outlined text-[22px]">menu</span>
                </button>
                <Image src="/logo.png" alt="MMC LAB" width={100} height={32} className="object-contain dark:brightness-200 dark:grayscale" />
                <div className="w-9 h-9 flex items-center justify-center">
                    <ThemeToggle />
                </div>
            </div>

            {/* Overlay mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                ${isCollapsed ? "w-20" : "w-72 lg:w-64"}
                bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
                flex flex-col shadow-sm transition-all duration-300 relative
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>

                {/* Botão de ocultar/abrir na borda - TOPO */}
                <button
                    onClick={() => handleSetIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all z-50 group"
                    title={isCollapsed ? "Expandir Menu" : "Ocultar Menu"}
                >
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                        {isCollapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>

                {/* Botão de ocultar/abrir na borda - MEIO */}
                <button
                    onClick={() => handleSetIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all z-50 group"
                    title={isCollapsed ? "Expandir Menu" : "Ocultar Menu"}
                >
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                        {isCollapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>

                {/* Botão de ocultar/abrir na borda - FINAL */}
                <button
                    onClick={() => handleSetIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 bottom-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all z-50 group"
                    title={isCollapsed ? "Expandir Menu" : "Ocultar Menu"}
                >
                    <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                        {isCollapsed ? "chevron_right" : "chevron_left"}
                    </span>
                </button>

                <div className={`h-20 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-6"} border-b border-slate-100 dark:border-slate-800 shrink-0 overflow-hidden`}>
                    {isCollapsed ? (
                        <div className="flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="MMC LAB"
                                width={60}
                                height={30}
                                className="object-contain dark:brightness-200 dark:grayscale"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="MMC LAB"
                                width={140}
                                height={45}
                                className="object-contain dark:brightness-200 dark:grayscale transition-all"
                                priority
                            />
                        </div>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {navGroups.map((group, groupIdx) => {
                        const visibleItems = group.items.filter(item => {
                            // DESENVOLVEDOR vê tudo
                            if (userRoles.includes("DESENVOLVEDOR")) return true;
                            // Filtra exclusivamente pelo sistema de permissões
                            // @ts-ignore
                            if (item.permissionId && !userPermissions.includes(item.permissionId)) return false;
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

                                            // @ts-ignore
                                            const activeSubItemHref = hasSubItems ? item.subItems.map((s: any) => s.href).filter((h: string) => h && (pathname === h || pathname.startsWith(`${h}/`))).sort((a: string, b: string) => b.length - a.length)[0] : null;

                                            const isActive = item.href
                                                ? (item.href === "/sgq" ? pathname === "/sgq" : (pathname === item.href || pathname.startsWith(`${item.href}/`)))
                                                : !!activeSubItemHref;

                                            const isExpanded = expandedMenus.includes(item.label);

                                            const content = (
                                                <>
                                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                                                        {item.icon}
                                                    </span>
                                                    {!isCollapsed && (
                                                        <span className="flex-1 text-left whitespace-nowrap truncate" title={item.label}>{item.label}</span>
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
                                                                if (isCollapsed) handleSetIsCollapsed(false);
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
                                                            {item.subItems.filter((sub: any) => {
                                                                if (userRoles.includes("DESENVOLVEDOR")) return true;
                                                                if (sub.permissionId && !userPermissions.includes(sub.permissionId)) return false;
                                                                return true;
                                                            }).map((subItem: any, subIdx: number) => {
                                                                const isSubActive = subItem.href === activeSubItemHref;
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

                <div className={`p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-tr-3xl shrink-0 transition-colors duration-300 ${isCollapsed ? 'flex flex-col items-center gap-3' : ''}`}>
                    <div className={`flex ${isCollapsed ? 'flex-col justify-center items-center gap-3' : 'items-center justify-between gap-1'} w-full`}>
                        <div className={`flex items-center gap-2 overflow-hidden ${isCollapsed ? 'justify-center w-full' : 'flex-1'}`}>
                            {userAvatar ? (
                                <img src={userAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700" />
                            ) : (
                                <span className="material-symbols-outlined text-[32px] text-slate-400 dark:text-slate-500 shrink-0">account_circle</span>
                            )}
                            {!isCollapsed && (
                                <div className="overflow-hidden flex flex-col justify-center flex-1">
                                    <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">{session?.user?.name}</p>
                                    <p className="text-[10px] text-primary font-bold tracking-wide uppercase truncate leading-tight">{session?.user?.role}</p>
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex items-center gap-0.5 shrink-0">
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                    title="Alterar Senha"
                                >
                                    <span className="material-symbols-outlined text-[18px]">key</span>
                                </button>
                                <div className="w-7 h-7 flex items-center justify-center scale-90">
                                    <ThemeToggle />
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                                    title="Sair do Sistema"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {isCollapsed && (
                        <>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-500 rounded-xl transition-colors"
                                title="Alterar Senha"
                            >
                                <span className="material-symbols-outlined text-[18px]">key</span>
                            </button>
                            <div className="w-8 h-8 flex items-center justify-center scale-90">
                                <ThemeToggle />
                            </div>
                            <button
                                onClick={handleSignOut}
                                title="Sair do Sistema"
                                className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                            </button>
                        </>
                    )}

                    {!isCollapsed && (
                        <div className="flex justify-center mt-2.5">
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">v1.9.5 • Atualizado: {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:ml-0">
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 mt-14 lg:mt-0">
                    <div className="max-w-full mx-auto flex flex-col gap-4">

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

