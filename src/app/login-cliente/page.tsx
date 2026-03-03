"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginClientePage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Simulando um login de cliente
        setTimeout(() => {
            setLoading(false)
            router.push("/portal-cliente")
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-slate-950 p-4 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Elementos de fundo para diferenciar do login do SGQ */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="mb-6 flex justify-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <span className="text-sm font-bold">Voltar ao Site</span>
                    </Link>
                </div>

                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(59,130,246,0.05)] transition-all relative overflow-hidden">
                    {/* Detalhe superior */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-sky-400"></div>

                    <div className="flex justify-center mb-6 pt-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center font-bold text-3xl text-white shadow-lg shadow-blue-500/30">
                            <span className="material-symbols-outlined text-[32px]">group</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-extrabold text-center mb-2 text-slate-900 dark:text-white">Portal do Cliente</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                        Acesse seus relatórios, laudos e status de propostas.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-start gap-3">
                            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">info</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Email Cadastrado
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Senha
                                </label>
                                <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 mt-6 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? "Autenticando..." : (
                                <>
                                    Acessar Portal
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Ainda não é cliente? <Link href="/contato" className="text-blue-500 font-bold hover:underline">Solicite um orçamento</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
