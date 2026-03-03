"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type User = {
    id: string
    name: string
    email: string
    role: string
    company?: string | null
    profileId: string | null
    profile?: Profile
}

type Profile = {
    id: string
    name: string
    permissions: string[]
}

const ALL_PERMISSIONS = [
    { id: "manage_users", label: "Gerenciar Usuários" },
    { id: "manage_profiles", label: "Gerenciar Permissões/Perfis" },
    { id: "view_dashboard", label: "Visualizar Dashboard" },
    { id: "manage_requests", label: "Gerenciar Solicitações" },
    { id: "execute_tests", label: "Executar Ensaios" },
    { id: "approve_requests", label: "Aprovar Relatórios" },
    { id: "manage_quality", label: "Gestão da Qualidade" },
    { id: "manage_financial", label: "Gestão Financeira/Administrativa" },
    { id: "view_audits", label: "Visualizar Auditorias" },
    { id: "view_own_reports", label: "Visualizar Próprios Relatórios (Cliente)" },
    { id: "view_documents", label: "Visualizar Documentos" },
    { id: "edit_documents", label: "Editar Documentos" },
]

export default function CadastrosPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [users, setUsers] = useState<User[]>([])
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Modals state
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    // User Form state
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "", company: "" })

    // Profile Form state
    const [selectedProfileId, setSelectedProfileId] = useState<string>("")
    const [profilePermissions, setProfilePermissions] = useState<string[]>([])

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
            const [usersRes, profilesRes] = await Promise.all([
                fetch("/api/users"),
                fetch("/api/profiles")
            ])
            if (usersRes.ok) setUsers(await usersRes.json())
            if (profilesRes.ok) setProfiles(await profilesRes.json())
        } catch (error) {
            console.error("Erro ao carregar dados", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenUserModal = (user?: User) => {
        if (user) {
            setEditingUser(user)
            setUserForm({ name: user.name, email: user.email, password: "", role: user.role, company: user.company || "" })
        } else {
            setEditingUser(null)
            setUserForm({ name: "", email: "", password: "", role: "", company: "" })
        }
        setIsUserModalOpen(true)
    }

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
            const method = editingUser ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userForm)
            })

            if (res.ok) {
                setIsUserModalOpen(false)
                fetchData()
            } else {
                alert("Erro ao salvar usuário.")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) return
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
            if (res.ok) fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleOpenProfileModal = () => {
        if (profiles.length > 0) {
            setSelectedProfileId(profiles[0].id)
            setProfilePermissions(profiles[0].permissions)
        }
        setIsProfileModalOpen(true)
    }

    const handleProfileSelect = (id: string) => {
        setSelectedProfileId(id)
        const profile = profiles.find(p => p.id === id)
        if (profile) {
            setProfilePermissions(profile.permissions || [])
        }
    }

    const togglePermission = (permissionId: string) => {
        setProfilePermissions(prev =>
            prev.includes(permissionId)
                ? prev.filter(p => p !== permissionId)
                : [...prev, permissionId]
        )
    }

    const handleSaveProfilePerms = async () => {
        try {
            const res = await fetch(`/api/profiles/${selectedProfileId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions: profilePermissions })
            })
            if (res.ok) {
                alert("Permissões salvas com sucesso!")
                fetchData()
                setIsProfileModalOpen(false)
            } else {
                alert("Erro ao salvar permissões.")
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading) return <div className="p-8">Carregando...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cadastros e Permissões</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleOpenProfileModal}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                    >
                        Gerenciar Perfis
                    </button>
                    <button
                        onClick={() => handleOpenUserModal()}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                    >
                        Novo Usuário
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Nome</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Empresa</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Perfil / Role</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.company || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleOpenUserModal(user)}
                                        className="text-primary hover:text-primary/80 font-medium text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-500 hover:text-red-600 font-medium text-sm"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</div>
                )}
            </div>

            {/* Modal de Usuário */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-4">{editingUser ? "Editar Usuário" : "Novo Usuário"}</h2>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Empresa</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={userForm.company} onChange={e => setUserForm({ ...userForm, company: e.target.value })}
                                    placeholder="Nome da Empresa (Opcional)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email" required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Senha {editingUser && "(Deixe em branco para não alterar)"}</label>
                                <input
                                    type="password" required={!editingUser}
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Perfil</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border rounded-lg bg-transparent border-slate-300 dark:border-slate-700"
                                    value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                                >
                                    <option value="" disabled>Selecione um perfil...</option>
                                    {profiles.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Perfis/Permissões */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4">Gerenciar Permissões de Perfil</h2>

                        <div className="flex gap-4 flex-1 min-h-0">
                            {/* Tabs Latarais */}
                            <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 pr-4 overflow-y-auto">
                                {profiles.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleProfileSelect(p.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm font-medium transition ${selectedProfileId === p.id ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>

                            {/* Lista de Checkboxes */}
                            <div className="w-2/3 pl-4 overflow-y-auto">
                                <h3 className="font-semibold mb-3 text-sm text-slate-500 uppercase tracking-wider">Acessos Permitidos</h3>
                                <div className="space-y-3">
                                    {ALL_PERMISSIONS.map(perm => {
                                        const isChecked = profilePermissions.includes(perm.id)
                                        return (
                                            <label key={perm.id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${isChecked ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'}`}>
                                                    {isChecked && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isChecked}
                                                    onChange={() => togglePermission(perm.id)}
                                                />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{perm.label}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
                            <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancelar</button>
                            <button onClick={handleSaveProfilePerms} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Salvar Permissões</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
