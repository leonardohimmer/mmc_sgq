"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import SuccessModal from "@/components/SuccessModal"

type User = {
    id: string
    name: string
    email: string
    role: string
    permissions: string[]
}

const RESPONSAVEL_PERMISSIONS = [
    { id: "resp_acustica", label: "Acústica" },
    { id: "resp_aderencia", label: "Aderência" },
    { id: "resp_guarda_corpo", label: "Guarda-corpo" },
    { id: "resp_luminico", label: "Lumínico" },
    { id: "resp_percussao", label: "Percussão" },
    { id: "resp_impermeabilizacao", label: "Impermeabilização" },
]

export default function ResponsavelTecnicoPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState<string | null>(null)

    // Notification state
    const [notification, setNotification] = useState<{
        isOpen: boolean
        title: string
        message: string
        type: 'success' | 'error' | 'info'
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: 'success'
    })

    useEffect(() => {
        const userRoles = (session?.user?.role || "").split(",").map(r => r.trim())
        if (status === "unauthenticated" || (session?.user && !userRoles.includes("DESENVOLVEDOR") && !userRoles.includes("DIRETOR"))) {
            router.push("/sgq")
        } else if (status === "authenticated") {
            fetchUsers()
        }
    }, [status, session, router])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/users")
            if (res.ok) {
                const allUsers: User[] = await res.json()
                // Filtrar apenas responsáveis técnicos
                const responsaveis = allUsers.filter(u => 
                    u.role.toUpperCase().includes("RESPONSÁVEL TÉCNICO") || 
                    u.role.toUpperCase().includes("RESPONSAVEL TECNICO")
                )
                setUsers(responsaveis)
            }
        } catch (error) {
            console.error("Erro ao carregar responsáveis técnicos", error)
        } finally {
            setIsLoading(false)
        }
    }

    const togglePermission = async (user: User, permId: string) => {
        if (isSaving) return // Evitar cliques múltiplos
        setIsSaving(user.id)
        
        try {
            const currentPermissions = user.permissions || []
            const newPermissions = currentPermissions.includes(permId)
                ? currentPermissions.filter(p => p !== permId)
                : [...currentPermissions, permId]

            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ...user,
                    permissions: newPermissions 
                })
            })

            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, permissions: newPermissions } : u))
            } else {
                const errorData = await res.json()
                setNotification({
                    isOpen: true,
                    title: "Erro",
                    message: `Erro ao salvar permissão: ${errorData.error || 'Erro desconhecido'}`,
                    type: 'error'
                })
            }
        } catch (error) {
            console.error(error)
            setNotification({
                isOpen: true,
                title: "Erro",
                message: "Erro de conexão ao tentar salvar.",
                type: 'error'
            })
        } finally {
            setIsSaving(null)
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configuração de Responsável Técnico</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie quais tipos de ensaios cada responsável técnico pode visualizar para aprovação.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">Salvamento Automático Ativo</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Desktop and Tablet Landscape Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300">Colaborador</th>
                                <th className="px-6 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300">Configuração de Visualização (Ensaios)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-6 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-slate-900 dark:text-white">{user.name}</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">{user.email}</span>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {user.role.split(',').map((r, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        {r.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {RESPONSAVEL_PERMISSIONS.map(perm => {
                                                const isChecked = user.permissions?.includes(perm.id)
                                                const saving = isSaving === user.id

                                                return (
                                                    <label 
                                                        key={perm.id} 
                                                        className={`
                                                            group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer
                                                            ${isChecked 
                                                                ? 'bg-primary/5 border-primary/20 text-primary' 
                                                                : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}
                                                            ${saving ? 'opacity-50 pointer-events-none' : ''}
                                                        `}
                                                    >
                                                        <div className={`
                                                            w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                                                            ${isChecked ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-primary'}
                                                        `}>
                                                            {isChecked && (
                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            className="hidden"
                                                            checked={isChecked}
                                                            onChange={() => togglePermission(user, perm.id)}
                                                        />
                                                        <span className="text-sm font-semibold">{perm.label}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum Responsável Técnico encontrado</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Certifique-se de que os colaboradores possuem o papel "RESPONSÁVEL TÉCNICO" atribuído.</p>
                        </div>
                    )}
                </div>

                {/* Mobile and Tablet Portrait Card View */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map(user => (
                        <div key={user.id} className="p-5 space-y-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors animate-in fade-in-50 duration-200">
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-slate-900 dark:text-white">{user.name}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">{user.email}</span>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {user.role.split(',').map((r, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            {r.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Configuração de Visualização (Ensaios)</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {RESPONSAVEL_PERMISSIONS.map(perm => {
                                        const isChecked = user.permissions?.includes(perm.id)
                                        const saving = isSaving === user.id

                                        return (
                                            <label 
                                                key={perm.id} 
                                                className={`
                                                    group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer
                                                    ${isChecked 
                                                        ? 'bg-primary/5 border-primary/20 text-primary' 
                                                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}
                                                    ${saving ? 'opacity-50 pointer-events-none' : ''}
                                                `}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                                                    ${isChecked ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-primary'}
                                                `}>
                                                    {isChecked && (
                                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden"
                                                    checked={isChecked}
                                                    onChange={() => togglePermission(user, perm.id)}
                                                />
                                                <span className="text-sm font-semibold">{perm.label}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Nenhum Responsável Técnico encontrado</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Certifique-se de que os colaboradores possuem o papel "RESPONSÁVEL TÉCNICO".</p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal 
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                autoClose={true}
            />
        </div>
    )
}
