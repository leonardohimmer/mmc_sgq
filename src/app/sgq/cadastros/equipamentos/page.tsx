"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { addMonths, format, parseISO, isValid } from "date-fns"

interface MonitoringRow {
    label: string;
    values: string[];
}

interface MonitoringSection {
    title: string;
    columns: string[];
    rows: MonitoringRow[];
}

export default function CadastroEquipamentoPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        manufacturer: "",
        model: "",
        serialNumber: "",
        range: "",
        testType: "",
        location: "",
        lab: "",
        certificateNumber: [""] as string[],
        serviceType: [""] as string[],
        calibrationValue: [""] as string[],
        lastCalibrationDate: "",
        nextCalibrationDate: "",
        calibrationInterval: "12",
        notes: "",
        status: "ATIVO",
        monitoringData: [] as MonitoringSection[]
    })

    const [editId, setEditId] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const id = params.get('id')
            if (id) {
                setEditId(id)
                fetchEquipment(id)
            }
        }
    }, [])

    // Cálculo automático da próxima calibração
    useEffect(() => {
        if (formData.lastCalibrationDate && formData.calibrationInterval) {
            try {
                const lastDate = parseISO(formData.lastCalibrationDate)
                const interval = parseInt(formData.calibrationInterval)
                
                if (isValid(lastDate) && !isNaN(interval)) {
                    const nextDate = addMonths(lastDate, interval)
                    const formattedNextDate = format(nextDate, "yyyy-MM-dd")
                    
                    if (formattedNextDate !== formData.nextCalibrationDate) {
                        setFormData(prev => ({ ...prev, nextCalibrationDate: formattedNextDate }))
                    }
                }
            } catch (err) {
                console.error("Erro ao calcular data:", err)
            }
        }
    }, [formData.lastCalibrationDate, formData.calibrationInterval])

    async function fetchEquipment(id: string) {
        setLoading(true)
        try {
            const res = await fetch("/api/equipamentos")
            if (res.ok) {
                const data = await res.json()
                const eq = data.find((e: any) => e.id === id)
                if (eq) {
                    setFormData({
                        code: eq.code || "",
                        name: eq.name || "",
                        manufacturer: eq.manufacturer || "",
                        model: eq.model || "",
                        serialNumber: eq.serialNumber || "",
                        range: eq.range || "",
                        testType: eq.testType || "",
                        location: eq.location || "",
                        lab: eq.lab || "",
                        certificateNumber: (Array.isArray(eq.certificateNumber) && eq.certificateNumber.length > 0) ? eq.certificateNumber : (eq.certificateNumber && typeof eq.certificateNumber === 'string' ? [eq.certificateNumber] : [""]),
                        serviceType: (Array.isArray(eq.serviceType) && eq.serviceType.length > 0) ? eq.serviceType : (eq.serviceType && typeof eq.serviceType === 'string' ? [eq.serviceType] : [""]),
                        calibrationValue: (Array.isArray(eq.calibrationValue) && eq.calibrationValue.length > 0) 
                            ? eq.calibrationValue.map((v: any) => (v !== null && v !== undefined) ? v.toString() : "") 
                            : [""] ,
                        lastCalibrationDate: eq.lastCalibrationDate ? eq.lastCalibrationDate.split('T')[0] : "",
                        nextCalibrationDate: eq.nextCalibrationDate ? eq.nextCalibrationDate.split('T')[0] : "",
                        calibrationInterval: eq.calibrationInterval?.toString() || "12",
                        notes: eq.notes || "",
                        status: eq.status || "ATIVO",
                        monitoringData: eq.monitoringData || []
                    })
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleArrayChange = (index: number, value: string, field: 'certificateNumber' | 'serviceType' | 'calibrationValue') => {
        setFormData(prev => {
            const newArray = [...prev[field]]
            newArray[index] = value
            return { ...prev, [field]: newArray }
        })
    }

    const addArrayItem = (field: 'certificateNumber' | 'serviceType' | 'calibrationValue') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], ""]
        }))
    }

    const removeArrayItem = (index: number, field: 'certificateNumber' | 'serviceType' | 'calibrationValue') => {
        setFormData(prev => {
            if (prev[field].length <= 1) return prev
            const newArray = [...prev[field]]
            newArray.splice(index, 1)
            return { ...prev, [field]: newArray }
        })
    }

    // Funções para Monitoramento Dinâmico
    const addMonitoringSection = () => {
        setFormData(prev => ({
            ...prev,
            monitoringData: [
                ...prev.monitoringData,
                {
                    title: "Nova Seção de Monitoramento",
                    columns: ["Ano/Ref"],
                    rows: [{ label: "Ponto 1", values: [""] }]
                }
            ]
        }))
    }

    const removeMonitoringSection = (sIndex: number) => {
        setFormData(prev => ({
            ...prev,
            monitoringData: prev.monitoringData.filter((_, i) => i !== sIndex)
        }))
    }

    const updateSectionTitle = (sIndex: number, title: string) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            newData[sIndex].title = title
            return { ...prev, monitoringData: newData }
        })
    }

    const addMonitoringColumn = (sIndex: number) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            section.columns = [...section.columns, `Coluna ${section.columns.length + 1}`]
            section.rows = section.rows.map(row => ({
                ...row,
                values: [...row.values, ""]
            }))
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const removeMonitoringColumn = (sIndex: number, cIndex: number) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            if (section.columns.length <= 1) return prev
            section.columns = section.columns.filter((_, i) => i !== cIndex)
            section.rows = section.rows.map(row => ({
                ...row,
                values: row.values.filter((_, i) => i !== cIndex)
            }))
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const updateMonitoringColumnHeader = (sIndex: number, cIndex: number, value: string) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            section.columns[cIndex] = value
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const addMonitoringRow = (sIndex: number) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            section.rows = [...section.rows, { 
                label: `Ponto ${section.rows.length + 1}`, 
                values: Array(section.columns.length).fill("") 
            }]
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const removeMonitoringRow = (sIndex: number, rIndex: number) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            if (section.rows.length <= 1) return prev
            section.rows = section.rows.filter((_, i) => i !== rIndex)
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const updateMonitoringRowLabel = (sIndex: number, rIndex: number, label: string) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            section.rows[rIndex].label = label
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const updateMonitoringCellValue = (sIndex: number, rIndex: number, vIndex: number, value: string) => {
        setFormData(prev => {
            const newData = [...prev.monitoringData]
            const section = { ...newData[sIndex] }
            section.rows[rIndex].values[vIndex] = value
            newData[sIndex] = section
            return { ...prev, monitoringData: newData }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const url = editId ? `/api/equipamentos/${editId}` : "/api/equipamentos"
            const method = editId ? "PATCH" : "POST"

            // Calcular status automaticamente
            let calculatedStatus = formData.status;
            if (formData.nextCalibrationDate) {
                const nextDate = new Date(formData.nextCalibrationDate + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (nextDate < today) {
                    calculatedStatus = "VENCIDO";
                } else if (formData.status === "VENCIDO" || !formData.status) {
                    calculatedStatus = "ATIVO";
                }
            }

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    certificateNumber: formData.certificateNumber.filter(c => c.trim() !== ""),
                    serviceType: formData.serviceType.filter(s => s.trim() !== ""),
                    calibrationValue: formData.calibrationValue.filter(v => v.trim() !== "").map(v => parseFloat(v)),
                    calibrationInterval: formData.calibrationInterval ? parseInt(formData.calibrationInterval) : null,
                    status: calculatedStatus
                }),
            })

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/sgq/equipamentos")
                }, 2000)
            } else {
                const data = await res.json()
                setError(data.error || "Erro ao salvar equipamento")
            }
        } catch (err) {
            setError("Ocorreu um erro ao processar a solicitação")
        } finally {
            setLoading(false)
        }
    }

    const allowedRoles = ["ADMIN", "DIRETOR", "QUALIDADE", "RESPONSÁVEL TÉCNICO", "DESENVOLVEDOR"]
    const userRole = session?.user?.role || ""
    const userRoles = userRole.split(",").map(r => r.trim())
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role))

    if (!isAuthorized && session) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center">
                <span className="material-symbols-outlined text-4xl mb-2">lock</span>
                <h1 className="text-xl font-bold">Acesso Negado</h1>
                <p>Você não tem permissão para acessar esta página de cadastro.</p>
            </div>
        )
    }

    return (
        <div className="max-w-full mx-auto px-4 md:px-10 space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">construction</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                            {editId ? "Editar Equipamento" : "Cadastro de Equipamento"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {editId ? `Atualizando informações de ${formData.code}` : "Insira as informações técnicas do novo recurso."}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                    {/* Seção 1: Identificação */}
                    <div className="space-y-6 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Identificação Básica
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Código ID*</label>
                                <input
                                    required
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="Ex: CA-001"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-3 space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Descrição / Nome do Equipamento*</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Medidor de nível de pressão sonora"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Especificações */}
                    <div className="space-y-6 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Especificações Técnicas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Fabricante</label>
                                <input
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleChange}
                                    placeholder="Ex: Bruel Kjaer"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Modelo</label>
                                <input
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="Ex: 2270"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Nº de Série</label>
                                <input
                                    name="serialNumber"
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                    placeholder="Ex: 3003751"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Faixa / Capacidade</label>
                                <input
                                    name="range"
                                    value={formData.range}
                                    onChange={handleChange}
                                    placeholder="Ex: 0 a 140 dB"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Tipo de Ensaio</label>
                                <input
                                    name="testType"
                                    value={formData.testType}
                                    onChange={handleChange}
                                    placeholder="Ex: Acústica"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Localização</label>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Ex: Sala de Equipamentos"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção 3: Calibração */}
                <div className="space-y-8 bg-slate-50/50 dark:bg-slate-800/20 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Controle de Calibração
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Laboratório</label>
                            <input
                                name="lab"
                                value={formData.lab}
                                onChange={handleChange}
                                placeholder="Ex: Lacel B&K"
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Última Calibração</label>
                            <input
                                type="date"
                                name="lastCalibrationDate"
                                value={formData.lastCalibrationDate}
                                onChange={handleChange}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Periodicidade (Meses)</label>
                            <input
                                type="number"
                                name="calibrationInterval"
                                value={formData.calibrationInterval}
                                onChange={handleChange}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Próxima Calibração</label>
                            <input
                                type="date"
                                name="nextCalibrationDate"
                                value={formData.nextCalibrationDate}
                                onChange={handleChange}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 lg:col-span-1">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Status Atual</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="ATIVO">ATIVO</option>
                                <option value="VENCIDO">VENCIDO</option>
                                <option value="DANIFICADO">FORA DE USO / OBSOLETO</option>
                                <option value="EM CALIBRAÇÃO">EM CALIBRAÇÃO</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Certificados */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Nº do Certificado</label>
                                <button 
                                    type="button" 
                                    onClick={() => addArrayItem('certificateNumber')}
                                    className="text-[10px] font-black uppercase text-primary hover:text-teal-500 flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                    Adicionar
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.certificateNumber.map((cert, index) => (
                                    <div key={index} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                                        <input
                                            value={cert}
                                            onChange={(e) => handleArrayChange(index, e.target.value, 'certificateNumber')}
                                            placeholder="Ex: CBR2500549"
                                            className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        {formData.certificateNumber.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeArrayItem(index, 'certificateNumber')}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Serviços */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Tipo de Serviço</label>
                                <button 
                                    type="button" 
                                    onClick={() => addArrayItem('serviceType')}
                                    className="text-[10px] font-black uppercase text-primary hover:text-teal-500 flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                    Adicionar
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.serviceType.map((service, index) => (
                                    <div key={index} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                                        <input
                                            value={service}
                                            onChange={(e) => handleArrayChange(index, e.target.value, 'serviceType')}
                                            placeholder="Ex: Calibração"
                                            className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        {formData.serviceType.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeArrayItem(index, 'serviceType')}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Valores */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Valor da Calibração (R$)</label>
                                <button 
                                    type="button" 
                                    onClick={() => addArrayItem('calibrationValue')}
                                    className="text-[10px] font-black uppercase text-primary hover:text-teal-500 flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                    Adicionar
                                </button>
                            </div>
                            <div className="space-y-2 min-h-[40px]">
                                {(formData.calibrationValue.length > 0 ? formData.calibrationValue : [""]).map((val, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={val}
                                            onChange={(e) => handleArrayChange(index, e.target.value.replace(',', '.'), 'calibrationValue')}
                                            placeholder="0.00"
                                            className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        {formData.calibrationValue.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => removeArrayItem(index, 'calibrationValue')}
                                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção 4: Monitoramento do Equipamento */}
                <div className="space-y-8 bg-slate-50/50 dark:bg-slate-800/20 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                Monitoramento do Equipamento
                            </h2>
                            <p className="text-[10px] text-slate-500 font-medium">Acompanhamento histórico de performance e calibração.</p>
                        </div>
                        <button 
                            type="button"
                            onClick={addMonitoringSection}
                            className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
                        >
                            <span className="material-symbols-outlined text-lg">add_box</span>
                            Nova Tabela
                        </button>
                    </div>

                    {formData.monitoringData.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">monitoring</span>
                            <p className="text-sm text-slate-400">Nenhuma tabela de monitoramento configurada.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {formData.monitoringData.map((section, sIndex) => (
                                <div key={sIndex} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between gap-4">
                                        <input 
                                            value={section.title}
                                            onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                                            placeholder="Título da Tabela (Ex: Faixa calibração tração [kgf])"
                                            className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 text-sm font-bold focus:border-primary outline-none py-1 transition-all"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeMonitoringSection(sIndex)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                            title="Remover Tabela"
                                        >
                                            <span className="material-symbols-outlined">delete_sweep</span>
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="bg-emerald-600 text-white">
                                                    <th className="p-3 text-[10px] font-black uppercase tracking-wider border-r border-emerald-500/30 w-40 text-center">
                                                        Pontos / Ano
                                                    </th>
                                                    {section.columns.map((col, cIndex) => (
                                                        <th key={cIndex} className="p-3 text-[10px] font-black uppercase tracking-wider border-r border-emerald-500/30 relative group min-w-[100px]">
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    value={col}
                                                                    onChange={(e) => updateMonitoringColumnHeader(sIndex, cIndex, e.target.value)}
                                                                    className="bg-transparent border-none text-white text-[10px] font-black w-full focus:ring-1 focus:ring-white/50 rounded outline-none text-center"
                                                                />
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removeMonitoringColumn(sIndex, cIndex)}
                                                                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-emerald-200 hover:text-white transition-opacity"
                                                                >
                                                                    <span className="material-symbols-outlined text-xs">close</span>
                                                                </button>
                                                            </div>
                                                        </th>
                                                    ))}
                                                    <th className="p-3 w-10 text-center">
                                                        <button 
                                                            type="button"
                                                            onClick={() => addMonitoringColumn(sIndex)}
                                                            className="text-white hover:scale-110 transition-transform"
                                                            title="Adicionar Coluna"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add_circle</span>
                                                        </button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-900">
                                                {section.rows.map((row, rIndex) => (
                                                    <tr key={rIndex} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="p-2 border-r border-slate-100 dark:border-slate-800 group relative">
                                                            <div className="flex items-center gap-2">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removeMonitoringRow(sIndex, rIndex)}
                                                                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                                                                </button>
                                                                <input 
                                                                    value={row.label}
                                                                    onChange={(e) => updateMonitoringRowLabel(sIndex, rIndex, e.target.value)}
                                                                    className="w-full bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-0 outline-none"
                                                                />
                                                            </div>
                                                        </td>
                                                        {row.values.map((val, vIndex) => (
                                                            <td key={vIndex} className="p-2 border-r border-slate-100 dark:border-slate-800">
                                                                <input 
                                                                    value={val}
                                                                    onChange={(e) => updateMonitoringCellValue(sIndex, rIndex, vIndex, e.target.value)}
                                                                    className="w-full bg-transparent border-none text-xs text-center text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-primary/20 rounded outline-none"
                                                                    placeholder="-"
                                                                />
                                                            </td>
                                                        ))}
                                                        <td className="p-2"></td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan={section.columns.length + 2} className="p-2">
                                                        <button 
                                                            type="button"
                                                            onClick={() => addMonitoringRow(sIndex)}
                                                            className="w-full py-1.5 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-primary hover:border-primary transition-all text-[10px] font-bold uppercase flex items-center justify-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add</span>
                                                            Adicionar Linha
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Seção 5: Outros */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Informações Adicionais
                    </h2>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-1">Observações</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Notas importantes sobre o equipamento..."
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Equipamento cadastrado com sucesso! Redirecionando...
                        </div>
                    )}
                    
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all w-full sm:w-auto text-center"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-teal-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            {loading ? "Salvando..." : "Salvar Equipamento"}
                            {!loading && <span className="material-symbols-outlined text-[18px]">save</span>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
