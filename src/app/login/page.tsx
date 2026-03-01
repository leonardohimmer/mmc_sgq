"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError(res.error)
            setLoading(false)
        } else {
            router.push("/sgq") // Redirect to restricted area
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light p-4 font-sans">
            <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center font-bold text-2xl text-white">
                        M
                    </div>
                </div>
                <h2 className="text-2xl font-extrabold text-center mb-2 text-slate-900">Log in MMC LAB</h2>
                <p className="text-center text-slate-500 text-sm font-medium mb-8">Gestão da Qualidade ISO/IEC 17025</p>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary hover:bg-teal-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? "Entrando..." : (
                            <>
                                Entrar no SGQ
                                <span className="material-symbols-outlined text-[18px]">login</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
