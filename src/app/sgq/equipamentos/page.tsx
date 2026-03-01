"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type Equipment = {
    id: string
    code: string
    name: string
    manufacturer: string
    status: string
    lastCalibrationDate: string
    nextCalibrationDate: string
    calibrationInterval: number
}

export default function EquipamentosPage() {
    const { data: session } = useSession()
    const [equipments, setEquipments] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)

    // Form modal state
    const [isOpen, setIsOpen] = useState(false)
    const [formMode, setFormMode] = useState<"CREATE" | "CALIBRATE">("CREATE")
    const [currentId, setCurrentId] = useState("")

    // Form fields
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [manufacturer, setManufacturer] = useState("")
    const [nextCal, setNextCal] = useState("")

    useEffect(() => {
        fetchEquipments()
    }, [])

    const fetchEquipments = async () => {
        try {
            const res = await fetch("/api/equipamentos")
            if (res.ok) {
                const data = await res.json()
                setEquipments(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const clearForm = () => {
        setCode("")
        setName("")
        setManufacturer("")
        setNextCal("")
        setCurrentId("")
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/equipamentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    name,
                    manufacturer,
                    nextCalibrationDate: nextCal,
                    status: "ATIVO"
                }),
            })
            if (res.ok) {
                setIsOpen(false)
                clearForm()
                fetchEquipments()
            } else {
                alert("Erro ao criar equipamento (Você tem permissão?)")
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleCalibrate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/equipamentos/${currentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "ATIVO",
                    lastCalibrationDate: new Date().toISOString(),
                    nextCalibrationDate: nextCal,
                }),
            })
            if (res.ok) {
                setIsOpen(false)
                clearForm()
                fetchEquipments()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const openCalibrate = (eq: Equipment) => {
        setFormMode("CALIBRATE")
        setCurrentId(eq.id)
        setName(eq.name)
        setCode(eq.code)
        setNextCal("")
        setIsOpen(true)
    }

    const openCreate = () => {
        setFormMode("CREATE")
        clearForm()
        setIsOpen(true)
    }

    const isAuthorized = ["ADMIN", "DIREÇÃO", "QUALIDADE", "RESPONSÁVEL TÉCNICO"].includes(session?.user?.role || "")

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Equipamentos e Calibração</h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Controle de calibração metrológica com bloqueio automático (Status VENCIDO).
                    </p>
                </div>
                {isAuthorized && (
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-primary hover:bg-teal-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/20 font-bold text-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Novo Equipamento
                    </button>
                )}
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 font-medium">
                        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Código</th>
                                <th className="px-6 py-4">Equipamento</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Últ. Calibração</th>
                                <th className="px-6 py-4">Vencimento</th>
                                <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 font-bold text-slate-400">Carregando equipamentos...</td>
                                </tr>
                            ) : equipments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 font-bold text-slate-400">Nenhum equipamento cadastrado.</td>
                                </tr>
                            ) : equipments.map((eq) => (
                                <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-primary">{eq.code}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-extrabold text-slate-900">{eq.name}</div>
                                        <div className="text-xs text-slate-500 font-medium">{eq.manufacturer || "N/A"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase font-extrabold tracking-wider border ${eq.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                eq.status === 'VENCIDO' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                            }`}>
                                            {eq.status === 'VENCIDO' ? <span className="material-symbols-outlined text-[14px] mr-1">warning</span> : <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span>}
                                            {eq.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {eq.lastCalibrationDate ? new Date(eq.lastCalibrationDate).toLocaleDateString("pt-BR") : "Nunca"}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {eq.nextCalibrationDate ? new Date(eq.nextCalibrationDate).toLocaleDateString("pt-BR") : "N/D"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {isAuthorized && (
                                            <button
                                                onClick={() => openCalibrate(eq)}
                                                className="inline-flex items-center justify-center p-2 rounded-xl text-primary hover:bg-primary/10 transition-colors"
                                                title="Calibrar"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">build</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Criação / Calibração */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-extrabold text-slate-900">
                                {formMode === "CREATE" ? "Cadastrar Equipamento" : "Atualizar Calibração"}
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">cancel</span>
                            </button>
                        </div>

                        <form onSubmit={formMode === "CREATE" ? handleCreate : handleCalibrate} className="space-y-4">
                            {formMode === "CREATE" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Código ID</label>
                                        <input required type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-slate-400" placeholder="Ex: EQ-001" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Nome</label>
                                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-slate-400" placeholder="Ex: Multímetro Digital" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Fabricante</label>
                                        <input type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-slate-400" placeholder="Marca/Modelo" />
                                    </div>
                                </>
                            )}

                            {formMode === "CALIBRATE" && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-sm text-slate-600">
                                    Calibrando equipamento: <strong className="text-slate-900">{code} - {name}</strong><br />
                                    <em className="text-xs text-slate-400 font-medium mt-1 block">A data de "Última Calibração" será atualizada para agora automaticamente.</em>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Data de Vencimento da Calibração</label>
                                <input required type="date" value={nextCal} onChange={e => setNextCal(e.target.value)} className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>

                            <button type="submit" className="w-full py-3 px-4 bg-primary hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 mt-6 flex justify-center items-center gap-2">
                                {formMode === "CREATE" ? "Salvar Equipamento" : "Confirmar Calibração"}
                                <span className="material-symbols-outlined text-[18px]">check</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
