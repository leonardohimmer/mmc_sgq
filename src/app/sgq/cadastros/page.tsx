"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import SuccessModal from "@/components/SuccessModal"
import ConfirmModal from "@/components/ConfirmModal"

type User = {
    id: string
    name: string
    email: string
    role: string
    company?: string | null
    birthDate?: string | null
    profileId: string | null
    profile?: Profile
    permissions?: string[]
}

type Profile = {
    id: string
    name: string
    permissions: string[]
}

const PERMISSION_GROUPS = [
    {
        title: "Qualidade",
        items: [
            { id: "qualidade_dashboard", label: "Dashboard" },
            { id: "qualidade_politicas", label: "Políticas" },
            { id: "qualidade_procedimentos", label: "Procedimentos" },
            { id: "qualidade_instrucoes", label: "Instruções de Trabalho" },
            { id: "qualidade_recursos", label: "Gestão de Recursos" },
            { id: "qualidade_processos", label: "Processos Oper." },
            { id: "qualidade_riscos", label: "Gestão de Riscos" },
            { id: "qualidade_indicadores", label: "Indicadores" },
            { id: "qualidade_fornecedores", label: "Fornecedores" },
            { id: "qualidade_equipamentos", label: "Equipamentos" },
            { id: "qualidade_nc", label: "Não Conformidades" },
            { id: "qualidade_reclamacoes", label: "Reclamações" },
            { id: "qualidade_auditorias", label: "Auditorias" },
            { id: "qualidade_analise_critica", label: "Análise Crítica" },
            { id: "qualidade_docs_registros", label: "Docs e Registros" },
        ]
    },
    {
        title: "Técnico",
        items: [
            { id: "tecnico_dashboard", label: "Dashboard" },
            { id: "tecnico_propostas", label: "Propostas" },
            { id: "tecnico_envio_proposta", label: "Envio da Proposta" },
            { id: "tecnico_aguardando_agendamento", label: "Aguardando Agendamento" },
            { id: "tecnico_execucao_ensaios", label: "Execução de Ensaios" },
            { id: "tecnico_elaboracao_relatorio", label: "Elaboração de Relatório" },
            { id: "tecnico_aprovacao", label: "Aprovação" },
            { id: "tecnico_cobrancas", label: "Emissão de Cobranças" },
            { id: "tecnico_recebimentos", label: "Recebimentos" },
            { id: "tecnico_pesquisa_satisfacao", label: "Pesquisa de Satisfação" },
        ]
    },
    {
        title: "Responsável técnico",
        items: [
            { id: "resp_iso_acustico_lab", label: "Isolamento Acústico (Lab)" },
            { id: "resp_iso_ruido_impacto", label: "Ruído de Impacto" },
            { id: "resp_mapa_ruido", label: "Mapa de Ruído" },
            { id: "resp_insp_camera_acustica", label: "Câmera Acústica" },
            { id: "resp_ancoragem", label: "Ancoragem" },
            { id: "resp_esclerometria", label: "Esclerometria" },
            { id: "resp_guarda_corpo", label: "Guarda-corpo e Parapeito" },
            { id: "resp_impacto_corpo", label: "Impacto de Corpo Mole/Duro" },
            { id: "resp_pit", label: "Integridade de Estacas (PIT)" },
            { id: "resp_pecas_suspensas", label: "Peças Suspensas" },
            { id: "resp_percussao", label: "Percussão" },
            { id: "resp_permeabilidade", label: "Permeabilidade" },
            { id: "resp_arrancamento", label: "Aderência (Arrancamento)" },
            { id: "resp_luminico", label: "Lumínico" },
            { id: "resp_insp_fachadas", label: "Inspeção de Fachadas" },
            { id: "resp_insp_termografica", label: "Inspeção Termográfica" },
        ]
    },
    {
        title: "Administrativo",
        items: [
            { id: "admin_contas_pagar", label: "Contas a Pagar" },
            { id: "admin_contas_receber", label: "Contas a Receber" },
            { id: "admin_fluxo_caixa", label: "Fluxo de Caixa" },
            { id: "admin_gestao_bancaria", label: "Gestão Bancária" },
            { id: "admin_centro_custos", label: "Centro de Custos" },
            { id: "admin_plano_contas", label: "Plano de Contas" },
            { id: "admin_faturamento_nf", label: "Faturamento e NF" },
            { id: "admin_impostos_obrigacoes", label: "Impostos e Obrigações" },
        ]
    },
    {
        title: "Sistema",
        items: [
            { id: "sistema_agenda", label: "Agenda" },
            { id: "sistema_colaboradores", label: "Colaboradores Online" },
            { id: "sistema_cadastros", label: "Cadastros" },
            { id: "sistema_logs", label: "Logs do Sistema" },
            { id: "sistema_site", label: "Site" },
        ]
    },
    {
        title: "Projetos",
        items: [
            { id: "projetos_concepcao", label: "Concepção e modelagem técnica" },
            { id: "projetos_calculos", label: "Cálculos e dimensionamento" },
            { id: "projetos_documentacao", label: "Documentação e normas" },
            { id: "projetos_visitas", label: "Visitas técnicas" },
        ]
    }
]

