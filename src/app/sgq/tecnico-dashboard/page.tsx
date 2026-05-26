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
        refreshInterval: 5000, // Voltando para o padrão de 5 segundos
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
        '06': { label: 'Cobrança', statusDesc: 'Envio de fatura', icon: 'payments', href: '/sgq/admin/receber/cobrancas', permission: 'tecnico_cobrancas', statusKey: 'COBRANCA', color: 'teal', responsible: 'Setor Técnico' },
        '07': { label: 'Pagamento', statusDesc: 'Confirmação de recebimento', icon: 'account_balance_wallet', href: '/sgq/admin/receber/recebimentos', permission: 'tecnico_recebimentos', statusKey: 'PAGAMENTO', color: 'indigo', responsible: 'Setor Técnico' },
        '08': { label: 'Pesquisa de Satisfação', statusDesc: 'Aguardando feedback', icon: 'sentiment_satisfied', href: '/sgq/pesquisa-satisfacao', permission: 'tecnico_pesquisa_satisfacao', statusKey: 'PESQUISA_PENDENTE', color: 'pink', responsible: 'Qualidade' },
        '09': { label: 'Processo Finalizado', statusDesc: 'Concluído', icon: 'verified', href: '/sgq/historico-processos', permission: 'tecnico_dashboard', statusKey: 'FINALIZADO', color: 'emerald', responsible: 'Sistema' },
    }

    const getCountByStep = (stepId: string) => {
        if (!counts) return 0
        switch (stepId) {
            case '01': return counts.propostas
            case '02': return counts.agendamento
            case '03': return counts.execucao
            case '04': return counts.elaboracao
            case '05': return counts.envioRelatorio
            case '06': return counts.cobranca
            case '07': return counts.pagamento
            case '08': return counts.pesquisa
            case '09': return counts.finalizado
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
        <div className="p-4 sm:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Painel Técnico SGQ</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">Acompanhamento de fluxo linear</p>
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

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-4 text-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isValidating ? 'animate-ping' : ''}`}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">Fluxo Online</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="font-medium text-slate-500 dark:text-slate-400">{format(new Date(), "dd 'de' MMMM, yyyy")}</div>
                    </div>
                </div>
            </div>

            {/* Lista de Etapas (Layout de Grade) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-12">
                {Object.keys(STEP_CONFIG).sort((a, b) => Number(a) - Number(b)).map((id, index) => {
                    const config = STEP_CONFIG[id]
                    const count = getCountByStep(id)
                    const permitted = hasPermission(config.permission)
                    
                    if (permitted) {
                        return (
                            <Link 
                                key={id}
                                href={config.href}
                                className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-${config.color}-500/30 dark:hover:border-${config.color}-500/30 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${count > 0 ? `border-t-4 border-t-${config.color}-500` : ''}`}
                            >
                                {/* Status Header */}
                                <div className="flex justify-between items-start mb-5 relative z-10">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-${config.color}-100 dark:bg-${config.color}-500/10 text-${config.color}-700 dark:text-${config.color}-400 border-${config.color}-200 dark:border-${config.color}-500/30`}>
                                        <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
                                        {config.statusDesc}
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">
                                        Passo {id}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 mb-6 relative z-10">
                                    <h3 className={`text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-${config.color}-600 dark:group-hover:text-${config.color}-400 transition-colors`}>
                                        {config.label}
                                    </h3>
                                    
                                    <div className="flex flex-col gap-1 mt-3">
                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Responsabilidade</span>
                                        <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300">{config.responsible}</span>
                                    </div>
                                </div>

                                {/* Actions / Pendentes */}
                                <div className="flex justify-between items-end relative z-10 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Pendentes</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-2xl font-black ${count > 0 ? `text-${config.color}-600 dark:text-${config.color}-400` : 'text-slate-300 dark:text-slate-600'}`}>
                                                {isLoading ? '--' : count.toString().padStart(2, '0')}
                                            </span>
                                            {count > 0 && (
                                                <span className="flex h-2 w-2 relative">
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${config.color}-400 opacity-75`}></span>
                                                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-${config.color}-500`}></span>
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
                                className="group relative bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/70 dark:border-slate-800/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 opacity-60 cursor-not-allowed select-none flex flex-col h-full"
                            >
                                {/* Status Header */}
                                <div className="flex justify-between items-start mb-5 relative z-10">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700`}>
                                        <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
                                        Acesso Restrito
                                    </div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-800/30 px-2.5 py-1 rounded-lg">
                                        Passo {id}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 mb-6 relative z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-400 dark:text-slate-500 leading-tight">
                                            {config.label}
                                        </h3>
                                        <span className="material-symbols-outlined text-sm text-slate-400">lock</span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1 mt-3">
                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Responsabilidade</span>
                                        <span className="text-[12px] font-bold text-slate-400 dark:text-slate-600">{config.responsible}</span>
                                    </div>
                                </div>

                                {/* Actions / Pendentes */}
                                <div className="flex justify-between items-end relative z-10 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1">Pendentes</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                                                {isLoading ? '--' : count.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

            {/* Resumo e Suporte */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 dark:bg-blue-900/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">dashboard_customize</span>
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900 dark:text-slate-100 text-xl tracking-tight transition-colors">Visão Consolidada</h2>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium transition-colors">Métricas chave do fluxo produtivo</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {[
                                { label: 'Novos Orçamentos', value: counts?.orcamentos, color: 'blue' },
                                { label: 'Ensaios em Execução', value: counts?.execucao, color: 'purple' },
                                { label: 'Aguardando Pagamento', value: counts?.pagamento, color: 'amber' },
                                { label: 'Processos Finalizados', value: counts?.finalizado, color: 'emerald', bold: true }
                            ].map((stat, i) => (
                                <div key={i} className={`p-5 rounded-3xl border border-slate-50 dark:border-slate-800/50 transition-colors ${stat.bold ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'bg-slate-50/50 dark:bg-slate-800/30'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-2 transition-colors ${stat.bold ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {stat.label}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black tracking-tighter transition-colors ${isLoading && !counts ? 'animate-pulse bg-slate-200 dark:bg-slate-800 text-transparent rounded-lg' : stat.bold ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-100'}`}>
                                            {isLoading && !counts ? '00' : (stat.value || 0).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-white text-3xl">hub</span>
                        </div>
                        <h3 className="font-black text-2xl mb-3 tracking-tight">Suporte Técnico</h3>
                        <p className="text-slate-400 text-sm mb-auto leading-relaxed">
                            Encontrou alguma inconsistência ou precisa de auxílio no fluxo? Nossa equipe está pronta para ajudar.
                        </p>
                        <button className="mt-8 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-2">
                            Acessar Central de Ajuda
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
