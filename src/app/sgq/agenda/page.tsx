"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

export default function AgendaPage() {
    const { data: session } = useSession()
    const [viewMode, setViewMode] = useState<"WEEK" | "MONTH" | "AGENDA">("WEEK")

    if (!session?.user) return null

    // O Google Agenda permite embed usando o email do usuário na variável 'src'.
    // Se o usuário já estiver logado no Google no navegador dele e esse email for
    // correspondente a uma conta Google com agenda (Google Workspace ou Gmail), 
    // ele irá mostrar a agenda privada ou pedir para logar se for o caso.
    const userEmail = session.user.email
    const googleCalendarIframeUrl = `https://calendar.google.com/calendar/embed?src=${userEmail}&mode=${viewMode}&color=%23039BE5&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=0`

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-500 text-3xl">calendar_month</span>
                        Minha Agenda
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Visualize e acesse seus compromissos diretamente do Google Agenda ({userEmail}).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button
                            onClick={() => setViewMode("WEEK")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "WEEK" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setViewMode("MONTH")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "MONTH" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            Mês
                        </button>
                        <button
                            onClick={() => setViewMode("AGENDA")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "AGENDA" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            Lista
                        </button>
                    </div>

                    <a
                        href="https://calendar.google.com/calendar/r"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        Abrir Externo
                    </a>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col relative" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-800/50 -z-10">
                    <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600 mb-4 animate-pulse">pending</span>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Carregando sua Agenda...</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                        Pode ser necessário realizar login na sua conta Google caso ainda não esteja conectado neste navegador.
                    </p>
                </div>
                <iframe
                    src={googleCalendarIframeUrl}
                    style={{ border: 0 }}
                    width="100%"
                    height="100%"
                    className="flex-1 bg-transparent z-10"
                    title="Google Calendar"
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    )
}