export default function CadastrosPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [users, setUsers] = useState<User[]>([])
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "", company: "", birthDate: "" })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Notification states
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

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        title: string
        message: string
        onConfirm: () => void
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {}
    })

    const [selectedProfileId, setSelectedProfileId] = useState<string>("")
    const [profilePermissions, setProfilePermissions] = useState<string[]>([])

    useEffect(() => {
        const userRoles = (session?.user?.role || "").split(",").map(r => r.trim())
        if (status === "unauthenticated" || (session?.user && !userRoles.includes("DESENVOLVEDOR"))) {
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
            if (profilesRes.ok) {
                const profilesData = await profilesRes.json()
                setProfiles(profilesData)
                if (profilesData.length > 0 && !selectedProfileId) {
                    setSelectedProfileId(profilesData[0].id)
                    setProfilePermissions(profilesData[0].permissions || [])
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenUserModal = (user?: User) => {
        setShowPassword(false)
        if (user) {
            setEditingUser(user)
            setUserForm({
                name: user.name,
                email: user.email,
                password: "",
                role: user.role,
                company: user.company || "",
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
            })
        } else {
            setEditingUser(null)
            setUserForm({ name: "", email: "", password: "", role: "", company: "", birthDate: "" })
        }
        setIsUserModalOpen(true)
    }

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
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
                setNotification({
                    isOpen: true,
                    title: "Sucesso!",
                    message: editingUser ? "Colaborador atualizado com sucesso." : "Colaborador cadastrado com sucesso.",
                    type: 'success'
                })
            } else {
                const data = await res.json().catch(() => null)
                setNotification({
                    isOpen: true,
                    title: "Erro",
                    message: data?.error ? `Erro ao salvar colaborador: ${data.error}` : "Erro ao salvar colaborador.",
                    type: 'error'
                })
            }
        } catch (error) {
            console.error(error)
            setNotification({
                isOpen: true,
                title: "Erro",
                message: "Erro de conexão ao salvar colaborador.",
                type: 'error'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteUser = async (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Excluir Colaborador",
            message: "Tem certeza que deseja excluir este colaborador? Esta ação não poderá ser desfeita.",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
                    if (res.ok) {
                        fetchData()
                        setNotification({
                            isOpen: true,
                            title: "Excluído!",
                            message: "Colaborador excluído com sucesso.",
                            type: 'success'
                        })
                    }
                } catch (error) {
                    console.error(error)
                    setNotification({
                        isOpen: true,
                        title: "Erro",
                        message: "Erro ao excluir colaborador.",
                        type: 'error'
                    })
                }
            }
        })
    }

    const handleOpenProfileModal = () => {
        if (profiles.length > 0) {
            const current = profiles.find(p => p.id === selectedProfileId) || profiles[0]
            setSelectedProfileId(current.id)
            setProfilePermissions(current.permissions || [])
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

    const toggleGroupPermissions = (groupTitle: string) => {
        const group = PERMISSION_GROUPS.find(g => g.title === groupTitle)
        if (!group) return

        const groupPermIds = group.items.map(item => item.id)
        const allSelected = groupPermIds.every(id => profilePermissions.includes(id))

        if (allSelected) {
            setProfilePermissions(prev => prev.filter(p => !groupPermIds.includes(p)))
        } else {
            setProfilePermissions(prev => {
                const newPerms = new Set(prev)
                groupPermIds.forEach(id => newPerms.add(id))
                return Array.from(newPerms)
            })
        }
    }

    const handleSaveProfilePerms = async () => {
        try {
            const res = await fetch(`/api/profiles/${selectedProfileId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions: profilePermissions })
            })
            if (res.ok) {
                const data = await res.json()
                const usersUpdated = data.usersUpdated || 0
                setNotification({
                    isOpen: true,
                    title: "Sucesso!",
                    message: "Permissões salvas com sucesso!" + (usersUpdated > 0 ? " " + usersUpdated + " colaborador(es) atualizado(s)." : ""),
                    type: 'success'
                })
                fetchData()
                setIsProfileModalOpen(false)
            } else {
                setNotification({
                    isOpen: true,
                    title: "Erro",
                    message: "Erro ao salvar permissões.",
                    type: 'error'
                })
            }
        } catch (error) {
            console.error(error)
            setNotification({
                isOpen: true,
                title: "Erro",
                message: "Erro de conexão ao salvar permissões.",
                type: 'error'
            })
        }
    }

    if (isLoading) return <div className="p-8 text-slate-500 font-medium">Carregando dados...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 transition-colors">Cadastros e Permissões</h1>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleOpenProfileModal}
                        className="flex-1 sm:flex-none px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition text-sm sm:text-base text-center shadow-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                        Gerenciar Perfis
                    </button>
                    <button
                        onClick={() => handleOpenUserModal()}
                        className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition text-sm sm:text-base text-center shadow-lg shadow-primary/20 dark:shadow-none flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Novo Colaborador
                    </button>
                </div>
            </div>

            {/* Tabela de Colaboradores - Desktop */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data Nasc.</th>
                            <th className="px-6 py-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Perfil / Role</th>
                            <th className="px-6 py-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.company || '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.birthDate ? new Date(user.birthDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : '-'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {(user.role || "").split(',').map((r, i) => r.trim() ? (
                                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/20">
                                                {r.trim()}
                                            </span>
                                        ) : null)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button
                                        onClick={() => handleOpenUserModal(user)}
                                        className="text-primary hover:text-primary/80 font-bold text-sm transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-500 hover:text-red-600 font-bold text-sm transition-colors"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium">Nenhum colaborador encontrado.</div>
                )}
            </div>

            {/* Cards de Colaboradores - Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {users.map(user => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{user.name}</h3>
                                <div className="flex flex-wrap gap-1 justify-end max-w-[50%] shrink-0">
                                    {(user.role || "").split(',').map((r, i) => r.trim() ? (
                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                            {r.trim()}
                                        </span>
                                    ) : null)}
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                                <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1"><span className="font-medium text-slate-400">Empresa:</span> <span className="text-slate-700 dark:text-slate-300">{user.company || '-'}</span></p>
                                <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1"><span className="font-medium text-slate-400">Nascimento:</span> <span className="text-slate-700 dark:text-slate-300">{user.birthDate ? new Date(user.birthDate).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : '-'}</span></p>
                                <p className="flex justify-between pb-1"><span className="font-medium text-slate-400">Email:</span> <span className="text-slate-700 dark:text-slate-300 break-all">{user.email}</span></p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => handleOpenUserModal(user)}
                                className="text-primary hover:text-primary/80 font-bold text-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-1 text-center"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-500 hover:text-red-600 font-bold text-sm px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 transition flex-1 text-center"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
                {users.length === 0 && (
                    <div className="p-8 text-center text-slate-500 col-span-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 font-medium">Nenhum colaborador encontrado.</div>
                )}
            </div>

            {/* Modal de Usuário */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">{editingUser ? "Editar Colaborador" : "Novo Colaborador"}</h2>
                        <form onSubmit={handleSaveUser} className="flex flex-col min-h-0 flex-1">
                            <div className="flex flex-col md:flex-row gap-6 overflow-y-auto pr-2 pb-2 flex-1">
                                {/* Coluna 1: Dados Pessoais */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Nome</label>
                                        <input
                                            type="text" required
                                            className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                            value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Empresa</label>
                                        <input
                                            type="text"
                                            className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                            value={userForm.company} onChange={e => setUserForm({ ...userForm, company: e.target.value })}
                                            placeholder="Nome da Empresa (Opcional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                            value={userForm.birthDate} onChange={e => setUserForm({ ...userForm, birthDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Email</label>
                                        <input
                                            type="email" required
                                            className="w-full px-3.5 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                            value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Senha {editingUser && "(Deixe em branco para não alterar)"}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"} required={!editingUser}
                                                className="w-full pl-3.5 pr-10 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                                value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })}
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
                                    </div>
                                </div>

                                {/* Coluna 2: Perfis */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Perfis (Macro)</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 max-h-[300px] overflow-y-auto">
                                            {profiles.map(p => {
                                                const isChecked = userForm.role.split(',').map(r => r.trim()).includes(p.name)
                                                return (
                                                    <label key={p.id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                const roles = userForm.role ? userForm.role.split(',').map(r => r.trim()).filter(r => r) : []
                                                                if (e.target.checked) {
                                                                    roles.push(p.name)
                                                                } else {
                                                                    const idx = roles.indexOf(p.name)
                                                                    if (idx > -1) roles.splice(idx, 1)
                                                                }
                                                                setUserForm({ ...userForm, role: roles.join(',') })
                                                            }}
                                                            className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 bg-transparent w-4 h-4"
                                                        />
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate" title={p.name}>{p.name}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
                                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition" disabled={isSubmitting}>Cancelar</button>
                                <button type="submit" className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition" disabled={isSubmitting}>
                                    {isSubmitting ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Perfis/Permissões */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0b1329] text-slate-100 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-700/60 flex flex-col max-h-[85vh] transition-all">
                        
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-teal-400">admin_panel_settings</span>
                                Gerenciar Permissões de Perfil
                            </h2>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                            
                            {/* Seleção de Perfil para Mobile (Dropdown) */}
                            <div className="block md:hidden shrink-0">
                                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Selecionar Perfil</label>
                                <select
                                    value={selectedProfileId}
                                    onChange={(e) => handleProfileSelect(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-100 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition"
                                >
                                    {profiles.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tabs Laterais para Desktop */}
                            <div className="hidden md:block w-5/12 border-r border-slate-800/80 pr-4 overflow-y-auto space-y-1">
                                {profiles.map(p => {
                                    const isSelected = selectedProfileId === p.id
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => handleProfileSelect(p.id)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between ${
                                                isSelected
                                                    ? 'bg-teal-500/10 text-teal-300 border-l-4 border-teal-400 bg-slate-800/80 shadow-sm'
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                            }`}
                                        >
                                            <span className="truncate">{p.name}</span>
                                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 ml-2"></span>}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Lista de Checkboxes de Permissões */}
                            <div className="flex-1 md:w-7/12 md:pl-2 overflow-y-auto pr-2">
                                <h3 className="font-mono text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span>ACESSOS PERMITIDOS</span>
                                </h3>
                                <div className="space-y-6">
                                    {PERMISSION_GROUPS.map((group) => {
                                        const groupPermIds = group.items.map(item => item.id)
                                        const allSelected = groupPermIds.length > 0 && groupPermIds.every(id => profilePermissions.includes(id))
                                        const someSelected = groupPermIds.some(id => profilePermissions.includes(id))

                                        return (
                                            <div key={group.title} className="space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                                                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                                                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allSelected ? 'bg-teal-500 border-teal-500' : someSelected ? 'bg-teal-500/40 border-teal-400' : 'border-slate-700 bg-slate-900 group-hover:border-teal-500'}`}>
                                                            {allSelected && <span className="material-symbols-outlined text-[12px] text-slate-950 font-bold">check</span>}
                                                            {!allSelected && someSelected && <span className="material-symbols-outlined text-[12px] text-teal-200 font-bold">remove</span>}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={allSelected}
                                                            onChange={() => toggleGroupPermissions(group.title)}
                                                        />
                                                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-teal-300 transition-colors">{group.title}</h4>
                                                    </label>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                    {group.items.map(perm => {
                                                        const isChecked = profilePermissions.includes(perm.id)
                                                        return (
                                                            <label key={perm.id} className="flex items-center gap-2.5 cursor-pointer group p-1.5 rounded-lg hover:bg-slate-800/60 transition select-none">
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? 'bg-teal-500 border-teal-500' : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'}`}>
                                                                    {isChecked && <span className="material-symbols-outlined text-[12px] text-slate-950 font-bold">check</span>}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="hidden"
                                                                    checked={isChecked}
                                                                    onChange={() => togglePermission(perm.id)}
                                                                />
                                                                <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors leading-tight">{perm.label}</span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-800 shrink-0">
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveProfilePerms}
                                className="px-5 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 transition-all"
                            >
                                Salvar Permissões
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal 
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                autoClose={true}
            />

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type="danger"
            />
        </div>
    )
}
