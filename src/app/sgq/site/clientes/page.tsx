"use client"

import { useEffect, useState, useCallback } from "react"
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg } from "@/lib/imageUtils"

interface ClientItem {
    name: string
    logoUrl: string
    link?: string
}

export default function ClientsAdminPage() {
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState<ClientItem[]>([])

    // Image Cropping State
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [clientIndexToCrop, setClientIndexToCrop] = useState<number | null>(null)
    const [isCropModalOpen, setIsCropModalOpen] = useState(false)
    const [aspect, setAspect] = useState<number | undefined>(undefined)

    const handleApplyCrop = async () => {
        if (imageToCrop && completedCrop && clientIndexToCrop !== null) {
            try {
                const croppedBase64 = await getCroppedImg(imageToCrop, completedCrop)
                const n = [...clients]
                n[clientIndexToCrop] = { ...n[clientIndexToCrop], logoUrl: croppedBase64 }
                setClients(n)
                setIsCropModalOpen(false)
                setImageToCrop(null)
                setClientIndexToCrop(null)
            } catch (e) {
                console.error("Erro ao cortar imagem:", e)
            }
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget
        const initialCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect || 1,
                width,
                height
            ),
            width,
            height
        )
        setCrop(initialCrop)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setImageToCrop(reader.result as string)
                setClientIndexToCrop(index)
                setCrop(undefined) // Reset crop for new image
                setIsCropModalOpen(true)
            }
            reader.readAsDataURL(file)
        }
    }


    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/site-content")
            if (res.ok) {
                const data = await res.json()
                if (data.clients) {
                    setClients(data.clients.items || [])
                }
            }
        } catch (e) {
            console.error("Erro ao carregar clientes:", e)
        } finally {
            setLoading(false)
        }
    }

    const saveClients = async () => {
        setSaving(true)
        setMessage("")
        try {
            const res = await fetch("/api/site-content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section: "clients", data: { items: clients } }),
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
                        <span className="material-symbols-outlined text-primary text-3xl">business</span>
                        Gerenciar Clientes (Construtoras)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Gerencie os logotipos das construtoras exibidos no carrossel de clientes
                    </p>
                </div>
                {message && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold ${message.includes("✅") ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Estes clientes aparecerão no carrossel horizontal abaixo da equipe na página Sobre.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {clients.map((client, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2 relative group">
                            <button 
                                onClick={() => setClients(clients.filter((_, idx) => idx !== i))}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Remover cliente"
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>

                            <div className="aspect-square bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden flex items-center justify-center p-2 relative">
                                {client.logoUrl ? (
                                    <img src={client.logoUrl} alt={client.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-slate-400">
                                        <span className="material-symbols-outlined text-2xl">image</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Sem Logo</span>
                                    </div>
                                )}
                                
                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white flex-col gap-1">
                                    <span className="material-symbols-outlined text-[20px]">upload_file</span>
                                    <span className="text-[9px] font-bold uppercase">Trocar Logo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, i)}
                                    />
                                </label>
                            </div>

                            <input
                                value={client.name}
                                placeholder="Nome"
                                onChange={(e) => {
                                    const n = [...clients]; n[i] = { ...n[i], name: e.target.value }; setClients(n)
                                }}
                                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/30 outline-none text-xs"
                            />

                            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900">
                                <span className="material-symbols-outlined text-[14px] text-slate-400 flex-shrink-0">link</span>
                                <input
                                    value={client.link || ""}
                                    placeholder="URL (opcional)"
                                    onChange={(e) => {
                                        const n = [...clients]; n[i] = { ...n[i], link: e.target.value }; setClients(n)
                                    }}
                                    className="w-full bg-transparent text-slate-700 dark:text-slate-300 outline-none text-xs placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setClients([...clients, { name: "", logoUrl: "", link: "" }])}
                        className="p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary min-h-[140px]"
                    >
                        <span className="material-symbols-outlined text-3xl">add_circle</span>
                        <span className="font-bold text-xs text-center">Adicionar Nova Construtora</span>
                    </button>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={saveClients} 
                        disabled={saving} 
                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">{saving ? "hourglass_empty" : "save"}</span>
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </div>

            {isCropModalOpen && imageToCrop && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Ajustar Logotipo</h3>
                                <p className="text-sm text-gray-500">Arraste as bordas para ajustar o corte</p>
                            </div>
                            <button
                                onClick={() => setIsCropModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 relative bg-gray-50 overflow-auto flex items-center justify-center p-8 min-h-[400px]">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                                className="max-h-full"
                            >
                                <img 
                                    src={imageToCrop} 
                                    onLoad={onImageLoad}
                                    alt="Crop me" 
                                    className="max-w-full max-h-[60vh] object-contain shadow-lg"
                                />
                            </ReactCrop>
                        </div>

                        <div className="p-6 bg-white border-t border-gray-100 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 mr-2">Proporção:</span>
                                {[
                                    { label: 'Livre', value: undefined },
                                    { label: '1:1 (Quadrado)', value: 1 },
                                    { label: '3:2', value: 3/2 },
                                    { label: '16:9', value: 16/9 },
                                    { label: '21:9', value: 21/9 },
                                ].map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setAspect(opt.value)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            aspect === opt.value
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCropModalOpen(false)}
                                    className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleApplyCrop}
                                    className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Confirmar Ajuste
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
