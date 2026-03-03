"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const EMOTIONS = [
    { id: "feliz", emoji: "😊", label: "Feliz" },
    { id: "focado", emoji: "🧐", label: "Focado" },
    { id: "cafe", emoji: "☕", label: "Pausa pro Café" },
    { id: "voando", emoji: "🚀", label: "Voando" },
    { id: "sobrecarregado", emoji: "🤯", label: "Sobrecarregado" },
    { id: "ausente", emoji: "🤒", label: "Ausente/Doente" },
    { id: "ferias", emoji: "🌴", label: "De Férias" },
    { id: "normal", emoji: "😐", label: "Normal" },
]

export default function ColaboradoresOnlinePage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Estados do próprio usuário
    const [myAvatarUrl, setMyAvatarUrl] = useState("")
    const [myEmotion, setMyEmotion] = useState("normal")
    const [isSaving, setIsSaving] = useState(false)

    // Buscar usuários
    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users/online")
            if (res.ok) {
                const data = await res.json()
                setUsers(data)

                // Setar os estados iniciais do usuário atual se encontrá-lo na lista
                if (session?.user?.email && !myAvatarUrl && myEmotion === "normal" && !isSaving) {
                    const me = data.find((u: any) => u.email === session.user.email)
                    if (me) {
                        if (me.avatarUrl) setMyAvatarUrl(me.avatarUrl)
                        if (me.emotion) setMyEmotion(me.emotion)
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao buscar usuários:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Polling a cada 15 segundos para atualizar quem está online
    useEffect(() => {
        fetchUsers()
        const interval = setInterval(fetchUsers, 15000)
        return () => clearInterval(interval)
    }, [session])

    // Salvar alterações de perfil
    const handleSaveProfile = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl: myAvatarUrl, emotion: myEmotion })
            })
            if (res.ok) {
                fetchUsers() // Recarrega a lista
            }
        } catch (error) {
            console.error("Erro ao salvar perfil:", error)
        } finally {
            setIsSaving(false)
        }
    }

    // Função para verificar se está online (última atividade em menos de 3 minutos)
    const isOnline = (lastActivity: string | null) => {
        if (!lastActivity) return false
        const now = new Date().getTime()
        const last = new Date(lastActivity).getTime()
        const diffInMinutes = (now - last) / (1000 * 60)
        return diffInMinutes <= 3
    }

    // Fazer upload da imagem e converter para Base64 otimizado
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement("canvas")
                const MAX_WIDTH = 200
                const MAX_HEIGHT = 200
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext("2d")
                ctx?.drawImage(img, 0, 0, width, height)

                const dataUrl = canvas.toDataURL("image/jpeg", 0.7)
                setMyAvatarUrl(dataUrl)
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Colaboradores Online
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Veja quem está ativo no sistema em tempo real e atualize seu status atual.
                </p>
            </div>

            {/* Meu Perfil (Self-Profile Component / Step 4) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                        {myAvatarUrl ? (
                            <img src={myAvatarUrl} alt="Meu Avatar" className="object-cover w-full h-full" />
                        ) : (
                            <span className="material-symbols-outlined text-[32px] text-slate-400">account_circle</span>
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Meu Status</h2>
                        <p className="text-sm text-slate-500">Como você está se sentindo agora?</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Foto do Perfil (Avatar)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Emoção
                        </label>
                        <select
                            value={myEmotion}
                            onChange={(e) => setMyEmotion(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
                        >
                            {EMOTIONS.map(e => (
                                <option key={e.id} value={e.id}>{e.emoji} {e.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full md:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
                >
                    {isSaving ? "Salvando..." : "Atualizar Status"}
                </button>
            </div>

            {/* Grid de Usuários (Step 5) */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">diversity_3</span>
                    Equipe
                </h3>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-32 border border-slate-200 dark:border-slate-800"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {users.map(user => {
                            const online = isOnline(user.lastActivity)
                            const emotionData = EMOTIONS.find(e => e.id === user.emotion) || EMOTIONS.find(e => e.id === "normal")

                            return (
                                <div key={user.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors relative overflow-hidden group">
                                    {/* Indicador de Status Glow */}
                                    <div className={`absolute top-0 right-0 w-16 h-16 ${online ? 'bg-green-500' : 'bg-slate-400'} blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-8 -mt-8`}></div>

                                    <div className="relative shrink-0">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 ${online ? 'border-green-500' : 'border-slate-300 dark:border-slate-700'}`}>
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="material-symbols-outlined text-[28px] text-slate-400">account_circle</span>
                                            )}
                                        </div>
                                        {/* Bolinha de Status Online/Offline */}
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full ${online ? 'bg-green-500' : 'bg-slate-400'}`} title={online ? 'Online' : 'Offline'}></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</h4>
                                            <span className="text-xl shrink-0" title={emotionData?.label}>{emotionData?.emoji}</span>
                                        </div>
                                        <p className="text-xs text-primary font-bold uppercase truncate mt-0.5">
                                            {user.profile?.name || user.role}
                                        </p>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            {online ? 'Ativo agora' : (user.lastActivity ? 'Visto recentemente' : 'Offline')}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
