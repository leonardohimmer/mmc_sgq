"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import Cropper from "react-easy-crop"

const EMOTIONS = [
    { id: "normal", emoji: "😐", label: "Normal" },
    { id: "feliz", emoji: "😊", label: "Feliz" },
    { id: "focado", emoji: "🧐", label: "Focado" },
    { id: "pensativo", emoji: "🤔", label: "Pensativo" },
    { id: "voando", emoji: "🚀", label: "Voando" },
    { id: "comemorando", emoji: "🥳", label: "Comemorando" },
    { id: "zen", emoji: "😌", label: "Tranquilo" },
    { id: "cafe", emoji: "☕", label: "Pausa pro Café" },
    { id: "mate", emoji: "🧉", label: "Mate" },
    { id: "almoco", emoji: "🍝", label: "Almoçando" },
    { id: "reuniao", emoji: "🖥️", label: "Em Reunião" },
    { id: "sobrecarregado", emoji: "🤯", label: "Sobrecarregado" },
    { id: "estressado", emoji: "😫", label: "Estressado" },
    { id: "cansado", emoji: "🥱", label: "Cansado" },
    { id: "preguica", emoji: "🦥", label: "Preguiça" },
    { id: "ausente", emoji: "🤒", label: "Ausente/Doente" },
    { id: "ferias", emoji: "🩴", label: "De Férias" },
]

export default function ColaboradoresOnlinePage() {
    const { data: session } = useSession()
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Estados do próprio usuário
    const [myAvatarUrl, setMyAvatarUrl] = useState("")
    const [myEmotion, setMyEmotion] = useState("normal")
    const [isSaving, setIsSaving] = useState(false)

    // Estados para o Cropper de Imagem
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

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

    // Função para verificar se está online (última atividade em menos de 2 minutos)
    // Se entre 2 e 5 minutos, está ausente
    // Se entre 5 e 30 minutos, visto recentemente
    const getUserStatus = (lastActivity: string | null) => {
        if (!lastActivity) return 'offline'
        const now = new Date().getTime()
        const last = new Date(lastActivity).getTime()
        const diffInMinutes = (now - last) / (1000 * 60)

        if (diffInMinutes <= 2) return 'online'
        if (diffInMinutes <= 5) return 'away'
        if (diffInMinutes <= 30) return 'recent'
        return 'offline'
    }

    // Abrir o modal de crop da imagem
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null))
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const getCroppedImg = async (imageSrc: string, crop: any): Promise<string> => {
        const image = new window.Image()
        image.src = imageSrc
        await new Promise(resolve => image.onload = resolve)

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = 200
        canvas.height = 200

        ctx?.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            200,
            200
        )

        return canvas.toDataURL("image/jpeg", 0.7)
    }

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels)
            setMyAvatarUrl(croppedImage)
            setImageSrc(null) // Fechar modal
        } catch (e) {
            console.error(e)
        }
    }

    const currentMonth = new Date().getUTCMonth()
    const birthdayUsers = users.filter(u => {
        if (!u.birthDate) return false
        return new Date(u.birthDate).getUTCMonth() === currentMonth
    }).sort((a, b) => {
        const dayA = new Date(a.birthDate).getUTCDate()
        const dayB = new Date(b.birthDate).getUTCDate()
        return dayA - dayB
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {imageSrc && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Ajustar Foto</h3>
                            <button onClick={() => setImageSrc(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="relative w-full h-[350px] sm:h-[450px] bg-slate-100 dark:bg-slate-950">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Zoom da imagem</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button onClick={() => setImageSrc(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={showCroppedImage} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-lg shadow-primary/25">
                                    Cortar e Usar Foto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            onChange={(e) => {
                                handleImageUpload(e)
                                e.target.value = '' // Allow re-selecting the same file
                            }}
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

            {/* Aniversariantes do Mês */}
            {birthdayUsers.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-6 -top-10 text-[120px] opacity-[0.03] transform rotate-12 pointer-events-none">
                        🎂
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2 relative z-10">
                        <span className="material-symbols-outlined text-indigo-500">cake</span>
                        Aniversariantes do Mês
                    </h3>
                    <div className="flex flex-wrap gap-4 relative z-10">
                        {birthdayUsers.map(user => {
                            const day = new Date(user.birthDate).getUTCDate()
                            return (
                                <div key={user.id} className="flex items-center gap-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-indigo-200 dark:border-indigo-700 shrink-0">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <span className="material-symbols-outlined text-indigo-400 text-[24px]">account_circle</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{user.name}</div>
                                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Dia {day}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

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
                            const status = getUserStatus(user.lastActivity)
                            const isOnline = status === 'online'
                            const isAway = status === 'away'
                            const isRecent = status === 'recent'
                            const emotionData = EMOTIONS.find(e => e.id === user.emotion) || EMOTIONS.find(e => e.id === "normal")

                            return (
                                <div key={user.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors relative overflow-hidden group">
                                    {/* Indicador de Status Glow */}
                                    <div className={`absolute top-0 right-0 w-16 h-16 ${isOnline ? 'bg-green-500' : isAway ? 'bg-amber-500' : 'bg-slate-400'} blur-3xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-8 -mt-8`}></div>

                                    <div className="relative shrink-0">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 ${isOnline ? 'border-green-500' : isAway ? 'border-amber-500' : 'border-slate-300 dark:border-slate-700'}`}>
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.name} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="material-symbols-outlined text-[28px] text-slate-400">account_circle</span>
                                            )}
                                        </div>
                                        {/* Bolinha de Status Online/Offline */}
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full ${isOnline ? 'bg-green-500' : isAway ? 'bg-amber-500' : 'bg-slate-400'}`} title={isOnline ? 'Online' : isAway ? 'Ausente' : isRecent ? 'Visto recentemente' : 'Offline'}></div>
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
                                            {isOnline ? 'Ativo agora' : isAway ? 'Ausente' : isRecent ? 'Visto recentemente' : 'Offline'}
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
