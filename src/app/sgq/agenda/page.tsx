"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Calendar, Loader2, Link as LinkIcon, RefreshCw, AlertTriangle } from "lucide-react"

// Importação dinâmica do visualizador da agenda para evitar problemas de SSR com o FullCalendar
const GoogleCalendarView = dynamic(
    () => import("@/components/GoogleCalendarView"),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
                <Loader2 className="animate-spin mb-4 text-blue-500" size={36} />
                <p className="text-sm font-bold">Carregando calendário interativo...</p>
            </div>
        )
    }
)

function AgendaPageContent() {
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const [checkingStatus, setCheckingStatus] = useState(true)
    const [isConnected, setIsConnected] = useState(false)
    const [googleEmail, setGoogleEmail] = useState("")
    const [disconnecting, setDisconnecting] = useState(false)

    // Verifica o status de conexão da agenda do Google
    const checkConnectionStatus = async () => {
        setCheckingStatus(true)
        try {
            const res = await fetch('/api/calendar/status')
            if (res.ok) {
                const data = await res.json()
                setIsConnected(data.connected)
                setGoogleEmail(data.email || "")
            } else {
                setIsConnected(false)
            }
        } catch (error) {
            console.error("Erro ao verificar status da conexão:", error)
            setIsConnected(false)
        } finally {
            setCheckingStatus(false)
        }
    }

    useEffect(() => {
        if (session?.user) {
            checkConnectionStatus()
        }
    }, [session])

    // Verifica parâmetros de URL para alertas de callback
    useEffect(() => {
        const success = searchParams.get('success')
        const error = searchParams.get('error')

        if (success === 'connected') {
            toast.success("Google Agenda conectado com sucesso!")
            // Limpa os parâmetros da URL
            router.replace('/sgq/agenda')
            checkConnectionStatus()
        } else if (error) {
            if (error === 'google_auth_denied') {
                toast.error("O acesso ao Google Agenda foi recusado.")
            } else {
                toast.error(`Erro ao conectar: ${decodeURIComponent(error)}`)
            }
            router.replace('/sgq/agenda')
        }
    }, [searchParams])

    // Desconecta a agenda do Google
    const handleDisconnect = async () => {
        if (!confirm("Tem certeza que deseja desconectar seu Google Agenda? Todos os dados continuarão no Google, mas não serão mais visíveis ou gerenciados pelo sistema.")) {
            return
        }

        setDisconnecting(true)
        try {
            const res = await fetch('/api/calendar/disconnect', { method: 'POST' })
            if (res.ok) {
                setIsConnected(false)
                setGoogleEmail("")
                toast.success("Google Agenda desconectado do sistema.")
            } else {
                const err = await res.json()
                throw new Error(err.error || 'Erro ao desconectar')
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao desconectar agenda.")
        } finally {
            setDisconnecting(false)
        }
    }

    if (!session?.user) return null

    if (checkingStatus) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
                <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
                <p className="text-sm font-bold">Verificando sincronização da agenda...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            
            {/* Header da Página */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-500 text-3xl">calendar_month</span>
                        Minha Agenda
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {isConnected 
                            ? `Gerencie seus compromissos integrados em tempo real com o Google Agenda (${googleEmail}).`
                            : "Sincronize o sistema com sua conta do Google para liberar todas as funções de agenda por completo."
                        }
                    </p>
                </div>
            </div>

            {/* Conteúdo Principal */}
            {isConnected ? (
                <GoogleCalendarView 
                    userEmail={googleEmail} 
                    onDisconnect={handleDisconnect} 
                />
            ) : (
                <div className="max-w-2xl mx-auto my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Calendar size={32} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                        Conecte seu Google Agenda
                    </h2>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                        Ao conectar sua conta, você poderá visualizar, criar, editar e excluir eventos diretamente de dentro do sistema em tempo real. Compatível com todas as suas agendas personalizadas e compartilhadas.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/api/calendar/auth"
                            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all text-sm"
                        >
                            <LinkIcon size={18} />
                            Conectar Conta Google
                        </a>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <span>Requer permissão de leitura e escrita para sincronização de eventos.</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function AgendaPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
                <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
                <p className="text-sm font-bold">Carregando agenda...</p>
            </div>
        }>
            <AgendaPageContent />
        </Suspense>
    )
}
