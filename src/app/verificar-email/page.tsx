"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

function VerificarEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [status, setStatus] = useState<"loading" | "success" | "expired" | "error">("loading")
    const [message, setMessage] = useState("Validando seu link de confirmação...")
    const [resendEmail, setResendEmail] = useState("")
    const [isResending, setIsResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Nenhum token de verificação foi fornecido. Verifique o link acessado.")
            return
        }

        const verify = async () => {
            try {
                const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
                const data = await res.json()

                if (res.ok && data.success) {
                    setStatus("success")
                    setMessage(data.message || "E-mail confirmado com sucesso!")
                    toast.success("E-mail confirmado com sucesso!")
                } else {
                    if (data.expired) {
                        setStatus("expired")
                        setMessage(data.error || "Este link expirou.")
                        if (data.email) setResendEmail(data.email)
                    } else {
                        setStatus("error")
                        setMessage(data.error || "Não foi possível validar este link.")
                    }
                }
            } catch (err) {
                setStatus("error")
                setMessage("Erro de conexão ao validar o e-mail. Tente novamente mais tarde.")
            }
        }

        verify()
    }, [token])

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!resendEmail) return
        setIsResending(true)

        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resendEmail })
            })

            const data = await res.json()
            if (res.ok && data.success) {
                setResendSuccess(true)
                toast.success("Novo link enviado com sucesso!")
            } else {
                toast.error(data.error || "Erro ao reenviar confirmação.")
            }
        } catch (err) {
            toast.error("Erro de conexão ao reenviar.")
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(77,182,172,0.05)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                    <div className="flex justify-center mb-6 pt-2">
                        <Image src="/logo.png" alt="MMC LAB" width={160} height={50} className="object-contain" priority />
                    </div>

                    {status === "loading" && (
                        <div className="py-8 space-y-4">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Confirmando seu E-mail</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="py-4 space-y-5 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">E-mail Confirmado!</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                    Sua conta foi ativada com sucesso. Agora você tem acesso completo ao Portal do Cliente.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href="/login-cliente"
                                    className="w-full py-3.5 px-6 bg-primary hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 inline-flex items-center justify-center gap-2 text-base"
                                >
                                    Acessar Minha Conta
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {(status === "expired" || status === "error") && (
                        <div className="py-4 space-y-5 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-4xl font-bold">
                                    {status === "expired" ? "timer_off" : "error"}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    {status === "expired" ? "Link Expirado" : "Link Inválido"}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{message}</p>
                            </div>

                            {resendSuccess ? (
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                                    ✓ Novo link de confirmação enviado para seu e-mail! Verifique sua caixa de entrada e spam.
                                </div>
                            ) : (
                                <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        Reenviar e-mail de confirmação
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isResending}
                                        className="w-full py-3 px-4 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isResending ? (
                                            <span className="material-symbols-outlined animate-spin text-base">refresh</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-base">send</span>
                                        )}
                                        Enviar Novo Link
                                    </button>
                                </form>
                            )}

                            <div className="pt-2">
                                <Link
                                    href="/login-cliente"
                                    className="text-xs font-bold text-slate-500 hover:text-primary transition-colors underline"
                                >
                                    Voltar para a página de login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function VerificarEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <VerificarEmailContent />
        </Suspense>
    )
}
