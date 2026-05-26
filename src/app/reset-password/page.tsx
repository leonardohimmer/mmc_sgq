"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error("Token de recuperação não encontrado.")
            router.push("/")
        }
    }, [token, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.")
            return
        }

        if (password.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Erro ao redefinir senha.")
            } else {
                toast.success("Senha redefinida com sucesso! Redirecionando...")
                setTimeout(() => {
                    router.push("/login-cliente")
                }, 3000)
            }
        } catch (err) {
            toast.error("Erro de conexão.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md w-full relative z-10">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(var(--primary),0.05)] transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                <div className="flex justify-center mb-6 pt-4">
                    <Image src="/logo.png" alt="MMC LAB" width={160} height={50} className="object-contain" priority />
                </div>
                
                <h2 className="text-2xl font-extrabold text-center mb-2 text-slate-900 dark:text-slate-100">Redefinir Senha</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                    Digite sua nova senha abaixo para recuperar o acesso.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Nova Senha
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                tabIndex={-1}
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                            Confirmar Nova Senha
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-4 mt-6 bg-primary hover:opacity-90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? "Processando..." : (
                            <>
                                Atualizar Senha
                                <span className="material-symbols-outlined">save</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link href="/login-cliente" className="text-sm font-bold text-primary hover:underline">
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-slate-950 p-4 font-sans transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <Suspense fallback={<div className="text-white">Carregando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
