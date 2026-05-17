"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/components/ConfirmModal"
import SuccessModal from "@/components/SuccessModal"

type User = {
    id: string
    name: string
    email: string
    role: string
    company?: string | null
    birthDate?: string | null
    whatsapp?: string | null
}

export default function CadastrosClientesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [clients, setClients] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Form state
    const [editingClient, setEditingClient] = useState<User | null>(null)
    const [form, setForm] = useState({ name: "", email: "", password: "", company: "", whatsapp: "" })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Estados para os novos modais de confirmação e alerta
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string
        message: string
        onConfirm: () => void
        type?: 'danger' | 'primary' | 'warning'
    }>({
        title: "",
        message: "",
        onConfirm: () => {},
    })

    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successConfig, setSuccessConfig] = useState<{
        title: string
        message: string
        type?: 'success' | 'error' | 'info'
        autoClose?: boolean
    }>({
        title: "",
        message: "",
        type: 'success',
        autoClose: false
    })

    useEffect(() => {
        if (status === "unauthenticated" || (session?.user && session.user.role !== "DESENVOLVEDOR")) {
            router.push("/sgq")
        } else if (status === "authenticated") {
            fetchData()
        }
    }, [status, session, router])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/users?role=CLIENTE")
            if (res.ok) {
                const allUsers: User[] = await res.json()
                setClients(allUsers)
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (client?: User) => {
        setShowPassword(false)
        if (client) {
            setEditingClient(client)
            setForm({
                name: client.name,
                email: client.email,
                password: "",
                company: client.company || "",
                whatsapp: client.whatsapp || ""
            })
        } else {
            setEditingClient(null)
            setForm({ name: "", email: "", password: "", company: "", whatsapp: "" })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        if (!editingClient && form.password.length < 6) {
            setSuccessConfig({
                title: "Senha Curta",
                message: "A senha deve ter no mínimo 6 caracteres.",
                type: 'error',
                autoClose: true
            })
            setShowSuccessModal(true)
            return
        }
        if (editingClient && form.password && form.password.length < 6) {
            setSuccessConfig({
                title: "Senha Curta",
                message: "A senha deve ter no mínimo 6 caracteres.",
                type: 'error',
                autoClose: true
            })
            setShowSuccessModal(true)
            return
        }

        setIsSubmitting(true)
        try {
            const url = editingClient ? `/api/users/${editingClient.id}` : "/api/users"
            const method = editingClient ? "PUT" : "POST"

            const dataToSubmit = {
                ...form,
                role: "CLIENTE"
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSubmit)
            })

            if (res.ok) {
                setIsModalOpen(false)
                fetchData()
            } else {
                const data = await res.json().catch(() => null)
                setSuccessConfig({
                    title: "Erro ao salvar",
                    message: data?.error ? `Erro ao salvar cliente: ${data.error}` : "Erro ao salvar cliente.",
                    type: 'error',
                    autoClose: true
                })
                setShowSuccessModal(true)
            }
        } catch (error) {
            console.error(error)
            setSuccessConfig({
                title: "Erro de conexão",
                message: "Erro de conexão ao salvar cliente.",
                type: 'error',
                autoClose: true
            })
            setShowSuccessModal(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        setConfirmConfig({
            title: "Excluir Cliente",
            message: "Tem certeza que deseja excluir este cliente?",
            type: 'danger',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
                    if (res.ok) {
                        fetchData()
                        setSuccessConfig({
                            title: "Excluído!",
                            message: "Cliente removido com sucesso.",
                            type: 'success',
                            autoClose: true
                        })
                        setShowSuccessModal(true)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        })
        setShowConfirmModal(true)
    }

    if (isLoading) return <div className="p-8">Carregando...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Clientes</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition text-center"
                >
                    Novo Cliente
                </button>
            </div>

            {/* Tabela de Clientes - Desktop */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Nome do Responsável</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">WhatsApp</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Empresa</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Email (Acesso)</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{client.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{client.whatsapp || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{client.company || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{client.email}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleOpenModal(client)}
                                        className="text-primary hover:text-primary/80 font-medium text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-500 hover:text-red-600 font-medium text-sm"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clients.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</div>
                )}
            </div>

            {/* Cards de Clientes - Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {clients.map(client => (
                    <div key={client.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{client.name}</h3>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                                <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1"><span className="font-medium text-slate-400">Empresa:</span> <span className="text-slate-700 dark:text-slate-300">{client.company || '-'}</span></p>
                                <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1"><span className="font-medium text-slate-400">WhatsApp:</span> <span className="text-slate-700 dark:text-slate-300">{client.whatsapp || '-'}</span></p>
                                <p className="flex justify-between pb-1"><span className="font-medium text-slate-400">Email:</span> <span className="text-slate-700 dark:text-slate-300 break-all">{client.email}</span></p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => handleOpenModal(client)}
                                className="text-primary hover:text-primary/80 font-semibold text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-1 text-center"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                className="text-red-500 hover:text-red-600 font-semibold text-sm px-3.5 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 transition flex-1 text-center"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div className="p-8 text-center text-slate-500 col-span-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">Nenhum cliente encontrado.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-4">{editingClient ? "Editar Cliente" : "Novo Cliente"}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome do Responsável</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Empresa</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                                    placeholder="Nome da Empresa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp / Telefone</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email <span className="text-slate-400 text-xs">(Usado como login no portal)</span></label>
                                <input
                                    type="email" required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Senha {editingClient && <span className="text-slate-400 text-xs">(Deixe em branco para manter)</span>}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} required={!editingClient} minLength={6}
                                        className="w-full pl-3 pr-10 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                                {form.password.length > 0 && form.password.length < 6 && (
                                    <p className="text-xs text-red-500 mt-1">A senha deve ter no mínimo 6 caracteres.</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" disabled={isSubmitting}>Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50" disabled={isSubmitting}>
                                    {isSubmitting ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
            />

            <SuccessModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={successConfig.title}
                message={successConfig.message}
                type={successConfig.type}
                autoClose={successConfig.autoClose}
            />
        </div>
    )
}
