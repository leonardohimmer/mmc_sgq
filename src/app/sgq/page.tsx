"use client"

import { useSession } from "next-auth/react"

export default function DashboardPage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Visão Geral do Painel</h1>
                    <p className="text-slate-500 text-sm font-medium">Bem-vindo de volta, {session?.user?.name || "Usuário"}. Visão geral do Sistema de Gestão da Qualidade MML LAB.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">file_download</span> Exportar
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-[20px]">add</span> Novo Registro
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Documentos Ativos"
                    value="142"
                    icon="description"
                    iconColor="text-indigo-500"
                    iconBg="bg-indigo-50"
                    trend="+5 neste mês"
                    trendIcon="trending_up"
                    trendColor="text-emerald-500"
                />
                <StatCard
                    title="Não Conformidades"
                    value="03"
                    icon="report_problem"
                    iconColor="text-red-500"
                    iconBg="bg-red-50"
                    trend="-2 este mês"
                    trendIcon="trending_down"
                    trendColor="text-emerald-500"
                />
                <StatCard
                    title="Auditorias Previstas"
                    value="02"
                    icon="security"
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-100"
                    trend="Próxima em 15 dias"
                    trendIcon="calendar_month"
                    trendColor="text-slate-500"
                />
                <StatCard
                    title="Usuários Ativos"
                    value="24"
                    icon="group"
                    iconColor="text-secondary"
                    iconBg="bg-secondary/10"
                    trend="Estável"
                    trendIcon="horizontal_rule"
                    trendColor="text-slate-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900">
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
                            dotColor="bg-amber-500"
                        />
                        <ActivityItem
                            action="Documento Arquivado"
                            document="SGQ.MAN.001 v2.0"
                            user="Sistema"
                            time="Ontem"
                            dotColor="bg-slate-300"
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-slate-900">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Atenção Requerida (Ações)
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer group">
                            <div>
                                <p className="font-bold text-sm mb-1 text-slate-700 group-hover:text-primary transition-colors">Assinatura Pendente</p>
                                <p className="text-xs text-slate-500 font-medium">Política de Qualidade 2024</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                Alta Prioridade
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, iconColor, iconBg, trend, trendIcon, trendColor }: { title: string, value: string, icon: string, iconColor: string, iconBg: string, trend: string, trendIcon: string, trendColor: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
                    <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendColor}`}>
                        <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>
                        <span>{trend}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
            <div className="mt-4 bg-slate-50 h-10 -mx-6 flex items-center px-6 text-xs text-primary font-bold cursor-pointer hover:bg-primary/10 transition-all">
                Ver detalhes <span className="material-symbols-outlined text-[16px] ml-auto">arrow_forward</span>
            </div>
        </div>
    )
}

function ActivityItem({ action, document, user, time, dotColor }: { action: string, document: string, user: string, time: string, dotColor: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-2 ring-4 ring-white`}></div>
                <div className="w-px h-full bg-slate-100 my-1 group-last:bg-transparent"></div>
            </div>
            <div className="pb-4">
                <p className="font-bold text-sm mb-1 text-slate-700">{action}</p>
                <p className="text-sm font-bold text-primary mb-1 cursor-pointer hover:underline">{document}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
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
