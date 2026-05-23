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
    const [activeTab, setActiveTab] = useState<"history" | "stats" | "team" | "testimonials" | "ensaio_fotos">("history")
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
    const [cropMode, setCropMode] = useState<"team" | "ensaio">("team")
    const [ensaioPhotoIndexToCrop, setEnsaioPhotoIndexToCrop] = useState<number | null>(null)
    const [ensaioFotos, setEnsaioFotos] = useState<Record<string, string[]>>({})
    const [selectedCategory, setSelectedCategory] = useState<"campo" | "laboratorio">("campo")
    const [selectedAssayId, setSelectedAssayId] = useState<string>("campo-acustica")

    const ensaiosList = {
        campo: [
            { id: "campo-acustica", label: "Acústica em Campo" },
            { id: "campo-guarda-corpo", label: "Guarda-corpos e Corrimãos" },
            { id: "campo-aderencia", label: "Aderência à Tração" },
            { id: "campo-pit", label: "Integridade de Estacas (PIT)" },
            { id: "campo-ancoragem", label: "Teste de Ancoragem (Arrancamento)" },
            { id: "campo-permeabilidade", label: "Permeabilidade e Estanqueidade" },
            { id: "campo-esclerometria", label: "Esclerometria no Concreto" },
            { id: "campo-luminico", label: "Ensaio Lumínico" },
            { id: "campo-impacto", label: "Impacto de Corpo Mole e Duro" },
            { id: "campo-pecas-suspensas", label: "Ensaio de Peças Suspensas" },
            { id: "campo-inspecao-fachada", label: "Inspeção de Fachadas" },
            { id: "campo-percussao", label: "Ensaio de Percussão" },
            { id: "campo-termografia", label: "Inspeção Termográfica" }
        ],
        laboratorio: [
            { id: "laboratorio-guarda-corpo", label: "Ensaio de guarda-corpo e parapeito" },
            { id: "laboratorio-isolamento-acustico", label: "Ensaio de Isolamento Acústico em Laboratório (Rw)" },
            { id: "laboratorio-aderencia", label: "Ensaio de resistência de aderência à tração" }
        ]
    }

    const handleCategoryChange = (cat: "campo" | "laboratorio") => {
        setSelectedCategory(cat)
        const firstId = cat === "campo" ? "campo-acustica" : "laboratorio-guarda-corpo"
        setSelectedAssayId(firstId)
    }

    const handleRemovePhoto = (idx: number) => {
        const currentList = ensaioFotos[selectedAssayId] || []
        const updatedList = currentList.filter((_, i) => i !== idx)
        setEnsaioFotos({
            ...ensaioFotos,
            [selectedAssayId]: updatedList
        })
    }

    const onCropComplete = useCallback((_area: any, pixels: any) => {
        setCroppedAreaPixels(pixels)
    }, [])

    const handleApplyCrop = async () => {
        if (imageToCrop && croppedAreaPixels) {
            try {
                const croppedBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels)
                if (cropMode === "team" && memberIndexToCrop !== null) {
                    const n = [...team]
                    n[memberIndexToCrop] = { ...n[memberIndexToCrop], photoUrl: croppedBase64 }
                    setTeam(n)
                } else if (cropMode === "ensaio") {
                    const currentList = ensaioFotos[selectedAssayId] || []
                    let updatedList = []
                    if (ensaioPhotoIndexToCrop !== null) {
                        updatedList = [...currentList]
                        updatedList[ensaioPhotoIndexToCrop] = croppedBase64
                    } else {
                        updatedList = [...currentList, croppedBase64]
                    }
                    setEnsaioFotos({
                        ...ensaioFotos,
                        [selectedAssayId]: updatedList
                    })
                }
                setIsCropModalOpen(false)
                setImageToCrop(null)
                setMemberIndexToCrop(null)
                setEnsaioPhotoIndexToCrop(null)
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
                if (data.ensaio_fotos) {
                    setEnsaioFotos(data.ensaio_fotos || {})
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
    const saveEnsaioFotos = () => saveSection("ensaio_fotos", ensaioFotos)

    const tabs = [
        { key: "history" as const, label: "História", icon: "history_edu" },
        { key: "stats" as const, label: "Indicadores", icon: "trending_up" },
        { key: "team" as const, label: "Equipe", icon: "groups" },
        { key: "testimonials" as const, label: "Depoimentos", icon: "reviews" },
        { key: "ensaio_fotos" as const, label: "Fotos dos Ensaios", icon: "camera" },
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
                                                            setCropMode("team");
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

                {/* ========== FOTOS DOS ENSAIOS ========== */}
                {activeTab === "ensaio_fotos" && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <div className="space-y-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Modalidade</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleCategoryChange("campo")}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === "campo"
                                                ? "bg-primary text-slate-950 shadow-md shadow-primary/20"
                                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        Ensaios em Campo
                                    </button>
                                    <button
                                        onClick={() => handleCategoryChange("laboratorio")}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                            selectedCategory === "laboratorio"
                                                ? "bg-primary text-slate-950 shadow-md shadow-primary/20"
                                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        Ensaios em Laboratório
                                    </button>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Selecione o Ensaio</label>
                                <select
                                    value={selectedAssayId}
                                    onChange={(e) => setSelectedAssayId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                                >
                                    {ensaiosList[selectedCategory].map((ensaio) => (
                                        <option key={ensaio.id} value={ensaio.id}>
                                            {ensaio.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Galeria de Fotos */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                Fotos Cadastradas ({ (ensaioFotos[selectedAssayId] || []).length })
                            </h4>

                            { (ensaioFotos[selectedAssayId] || []).length === 0 ? (
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-3xl py-12 px-4 text-center flex flex-col items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-5xl">no_photography</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Nenhuma foto cadastrada para este ensaio.</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Carregue imagens reais do ensaio para exibir no site público.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {(ensaioFotos[selectedAssayId] || []).map((photo, idx) => (
                                        <div key={idx} className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-sm hover:shadow-md transition-all">
                                            <img src={photo} alt="" className="w-full h-full object-cover" />
                                            
                                            {/* Ações ao passar o mouse */}
                                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setImageToCrop(photo);
                                                        setCropMode("ensaio");
                                                        setEnsaioPhotoIndexToCrop(idx);
                                                        setIsCropModalOpen(true);
                                                        setCrop({ x: 0, y: 0 });
                                                        setZoom(1);
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center shadow transition-all hover:scale-105"
                                                    title="Ajustar / Cortar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">crop</span>
                                                </button>
                                                <button
                                                    onClick={() => handleRemovePhoto(idx)}
                                                    className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow transition-all hover:scale-105"
                                                    title="Excluir foto"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upload de Nova Foto */}
                        <div className="pt-2">
                            <label className="relative cursor-pointer block border-2 border-dashed border-[#00bfa5]/40 dark:border-teal-900/60 hover:border-[#00bfa5] dark:hover:border-teal-600 bg-[#00bfa5]/5 dark:bg-teal-950/10 rounded-3xl py-8 text-center transition-all group">
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">add_photo_alternate</span>
                                    <span className="text-sm font-bold group-hover:text-primary transition-colors">Carregar Nova Foto</span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">Escolha uma imagem do seu dispositivo (será ajustada para 16:9)</span>
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
                                                setCropMode("ensaio");
                                                setEnsaioPhotoIndexToCrop(null);
                                                setIsCropModalOpen(true);
                                                setCrop({ x: 0, y: 0 });
                                                setZoom(1);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* Botão de Salvar */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={saveEnsaioFotos}
                                disabled={saving}
                                className="px-6 py-3 bg-primary hover:bg-primary-hover text-slate-950 rounded-xl font-bold transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">{saving ? "hourglass_empty" : "save"}</span>
                                {saving ? "Salvando..." : "Salvar Fotos dos Ensaios"}
                            </button>
                        </div>
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
                                                aspect={cropMode === "team" ? 1 : 16 / 9}
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
