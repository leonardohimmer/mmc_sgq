"use client"

import { useEffect, useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/lib/imageUtils"

interface StatItem {
    value: string
    label: string
    color: string
}

interface TeamMember {
    name: string
    role: string
    photoUrl: string
}

interface Review {
    name: string
    rating: number
    text: string
    source: string
}

export default function SiteAdminPage() {
    const [activeTab, setActiveTab] = useState<"history" | "stats" | "team" | "testimonials">("history")
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)

    // History
    const [historyTitle, setHistoryTitle] = useState("")
    const [historyParagraphs, setHistoryParagraphs] = useState<string[]>([""])

    // Stats
    const [stats, setStats] = useState<StatItem[]>([])

    // Team
    const [team, setTeam] = useState<TeamMember[]>([])

    // Testimonials
    const [testimonials, setTestimonials] = useState<Review[]>([])

    // Image Cropping State
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [memberIndexToCrop, setMemberIndexToCrop] = useState<number | null>(null)
    const [isCropModalOpen, setIsCropModalOpen] = useState(false)

    const onCropComplete = useCallback((_area: any, pixels: any) => {
        setCroppedAreaPixels(pixels)
    }, [])

    const handleApplyCrop = async () => {
        if (imageToCrop && croppedAreaPixels && memberIndexToCrop !== null) {
            try {
                const croppedBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels)
                const n = [...team]
                n[memberIndexToCrop] = { ...n[memberIndexToCrop], photoUrl: croppedBase64 }
                setTeam(n)
                setIsCropModalOpen(false)
                setImageToCrop(null)
                setMemberIndexToCrop(null)
            } catch (e) {
                console.error("Erro ao cortar imagem:", e)
            }
        }
    }

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/site-content")
            if (res.ok) {
                const data = await res.json()
                if (data.history) {
                    setHistoryTitle(data.history.title || "")
                    setHistoryParagraphs(data.history.paragraphs || [""])
                }
                if (data.stats) {
                    setStats(data.stats.items || [])
                }
                if (data.team) {
                    setTeam(data.team.members || [])
                }
                if (data.testimonials) {
                    setTestimonials(data.testimonials.reviews || [])
                }
            }
        } catch (e) {
            console.error("Erro ao carregar conteúdo:", e)
        } finally {
            setLoading(false)
        }
    }

    const saveSection = async (section: string, data: unknown) => {
        setSaving(true)
        setMessage("")
        try {
            const res = await fetch("/api/site-content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section, data }),
            })
            if (res.ok) {
                setMessage("✅ Salvo com sucesso!")
            } else {
                setMessage("❌ Erro ao salvar")
            }
        } catch {
            setMessage("❌ Erro de conexão")
        } finally {
            setSaving(false)
            setTimeout(() => setMessage(""), 3000)
        }
    }

    const saveHistory = () => saveSection("history", { title: historyTitle, paragraphs: historyParagraphs })
    const saveStats = () => saveSection("stats", { items: stats })
    const saveTeam = () => saveSection("team", { members: team })
    const saveTestimonials = () => saveSection("testimonials", { reviews: testimonials })

    const tabs = [
        { key: "history" as const, label: "História", icon: "history_edu" },
        { key: "stats" as const, label: "Indicadores", icon: "trending_up" },
        { key: "team" as const, label: "Equipe", icon: "groups" },
        { key: "testimonials" as const, label: "Depoimentos", icon: "reviews" },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">language</span>
                        Gerenciar Site
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Edite as informações exibidas no site público da MMC Lab
                    </p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {message}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.key
                            ? "bg-primary/10 text-primary border-b-2 border-primary"
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">

                {/* ========== HISTÓRIA ========== */}
                {activeTab === "history" && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Título da Seção</label>
                            <input
                                type="text"
                                value={historyTitle}
                                onChange={(e) => setHistoryTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Parágrafos</label>
                            {historyParagraphs.map((p, i) => (
                                <div key={i} className="flex gap-2 mb-3">
                                    <textarea
                                        value={p}
                                        onChange={(e) => {
                                            const newP = [...historyParagraphs]
                                            newP[i] = e.target.value
                                            setHistoryParagraphs(newP)
                                        }}
                                        rows={3}
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
                                    />
                                    <button
                                        onClick={() => setHistoryParagraphs(historyParagraphs.filter((_, idx) => idx !== i))}
                                        className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors self-start mt-1"
                                        title="Remover parágrafo"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setHistoryParagraphs([...historyParagraphs, ""])}
                                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Adicionar parágrafo
                            </button>
                        </div>
                        <button onClick={saveHistory} disabled={saving} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">{saving ? "hourglass_empty" : "save"}</span>
                            {saving ? "Salvando..." : "Salvar História"}
                        </button>
                    </div>
                )}

                {/* ========== INDICADORES ========== */}
                {activeTab === "stats" && (
                    <div className="space-y-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Edite os indicadores exibidos na página Sobre.</p>
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-wrap gap-3 items-end p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div className="flex-1 min-w-[120px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Valor</label>
                                    <input
                                        value={stat.value}
                                        onChange={(e) => {
                                            const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; setStats(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Descrição</label>
                                    <input
                                        value={stat.label}
                                        onChange={(e) => {
                                            const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; setStats(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setStats([...stats, { value: "+0", label: "Novo Indicador", color: "primary" }])}
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Adicionar indicador
                        </button>
                        <button onClick={saveStats} disabled={saving} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">{saving ? "hourglass_empty" : "save"}</span>
                            {saving ? "Salvando..." : "Salvar Indicadores"}
                        </button>
                    </div>
                )}

                {/* ========== EQUIPE ========== */}
                {activeTab === "team" && (
                    <div className="space-y-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie os membros exibidos no carrossel de equipe.</p>
                        {team.map((member, i) => (
                            <div key={i} className="flex flex-wrap gap-3 items-end p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nome</label>
                                    <input
                                        value={member.name}
                                        onChange={(e) => {
                                            const n = [...team]; n[i] = { ...n[i], name: e.target.value }; setTeam(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cargo</label>
                                    <input
                                        value={member.role}
                                        onChange={(e) => {
                                            const n = [...team]; n[i] = { ...n[i], role: e.target.value }; setTeam(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Foto do Membro</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                value={member.photoUrl}
                                                onChange={(e) => {
                                                    const n = [...team]; n[i] = { ...n[i], photoUrl: e.target.value }; setTeam(n)
                                                }}
                                                placeholder="https://... ou upload ->"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 outline-none pr-10"
                                            />
                                            {member.photoUrl && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                                                    <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="cursor-pointer group" title="Upload de foto do computador">
                                            <div className="w-10 h-[38px] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImageToCrop(reader.result as string);
                                                            setMemberIndexToCrop(i);
                                                            setIsCropModalOpen(true);
                                                            setCrop({ x: 0, y: 0 });
                                                            setZoom(1);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        {member.photoUrl && (
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = member.photoUrl;
                                                    link.download = `foto-${member.name.replace(/\s+/g, '-').toLowerCase() || 'membro'}`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="w-10 h-[38px] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
                                                title="Baixar foto para o computador"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">download</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setTeam(team.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors mb-[1px]">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setTeam([...team, { name: "", role: "", photoUrl: "" }])}
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            Adicionar membro
                        </button>
                        <button onClick={saveTeam} disabled={saving} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">{saving ? "hourglass_empty" : "save"}</span>
                            {saving ? "Salvando..." : "Salvar Equipe"}
                        </button>
                    </div>
                )}

                {/* ========== DEPOIMENTOS ========== */}
                {activeTab === "testimonials" && (
                    <div className="space-y-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie os depoimentos de clientes exibidos no site.</p>
                        {testimonials.map((review, i) => (
                            <div key={i} className="flex flex-wrap gap-3 items-end p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div className="w-full sm:w-auto flex-1 min-w-[150px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nome</label>
                                    <input
                                        value={review.name}
                                        onChange={(e) => {
                                            const n = [...testimonials]; n[i] = { ...n[i], name: e.target.value }; setTestimonials(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div className="w-20">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nota</label>
                                    <select
                                        value={review.rating}
                                        onChange={(e) => {
                                            const n = [...testimonials]; n[i] = { ...n[i], rating: parseFloat(e.target.value) }; setTestimonials(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                                    >
                                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(v => <option key={v} value={v}>{v} ★</option>)}
                                    </select>
                                </div>
                                <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Depoimento</label>
                                    <input
                                        value={review.text}
                                        onChange={(e) => {
                                            const n = [...testimonials]; n[i] = { ...n[i], text: e.target.value }; setTestimonials(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <div className="w-28">
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Fonte</label>
                                    <input
                                        value={review.source}
                                        onChange={(e) => {
                                            const n = [...testimonials]; n[i] = { ...n[i], source: e.target.value }; setTestimonials(n)
                                        }}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/30 outline-none"
                                    />
                                </div>
                                <button onClick={() => setTestimonials(testimonials.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setTestimonials([...testimonials, { name: "", rating: 5, text: "", source: "Google" }])}
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_comment</span>
                            Adicionar depoimento
                        </button>
                        <button onClick={saveTestimonials} disabled={saving} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">{saving ? "hourglass_empty" : "save"}</span>
                            {saving ? "Salvando..." : "Salvar Depoimentos"}
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Corte de Imagem */}
            {isCropModalOpen && imageToCrop && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">crop</span>
                                Ajustar Foto
                            </h3>
                            <button
                                onClick={() => { setIsCropModalOpen(false); setImageToCrop(null); }}
                                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="relative flex-1 bg-slate-100 dark:bg-slate-950 min-h-[300px] sm:min-h-[400px]">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                                        Zoom
                                    </span>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => { setIsCropModalOpen(false); setImageToCrop(null); }}
                                    className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleApplyCrop}
                                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                    Aplicar Corte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
