"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import SuccessModal from "@/components/SuccessModal"


export default function LoginClientePage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [registerForm, setRegisterForm] = useState({ name: "", company: "", whatsapp: "", email: "", password: "" })
    const [isRegistering, setIsRegistering] = useState(false)
    const [registerMessage, setRegisterMessage] = useState({ type: "", text: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)
    const [forgotEmail, setForgotEmail] = useState("")
    const [isSendingForgot, setIsSendingForgot] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                loginType: "cliente",
                redirect: false,
            })

            if (res?.error) {
                setError(res.error)
                toast.error(res.error)
            } else {
                toast.success("Login realizado com sucesso!")
                router.push("/portal-cliente")
            }
        } catch (err) {
            setError("Ocorreu um erro ao fazer login.")
            toast.error("Ocorreu um erro ao fazer login.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsRegistering(true)
        setRegisterMessage({ type: "", text: "" })

        if (registerForm.password.length < 6) {
            setRegisterMessage({ type: "error", text: "A senha deve ter no mínimo 6 caracteres." })
            setIsRegistering(false)
            return
        }

        try {
            const res = await fetch("/api/register-client", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerForm)
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Erro ao registrar.")
            } else {
                toast.success("Conta criada com sucesso!")
                setShowSuccessModal(true)
                setRegisterForm({ name: "", company: "", whatsapp: "", email: "", password: "" })
                // Preenche o email para facilitar o login após fechar
                setEmail(registerForm.email)
            }

        } catch (err) {
            toast.error("Erro de conexão.")
        } finally {
            setIsRegistering(false)
        }
    }

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSendingForgot(true)

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail })
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Erro ao processar solicitação.")
            } else {
                toast.success(data.message)
                setIsForgotModalOpen(false)
                setForgotEmail("")
            }
        } catch (err) {
            toast.error("Erro de conexão.")
        } finally {
            setIsSendingForgot(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-slate-950 p-4 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Elementos de fundo para diferenciar do login do SGQ */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute -left-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="mb-6 flex justify-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors bg-white/50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        <span className="text-sm font-bold">Voltar ao Site</span>
                    </Link>
                </div>

                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(77,182,172,0.05)] transition-all relative overflow-hidden">
                    {/* Detalhe superior */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                    <div className="flex justify-center mb-6 pt-4 cursor-pointer">
                        <Image src="/logo.png" alt="MMC LAB" width={160} height={50} className="object-contain dark:brightness-200 dark:grayscale" priority />
                    </div>

                    <h2 className="text-2xl font-extrabold text-center mb-2 text-slate-900 dark:text-white">Portal do Cliente</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                        Acesse seus relatórios, laudos e status de propostas.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium text-sm flex items-start gap-3">
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
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
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
                                <button 
                                    type="button"
                                    onClick={() => setIsForgotModalOpen(true)}
                                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 mt-6 bg-primary hover:opacity-90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? "Autenticando..." : (
                                <>
                                    Acessar Portal
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button 
                            type="button" 
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="text-primary font-bold hover:underline"
                        >
                            Criar meu acesso
                        </button>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Ainda não conhece nossos serviços? <Link href="/contato" className="text-slate-700 dark:text-slate-300 font-bold hover:underline">Solicite um orçamento</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de Cadastro */}
            {isRegisterModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Criar Novo Acesso</h2>
                            <button 
                                onClick={() => setIsRegisterModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6">


                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Nome do Responsável <span className="text-red-500">*</span></label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                                        value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Empresa</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                                        value={registerForm.company} onChange={e => setRegisterForm({ ...registerForm, company: e.target.value })}
                                        placeholder="Nome da sua Empresa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">WhatsApp / Telefone</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                                        value={registerForm.whatsapp} onChange={e => setRegisterForm({ ...registerForm, whatsapp: e.target.value })}
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email (Seu usuário) <span className="text-red-500">*</span></label>
                                    <input
                                        type="email" required
                                        className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                                        value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Senha <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type={showRegisterPassword ? "text" : "password"} required minLength={6}
                                            className="w-full px-4 pr-12 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                                            value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            tabIndex={-1}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{showRegisterPassword ? "visibility_off" : "visibility"}</span>
                                        </button>
                                    </div>
                                    {registerForm.password.length > 0 && registerForm.password.length < 6 && (
                                        <p className="text-xs text-red-500 mt-1">A senha deve ter no mínimo 6 caracteres.</p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsRegisterModalOpen(false)} 
                                        className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition" 
                                        disabled={isRegistering}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition shadow-md shadow-primary/20" 
                                        disabled={isRegistering}
                                    >
                                        {isRegistering ? "Cadastrando..." : "Cadastrar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal 
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false)
                    setIsRegisterModalOpen(false)
                }}
                title="Cadastro realizado com sucesso!"
                message="Seu acesso foi criado. Você já pode realizar o login com seu e-mail e senha."
                buttonText="Ir para o Login"
            />

            {/* Modal de Esqueci a Senha */}
            {isForgotModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recuperar Senha</h2>
                            <button 
                                onClick={() => setIsForgotModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                            </p>

                            <form onSubmit={handleForgotSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">E-mail</label>
                                    <input
                                        type="email" required
                                        className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                                        value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsForgotModalOpen(false)} 
                                        className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition" 
                                        disabled={isSendingForgot}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition shadow-md shadow-primary/20 flex items-center gap-2" 
                                        disabled={isSendingForgot}
                                    >
                                        {isSendingForgot ? "Enviando..." : "Enviar Link"}
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
