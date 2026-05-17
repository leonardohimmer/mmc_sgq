"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function DashboardPage() {
    const { data: session } = useSession()

    const userRole = session?.user?.role || ""
    const userRoles = userRole.split(",").map(r => r.trim())
    const isTech = userRoles.includes("TÉCNICO DE LABORATÓRIO") || userRoles.includes("RESPONSÁVEL TÉCNICO")

    const [equipments, setEquipments] = useState<any[]>([])
    const [loadingEq, setLoadingEq] = useState(true)

    useEffect(() => {
        fetch("/api/equipamentos")
            .then(res => res.json())
            .then(data => setEquipments(data))
            .catch(console.error)
            .finally(() => setLoadingEq(false))
    }, [])

    const expiredCount = equipments.filter((eq: any) => {
        if (!eq.nextCalibrationDate) return false
        const nextDate = new Date(eq.nextCalibrationDate)
        const today = new Date()
        const diffTime = nextDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 30
    }).length

    if (isTech) {
        return (
            <div className="space-y-8 font-sans transition-colors duration-300">
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">

                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 transition-colors">Painel de controle Técnico</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Olá, {session?.user?.name || "Técnico"}. Resumo das suas atividades laboratoriais.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">menu_book</span> Consultar Norma
                        </button>
                        <Link href="/sgq/meus-ensaios" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 dark:shadow-none hover:-translate-y-0.5 transition-all">
                            <span className="material-symbols-outlined text-[20px]">science</span> Acessar Ensaios
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Ensaios Pendentes"
                        value="05"
                        icon="pending_actions"
                        iconColor="text-amber-500 dark:text-amber-400"
                        iconBg="bg-amber-50 dark:bg-amber-500/10"
                        trend="2 Alta prioridade"
                        trendIcon="priority_high"
                        trendColor="text-red-500 dark:text-red-400"
                    />
                    <StatCard
                        title="Em Execução"
                        value="02"
                        icon="autorenew"
                        iconColor="text-blue-500 dark:text-blue-400"
                        iconBg="bg-blue-50 dark:bg-blue-500/10"
                        trend="No prazo"
                        trendIcon="check_circle"
                        trendColor="text-emerald-500 dark:text-emerald-400"
                    />
                    <StatCard
                        title="Finalizados"
                        value="42"
                        icon="inventory"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        iconBg="bg-emerald-100 dark:bg-emerald-500/10"
                        trend="+12 este mês"
                        trendIcon="trending_up"
                        trendColor="text-emerald-500 dark:text-emerald-400"
                    />
                    <StatCard
                        title="Alertas / Atrasos"
                        value={expiredCount.toString().padStart(2, '0')}
                        icon="notification_important"
                        iconColor="text-red-600 dark:text-red-400"
                        iconBg="bg-red-100 dark:bg-red-500/10"
                        trend={expiredCount > 0 ? "Revisão Necessária" : "Tudo em dia"}
                        trendIcon={expiredCount > 0 ? "warning" : "check_circle"}
                        trendColor={expiredCount > 0 ? "text-red-500" : "text-emerald-500"}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-colors duration-300">
                        <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Ensaios em Destaque
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center rounded-lg">
                                        <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm mb-0.5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Resistência à Compressão</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lote #4992 - Construtora B</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    Pendente
                                </span>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-lg">
                                        <span className="material-symbols-outlined text-[20px]">autorenew</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm mb-0.5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Medição Acústica (NBR 15575)</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Edifício Horizonte - Apto 302</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    Em Execução
                                </span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                            Ver todos os ensaios
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-colors duration-300">
                        <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                            Avisos e Pendências
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                                <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 shrink-0">hourglass_top</span>
                                <div>
                                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Aprovação de Relatório Pendente</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">O relatório do ensaio #REQ-992 precisa da sua assinatura técnica para ser liberado ao cliente. (2 aguardando aprovação)</p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 dark:text-red-400 shrink-0">build_circle</span>
                                <div>
                                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Calibração Próxima</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Atenção, o Paquímetro Digital (EQP-012) vence a calibração em 5 dias.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 font-sans transition-colors duration-300">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 transition-colors">Visão Geral do Painel de controle</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Bem-vindo de volta, {session?.user?.name || "Usuário"}. Visão geral do Sistema de Gestão da Qualidade MML LAB.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">file_download</span> Exportar
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 dark:shadow-none hover:opacity-90 transition-all">
                        <span className="material-symbols-outlined text-[20px]">add</span> Novo Registro
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Documentos Ativos"
                    value="142"
                    icon="description"
                    iconColor="text-indigo-500 dark:text-indigo-400"
                    iconBg="bg-indigo-50 dark:bg-indigo-500/10"
                    trend="+5 neste mês"
                    trendIcon="trending_up"
                    trendColor="text-emerald-500 dark:text-emerald-400"
                />
                <StatCard
                    title="Não Conformidades"
                    value="03"
                    icon="report_problem"
                    iconColor="text-red-500 dark:text-red-400"
                    iconBg="bg-red-50 dark:bg-red-500/10"
                    trend="-2 este mês"
                    trendIcon="trending_down"
                    trendColor="text-emerald-500 dark:text-emerald-400"
                />
                <StatCard
                    title="Auditorias Previstas"
                    value="02"
                    icon="security"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    iconBg="bg-emerald-100 dark:bg-emerald-500/10"
                    trend="Próxima em 15 dias"
                    trendIcon="calendar_month"
                    trendColor="text-slate-500 dark:text-slate-400"
                />
                <StatCard
                    title="Usuários Ativos"
                    value="24"
                    icon="group"
                    iconColor="text-secondary dark:text-amber-200"
                    iconBg="bg-secondary/10 dark:bg-amber-200/10"
                    trend="Estável"
                    trendIcon="horizontal_rule"
                    trendColor="text-slate-500 dark:text-slate-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-colors duration-300">
                    <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Atividades Recentes
                    </h2>
                    <div className="space-y-6">
                        <ActivityItem
                            action="Novo POP Aprovado"
                            document="SGQ.POP.042 - Controle de Acesso"
                            user="João Silva (Admin)"
                            time="Há 2 horas"
                            dotColor="bg-primary"
                        />
                        <ActivityItem
                            action="Revisão Solicitada"
                            document="SGQ.FORM.012 - Relatório de Falhas"
                            user="Maria Souza (Auditor)"
                            time="Há 5 horas"
                            dotColor="bg-amber-500 dark:bg-amber-400"
                        />
                        <ActivityItem
                            action="Documento Arquivado"
                            document="SGQ.MAN.001 v2.0"
                            user="Sistema"
                            time="Ontem"
                            dotColor="bg-slate-300 dark:bg-slate-600"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-colors duration-300">
                    <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                        Gestão de Equipamentos
                    </h2>
                    <EquipmentAlerts data={equipments} loading={loadingEq} />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 transition-colors duration-300">
                    <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Atenção Requerida (Ações)
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer group">
                            <div>
                                <p className="font-bold text-sm mb-1 text-slate-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-primary transition-colors">Assinatura Pendente</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Política de Qualidade 2024</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                Alta Prioridade
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EquipmentAlerts({ data, loading }: { data: any[], loading: boolean }) {
    const alerts = data.filter((eq: any) => {
        if (eq.status === 'DANIFICADO') return false
        if (!eq.nextCalibrationDate) return false
        const nextDate = new Date(eq.nextCalibrationDate)
        const today = new Date()
        const diffTime = nextDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 30
    })

    if (loading) return <div className="animate-pulse space-y-3"><div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl"></div></div>

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">check_circle</span>
                <p className="text-xs font-bold uppercase tracking-widest">Tudo em dia</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {alerts.slice(0, 3).map((eq: any) => {
                const nextDate = new Date(eq.nextCalibrationDate);
                const today = new Date();
                const diffTime = nextDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const isExpired = diffDays <= 0;

                return (
                    <div key={eq.id} className={`p-4 rounded-xl border flex items-start gap-3 ${isExpired ? 'bg-rose-50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20' : 'bg-amber-50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/20'}`}>
                        <span className={`material-symbols-outlined shrink-0 ${isExpired ? 'text-rose-500' : 'text-amber-500'}`}>
                            {isExpired ? 'error' : 'warning'}
                        </span>
                        <div>
                            <p className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-0.5">{eq.code} - {eq.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-tight">{eq.testType || "Ensaio N/D"}</p>
                            <p className={`text-[10px] font-black uppercase tracking-tight ${isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {isExpired ? `VENCIDO HÁ ${Math.abs(diffDays)} DIAS` : `VENCE EM ${diffDays} DIAS`}
                            </p>
                        </div>
                    </div>
                )
            })}
            {alerts.length > 3 && (
                <Link href="/sgq/equipamentos" className="block text-center text-[10px] font-black text-primary uppercase tracking-widest hover:underline pt-2">
                    Ver mais {alerts.length - 3} alertas
                </Link>
            )}
        </div>
    )
}


function StatCard({ title, value, icon, iconColor, iconBg, trend, trendIcon, trendColor }: { title: string, value: string, icon: string, iconColor: string, iconBg: string, trend: string, trendIcon: string, trendColor: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-colors duration-300">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-1 transition-colors">{title}</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 transition-colors">{value}</h3>
                    <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendColor} transition-colors`}>
                        <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>
                        <span>{trend}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl transition-colors ${iconBg} ${iconColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
            <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 h-10 -mx-6 flex items-center px-6 text-xs text-primary font-bold cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 transition-all">
                Ver detalhes <span className="material-symbols-outlined text-[16px] ml-auto">arrow_forward</span>
            </div>
        </div>
    )
}

function ActivityItem({ action, document, user, time, dotColor }: { action: string, document: string, user: string, time: string, dotColor: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-2 ring-4 ring-white dark:ring-slate-900 transition-colors`}></div>
                <div className="w-px h-full bg-slate-100 dark:bg-slate-800 my-1 group-last:bg-transparent transition-colors"></div>
            </div>
            <div className="pb-4">
                <p className="font-bold text-sm mb-1 text-slate-700 dark:text-slate-200 transition-colors">{action}</p>
                <p className="text-sm font-bold text-primary mb-1 cursor-pointer hover:underline transition-colors">{document}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
                    <span className="material-symbols-outlined text-[14px]">account_circle</span>
                    <span>{user}</span>
                    <span>•</span>
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>{time}</span>
                </div>
            </div>
        </div>
    )
}
