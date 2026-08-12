"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TecnicoDashboardPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    // Usar SWR para gerenciamento de estado e cache automático
    const { data, error, isLoading, isValidating, mutate } = useSWR('/api/dashboard/stats', fetcher, {
        refreshInterval: 5000,
        revalidateOnFocus: true,
        revalidateIfStale: true,
        dedupingInterval: 2000,
        onSuccess: () => setLastUpdated(new Date())
    })

    const counts = data?.counts
    const userPermissions = data?.permissions || []

    const STEP_CONFIG: Record<string, { 
        label: string; 
        statusDesc: string;
        icon: string; 
        href: string; 
        permission: string; 
        statusKey: string;
        color: string;
        responsible: string;
    }> = {
        '01': { label: 'Envio da Proposta', statusDesc: 'Aguardando aceite', icon: 'send_money', href: '/sgq/envio-proposta', permission: 'tecnico_envio_proposta', statusKey: 'AGUARDANDO_ACEITE', color: 'orange', responsible: 'Assistente Administrativo' },
        '02': { label: 'Agendamento', statusDesc: 'Aguardando agendamento', icon: 'calendar_month', href: '/sgq/aguardando-agendamento', permission: 'tecnico_aguardando_agendamento', statusKey: 'AGUARDANDO_AGENDAMENTO', color: 'amber', responsible: 'Assistente Administrativo' },
        '03': { label: 'Execução do Ensaio', statusDesc: 'Trabalho no laboratório', icon: 'science', href: '/sgq/execucao-ensaios', permission: 'tecnico_execucao_ensaios', statusKey: 'EM_EXECUCAO', color: 'purple', responsible: 'Equipe Técnica' },
        '04': { label: 'Elaboração do Relatório', statusDesc: 'Redigindo documento', icon: 'edit_note', href: '/sgq/elaboracao-relatorio', permission: 'tecnico_elaboracao_relatorio', statusKey: 'ELABORANDO_RELATORIO', color: 'orange', responsible: 'Equipe Técnica/Responsável' },
        '05': { label: 'Aprovação de Relatório', statusDesc: 'Aprovação pendente', icon: 'task', href: '/sgq/aprovacao', permission: 'tecnico_aprovacao', statusKey: 'AGUARDANDO_APROVACAO', color: 'red', responsible: 'Responsável Técnico' },
        '06': { label: 'Faturamento', statusDesc: 'Emissão & Baixa de NF', icon: 'payments', href: '/sgq/faturamento', permission: 'tecnico_cobrancas', statusKey: 'FATURAMENTO', color: 'teal', responsible: 'Financeiro/Setor Técnico' },
        '07': { label: 'Pesquisa de Satisfação', statusDesc: 'Aguardando feedback', icon: 'sentiment_satisfied', href: '/sgq/pesquisa-satisfacao', permission: 'tecnico_pesquisa_satisfacao', statusKey: 'PESQUISA_PENDENTE', color: 'pink', responsible: 'Qualidade' },
        '08': { label: 'Processo Finalizado', statusDesc: 'Concluído', icon: 'verified', href: '/sgq/historico-processos', permission: 'tecnico_historico_processos', statusKey: 'FINALIZADO', color: 'emerald', responsible: 'Sistema' },
    }

    const getCountByStep = (stepId: string) => {
        if (!counts) return 0
        switch (stepId) {
            case '01': return counts.propostas
            case '02': return counts.agendamento
            case '03': return counts.execucao
            case '04': return counts.elaboracao
            case '05': return counts.envioRelatorio
            case '06': return counts.faturamento ?? ((counts.cobranca || 0) + (counts.pagamento || 0))
            case '07': return counts.pesquisa
            case '08': return counts.finalizado
            default: return 0
        }
    }

    const userRole = session?.user?.role || ""
    const userRoles = userRole.split(',').map((r: string) => r.trim()).filter(Boolean)

    const hasPermission = (permission: string) => {
        if (!data && isLoading) return false
        if (userRoles.includes("DESENVOLVEDOR")) return true
        return userPermissions.includes(permission)
    }

    return (
        <div className="w-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Painel Técnico SGQ</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Acompanhamento do fluxo produtivo linear</p>
                        {lastUpdated && (
                            <>
                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                                        Atualizado às {format(lastUpdated, "HH:mm:ss")}
                                    </p>
                                    <button 
                                        onClick={() => mutate()}
                                        disabled={isValidating}
                                        className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isValidating ? 'animate-spin text-blue-500' : 'text-slate-300 dark:text-slate-600'}`}
                                        title="Atualizar agora"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 text-sm bg-white dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isValidating ? 'animate-ping' : ''}`}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Fluxo Online</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="font-medium text-slate-500 dark:text-slate-400 text-xs">{format(new Date(), "dd 'de' MMMM, yyyy")}</div>
                    </div>
                </div>
            </div>

            {/* Lista de Etapas (Layout Ampliado e Bem Distribuído em 8 Passos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                {Object.keys(STEP_CONFIG).sort((a, b) => Number(a) - Number(b)).map((id) => {
                    const config = STEP_CONFIG[id]
                    const count = getCountByStep(id)
                    const permitted = hasPermission(config.permission)
                    
                    if (permitted) {
                        return (
                            <Link 
                                key={id}
                                href={config.href}
                                className={`group bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[140px] ${count > 0 ? `border-t-4 border-t-${config.color}-500` : ''}`}
                            >
                                {/* Topo: Badge de Status (Esquerda) e Passo (Direita) */}
                                <div className="flex justify-between items-center mb-4 relative z-10">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-${config.color}-100 dark:bg-${config.color}-500/10 text-${config.color}-700 dark:text-${config.color}-400 border-${config.color}-200 dark:border-${config.color}-500/30`}>
                                        <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
                                        {config.statusDesc}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-xl">
                                        Passo {id}
                                    </div>
                                </div>

                                {/* Conteúdo: Título/Responsável (Esquerda) e Contador de Pendentes (Direita) */}
                                <div className="flex justify-between items-end gap-4 relative z-10">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h3 className={`text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-${config.color}-600 dark:group-hover:text-${config.color}-400 transition-colors truncate`}>
                                            {config.label}
                                        </h3>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Responsabilidade</span>
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{config.responsible}</span>
                                        </div>
                                    </div>

                                    {/* Contador de Pendentes alinhado à direita abaixo do Passo */}
                                    <div className="flex flex-col items-end shrink-0 pl-2">
                                        <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Pendentes</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-3xl font-black tracking-tight ${count > 0 ? `text-${config.color}-600 dark:text-${config.color}-400` : 'text-slate-300 dark:text-slate-600'}`}>
                                                {isLoading ? '--' : count.toString().padStart(2, '0')}
                                            </span>
                                            {count > 0 && (
                                                <span className="flex h-2.5 w-2.5 relative">
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${config.color}-400 opacity-75`}></span>
                                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 bg-${config.color}-500`}></span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    } else {
                        return (
                            <div 
                                key={id}
                                title="Acesso restrito ao responsável por esta etapa"
                                className="group relative bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 lg:p-6 opacity-60 cursor-not-allowed select-none flex flex-col justify-between min-h-[140px]"
                            >
                                {/* Topo: Badge de Status (Esquerda) e Passo (Direita) */}
                                <div className="flex justify-between items-center mb-4 relative z-10">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
                                        Acesso Restrito
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 dark:text-slate-600 bg-slate-100/80 dark:bg-slate-800/40 px-3 py-1 rounded-xl">
                                        Passo {id}
                                    </div>
                                </div>

                                {/* Conteúdo: Título/Responsável (Esquerda) e Contador de Pendentes (Direita) */}
                                <div className="flex justify-between items-end gap-4 relative z-10">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 leading-tight truncate">
                                                {config.label}
                                            </h3>
                                            <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">lock</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Responsabilidade</span>
                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-600 truncate">{config.responsible}</span>
                                        </div>
                                    </div>

                                    {/* Contador de Pendentes alinhado à direita abaixo do Passo */}
                                    <div className="flex flex-col items-end shrink-0 pl-2">
                                        <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-0.5">Pendentes</span>
                                        <span className="text-3xl font-black tracking-tight text-slate-300 dark:text-slate-700">
                                            {isLoading ? '--' : count.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}
