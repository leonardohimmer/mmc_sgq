"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useSession } from "next-auth/react"
import ConfirmModal from "@/components/ConfirmModal"
import SuccessModal from "@/components/SuccessModal"

type Equipment = {
    id: string
    code: string
    name: string
    manufacturer: string
    model: string
    serialNumber: string
    range: string
    testType: string
    location: string
    lab: string
    certificateNumber: string[]
    serviceType: string[]
    calibrationValue: number[]
    status: string
    acceptance: string
    lastCalibrationDate: string
    nextCalibrationDate: string
    calibrationInterval: number
    notes: string
}

export default function EquipamentosPage() {
    const { data: session } = useSession()
    const [equipments, setEquipments] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState<{ key: keyof Equipment; direction: 'asc' | 'desc' } | null>(null)
    const [testFilter, setTestFilter] = useState<string>("")
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
    const filterButtonRef = useRef<HTMLButtonElement>(null)

    // Modais
    const [isCalibOpen, setIsCalibOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [currentEq, setCurrentEq] = useState<Equipment | null>(null)
    const [calDate, setCalDate] = useState(new Date().toISOString().split('T')[0])
    const [interval, setIntervalValue] = useState<number | "">("")
    const [nextCal, setNextCal] = useState("")

    // Estados para os novos modais de confirmação e alerta
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string
        message: string
        onConfirm: () => void
        type?: 'danger' | 'primary' | 'warning'
    }>({
        title: "",
        message: "",
        onConfirm: () => {},
    })

    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successConfig, setSuccessConfig] = useState<{
        title: string
        message: string
        type?: 'success' | 'error' | 'info'
        autoClose?: boolean
    }>({
        title: "",
        message: "",
        type: 'success',
        autoClose: false
    })

    // Cálculo automático da próxima calibração
    useEffect(() => {
        if (calDate && interval) {
            const date = new Date(calDate)
            date.setMonth(date.getMonth() + Number(interval))
            setNextCal(date.toISOString().split('T')[0])
        }
    }, [calDate, interval])

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

    const requestSort = (key: keyof Equipment) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredEquipments = equipments.filter(eq => {
        const matchesSearch = 
            eq.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eq.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesTest = !testFilter || eq.testType === testFilter;
        
        return matchesSearch && matchesTest;
    });

    const sortedEquipments = [...filteredEquipments].sort((a, b) => {
        // Ordenação Padrão: CA primeiro, depois EQ, ambos numéricos
        if (!sortConfig) {
            const codeA = a.code || "";
            const codeB = b.code || "";
            
            const prefixA = codeA.startsWith("CA") ? 0 : 1;
            const prefixB = codeB.startsWith("CA") ? 0 : 1;
            
            if (prefixA !== prefixB) return prefixA - prefixB;
            
            const partsA = codeA.split("-");
            const partsB = codeB.split("-");
            
            const numA = parseInt(partsA[1]) || 0;
            const numB = parseInt(partsB[1]) || 0;
            
            if (numA !== numB) return numA - numB;
            
            const suffixA = partsA[2] || "";
            const suffixB = partsB[2] || "";
            
            return suffixA.localeCompare(suffixB);
        }

        const { key, direction } = sortConfig;
        let aValue = a[key];
        let bValue = b[key];

        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        }

        if (!session?.user || !isAuthorized) {
            return 0 // Placeholder logic for API constraint
        }

        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const uniqueTestTypes = Array.from(new Set(equipments.map(eq => eq.testType).filter(Boolean))).sort();

    const handleUpdateCalibration = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentEq) return

        try {
            const res = await fetch(`/api/equipamentos/${currentEq.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: new Date(nextCal) > new Date() ? "ATIVO" : "VENCIDO",
                    lastCalibrationDate: calDate,
                    nextCalibrationDate: nextCal,
                    calibrationInterval: interval || currentEq.calibrationInterval
                }),
            })
            if (res.ok) {
                setIsCalibOpen(false)
                fetchEquipments()
            } else {
                const errData = await res.json()
                setSuccessConfig({
                    title: "Erro ao salvar",
                    message: errData.error || 'Acesso negado',
                    type: 'error',
                    autoClose: true
                })
                setShowSuccessModal(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        
        setConfirmConfig({
            title: "Excluir Equipamento",
            message: "Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.",
            type: 'danger',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/equipamentos/${id}`, { method: "DELETE" })
                    if (res.ok) {
                        fetchEquipments()
                        setSuccessConfig({
                            title: "Excluído!",
                            message: "Equipamento removido com sucesso.",
                            type: 'success',
                            autoClose: true
                        })
                        setShowSuccessModal(true)
                    } else {
                        setSuccessConfig({
                            title: "Erro",
                            message: "Erro ao excluir equipamento.",
                            type: 'error',
                            autoClose: true
                        })
                        setShowSuccessModal(true)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        })
        setShowConfirmModal(true)
    }

    const toggleOutOfUse = async (e: React.MouseEvent, eq: Equipment) => {
        e.stopPropagation()
        const newStatus = eq.status === "DANIFICADO" ? "ATIVO" : "DANIFICADO"
        
        try {
            const res = await fetch(`/api/equipamentos/${eq.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            if (res.ok) {
                fetchEquipments()
            } else {
                setSuccessConfig({
                    title: "Erro",
                    message: "Erro ao atualizar status do equipamento.",
                    type: 'error',
                    autoClose: true
                })
                setShowSuccessModal(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const openCalibrate = (e: React.MouseEvent, eq: Equipment) => {
        e.stopPropagation()
        setCurrentEq(eq)
        setCalDate(new Date().toISOString().split('T')[0])
        setIntervalValue(eq.calibrationInterval || 12)
        setNextCal("")
        setIsCalibOpen(true)
    }

    const openDetails = (eq: Equipment) => {
        setCurrentEq(eq)
        setIsDetailOpen(true)
    }

    const allowedRoles = ["ADMIN", "DIRETOR", "QUALIDADE", "RESPONSÁVEL TÉCNICO", "DESENVOLVEDOR"]
    const userRole = session?.user?.role || ""
    const userRoles = userRole.split(",").map(r => r.trim())
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role))

    const SortIcon = ({ column }: { column: keyof Equipment }) => {
        if (sortConfig?.key !== column) {
            return <span className="material-symbols-outlined text-[14px] opacity-20">unfold_more</span>;
        }
        return sortConfig.direction === 'asc' ? 
            <span className="material-symbols-outlined text-[14px] text-primary">expand_less</span> : 
            <span className="material-symbols-outlined text-[14px] text-primary">expand_more</span>;
    };

    return (
        <div className="space-y-6 font-sans max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Equipamentos</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                            Gestão de Inventário
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative group w-full sm:w-auto">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input 
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-48 lg:w-64 transition-all"
                        />
                    </div>
                    {isAuthorized && (
                        <a
                            href="/sgq/cadastros/equipamentos"
                            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-primary hover:scale-[1.02] active:scale-95 text-white px-4 py-2.5 rounded-xl transition-all shadow-md font-black text-[11px] uppercase tracking-wider w-full sm:w-auto shrink-0"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Novo
                        </a>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-[2.5rem] flex flex-col overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-[13px] text-slate-600 dark:text-slate-400 font-medium border-collapse">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th 
                                    onClick={() => requestSort('code')}
                                    className="px-6 py-4 cursor-pointer hover:text-primary transition-colors group w-40"
                                >
                                    <div className="flex items-center gap-2">
                                        Identificação <SortIcon column="code" />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('name')}
                                    className="px-6 py-4 cursor-pointer hover:text-primary transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Nome / Descrição <SortIcon column="name" />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 relative group w-56"
                                >
                                    <div className="flex items-center gap-2">
                                        <div 
                                            onClick={() => requestSort('testType')}
                                            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                                        >
                                            Ensaio <SortIcon column="testType" />
                                        </div>
                                        
                                        <div className="relative">
                                            <button 
                                                ref={filterButtonRef}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!isFilterMenuOpen && filterButtonRef.current) {
                                                        const rect = filterButtonRef.current.getBoundingClientRect();
                                                        setMenuPosition({ 
                                                            top: rect.bottom + window.scrollY, 
                                                            left: rect.left + window.scrollX 
                                                        });
                                                    }
                                                    setIsFilterMenuOpen(!isFilterMenuOpen);
                                                }}
                                                className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${testFilter ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400'}`}
                                                title="Filtrar por Ensaio"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                                            </button>
                                            
                                            {isFilterMenuOpen && typeof document !== 'undefined' && createPortal(
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-[9998]" 
                                                        onClick={() => setIsFilterMenuOpen(false)}
                                                    />
                                                    <div 
                                                        className="fixed w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-[9999] animate-in fade-in zoom-in duration-200 shadow-primary/10 overflow-hidden"
                                                        style={{ 
                                                            top: menuPosition.top - window.scrollY + 8, 
                                                            left: Math.min(menuPosition.left - window.scrollX, window.innerWidth - 280)
                                                        }}
                                                    >
                                                        <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Filtrar por Ensaio</span>
                                                        </div>
                                                        
                                                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                            <button
                                                                onClick={() => {
                                                                    setTestFilter("");
                                                                    setIsFilterMenuOpen(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-all flex items-center justify-between ${!testFilter ? 'text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                            >
                                                                <span>Todos os Ensaios</span>
                                                                {!testFilter && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                                                            </button>
                                                            
                                                            {uniqueTestTypes.map(type => (
                                                                <button
                                                                    key={type}
                                                                    onClick={() => {
                                                                        setTestFilter(type);
                                                                        setIsFilterMenuOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-all flex items-center justify-between ${testFilter === type ? 'text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                                >
                                                                    <span>{type}</span>
                                                                    {testFilter === type && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>,
                                                document.body
                                            )}
                                        </div>
                                    </div>
                                </th>
                                <th onClick={() => requestSort('status')} className="px-6 py-4 text-center cursor-pointer hover:text-primary transition-colors group w-40">
                                    <div className="flex items-center justify-center gap-2">
                                        Status <SortIcon column="status" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right w-40">Operações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-32 font-bold text-slate-300">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <span className="tracking-widest uppercase text-[10px] font-black">Sincronizando inventário...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : sortedEquipments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-32 font-bold text-slate-300 uppercase tracking-widest text-[10px]">Nenhum registro localizado.</td>
                                </tr>
                            ) : sortedEquipments.map((eq) => {
                                const statusInfo = (() => {
                                    if (eq.status === 'DANIFICADO') return { isNear: false, isExpired: false, label: 'Fora de Uso' };
                                    if (!eq.nextCalibrationDate) return { isNear: false, isExpired: false, label: eq.status };
                                    
                                    const nextDate = new Date(eq.nextCalibrationDate);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const diffTime = nextDate.getTime() - today.getTime();
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    if (diffDays <= 0) return { isNear: false, isExpired: true, label: 'VENCIDO' };
                                    if (diffDays <= 30) return { isNear: true, isExpired: false, label: 'Vencimento Próximo' };
                                    return { isNear: false, isExpired: false, label: eq.status };
                                })();

                                return (
                                <tr 
                                    key={eq.id} 
                                    onClick={() => openDetails(eq)}
                                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer group relative ${eq.status === 'DANIFICADO' ? 'opacity-40 grayscale-[0.5]' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-black text-primary px-2.5 py-1 bg-primary/5 rounded-lg border border-primary/10">{eq.code}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors text-sm">{eq.name}</div>
                                        <div className="text-[11px] text-slate-400 mt-1 font-bold flex items-center gap-2">
                                            {eq.manufacturer || "Fabricante N/D"} 
                                            <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                                            {eq.model || "Modelo N/D"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-1">{eq.testType || "N/D"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.1em] border uppercase ${
                                            statusInfo.isNear ? 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse' :
                                            statusInfo.isExpired ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' :
                                            eq.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                                            'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:border-slate-500/20'
                                        }`}>
                                            {statusInfo.isNear ? (
                                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                            ) : statusInfo.isExpired ? (
                                                <span className="material-symbols-outlined text-[14px]">error</span>
                                            ) : (
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            )}
                                            {statusInfo.label}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={(e) => toggleOutOfUse(e, eq)}
                                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm ${
                                                    eq.status === 'DANIFICADO' 
                                                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-600 hover:text-white' 
                                                    : 'text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 hover:text-white'
                                                }`}
                                                title={eq.status === 'DANIFICADO' ? "Ativar Equipamento" : "Marcar como Fora de Uso / Danificado"}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {eq.status === 'DANIFICADO' ? 'build_circle' : 'block'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={(e) => openCalibrate(e, eq)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                title="Calibrar"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">verified</span>
                                            </button>
                                            <a
                                                href={`/sgq/cadastros/equipamentos?id=${eq.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all shadow-sm"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                            </a>
                                            <button
                                                onClick={(e) => handleDelete(e, eq.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Cards / Lista Mobile Premium */}
                <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-slate-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin"></div>
                                <span className="tracking-widest uppercase text-[10px] font-black">Sincronizando inventário...</span>
                            </div>
                        </div>
                    ) : sortedEquipments.length === 0 ? (
                        <div className="text-center py-20 font-bold text-slate-300 uppercase tracking-widest text-[10px]">
                            Nenhum registro localizado.
                        </div>
                    ) : (
                        sortedEquipments.map((eq) => {
                            const statusInfo = (() => {
                                if (eq.status === 'DANIFICADO') return { isNear: false, isExpired: false, label: 'Fora de Uso' };
                                if (!eq.nextCalibrationDate) return { isNear: false, isExpired: false, label: eq.status };
                                
                                const nextDate = new Date(eq.nextCalibrationDate);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const diffTime = nextDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays <= 0) return { isNear: false, isExpired: true, label: 'VENCIDO' };
                                if (diffDays <= 30) return { isNear: true, isExpired: false, label: 'Vencimento Próximo' };
                                return { isNear: false, isExpired: false, label: eq.status };
                            })();

                            return (
                                <div 
                                    key={eq.id}
                                    onClick={() => openDetails(eq)}
                                    className={`p-5 space-y-4 active:bg-slate-50 dark:active:bg-slate-800/30 transition-all ${eq.status === 'DANIFICADO' ? 'opacity-50 grayscale-[0.3]' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-black text-[10px] text-primary px-2 py-0.5 bg-primary/5 rounded-lg border border-primary/10">{eq.code}</span>
                                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black tracking-[0.05em] border uppercase ${
                                                    statusInfo.isNear ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    statusInfo.isExpired ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' :
                                                    eq.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                                                    'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:border-slate-500/20'
                                                }`}>
                                                    {statusInfo.isNear ? (
                                                        <span className="material-symbols-outlined text-[10px]">warning</span>
                                                    ) : statusInfo.isExpired ? (
                                                        <span className="material-symbols-outlined text-[10px]">error</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[10px]">check_circle</span>
                                                    )}
                                                    {statusInfo.label}
                                                </div>
                                            </div>
                                            <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm leading-tight">{eq.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold">
                                                {eq.manufacturer || "Fabricante N/D"} • {eq.model || "Modelo N/D"}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-[20px] shrink-0 self-center">chevron_right</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 dark:border-slate-800/50 text-[11px]">
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ensaio</p>
                                            <p className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{eq.testType || "N/D"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Próxima Calibração</p>
                                            <p className={`font-black ${statusInfo.isExpired ? 'text-rose-500' : statusInfo.isNear ? 'text-amber-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {eq.nextCalibrationDate ? new Date(eq.nextCalibrationDate.toString().split('T')[0] + 'T00:00:00').toLocaleDateString("pt-BR") : "N/D"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-1">
                                        <button
                                            onClick={(e) => toggleOutOfUse(e, eq)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm ${
                                                eq.status === 'DANIFICADO' 
                                                ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-600 hover:text-white' 
                                                : 'text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-900 hover:text-white'
                                            }`}
                                            title={eq.status === 'DANIFICADO' ? "Ativar Equipamento" : "Marcar como Fora de Uso / Danificado"}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                {eq.status === 'DANIFICADO' ? 'build_circle' : 'block'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={(e) => openCalibrate(e, eq)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                            title="Calibrar"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                        </button>
                                        {isAuthorized && (
                                            <>
                                                <a
                                                    href={`/sgq/cadastros/equipamentos?id=${eq.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                                </a>
                                                <button
                                                    onClick={(e) => handleDelete(e, eq.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    title="Excluir"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            {isDetailOpen && currentEq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-3 md:p-6 animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] md:rounded-[3rem] w-full max-w-6xl max-h-[92vh] md:max-h-[98vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-500 ease-out">
                        
                        {/* Top Bar / Header */}
                        <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 relative z-10 pr-10 sm:pr-0">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-xl group overflow-hidden shrink-0">
                                    <span className="material-symbols-outlined text-3xl md:text-5xl group-hover:scale-110 transition-transform duration-500">biotech</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] md:text-[11px] font-black rounded-full border border-primary/20 tracking-widest">{currentEq.code}</span>
                                        {(() => {
                                            const status = (() => {
                                                if (currentEq.status === 'DANIFICADO') return { label: 'Fora de Uso', class: 'border-slate-200 text-slate-500 bg-slate-50' };
                                                if (!currentEq.nextCalibrationDate) return { label: currentEq.status, class: 'border-slate-200 text-slate-500 bg-slate-50' };
                                                const nextDate = new Date(currentEq.nextCalibrationDate);
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                                
                                                if (diffDays <= 0) return { label: 'VENCIDO', class: 'border-rose-200 text-rose-600 bg-rose-50' };
                                                if (diffDays <= 30) return { label: 'Vencimento Próximo', class: 'border-amber-200 text-amber-600 bg-amber-50 animate-pulse' };
                                                return { label: 'ATIVO', class: 'border-emerald-200 text-emerald-600 bg-emerald-50' };
                                            })();
                                            return (
                                                <div className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black tracking-widest border uppercase ${status.class}`}>
                                                    {status.label}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight line-clamp-2">{currentEq.name}</h2>
                                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-bold text-sm">
                                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                        {currentEq.testType || "Tipo de ensaio não definido"}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsDetailOpen(false)} 
                                className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-rose-500 hover:text-white transition-all text-slate-400 z-20 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-xl md:text-2xl">close</span>
                            </button>
                        </div>

                        {/* Main Grid Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                                
                                {/* Col 1: Hardware Specs */}
                                <div className="space-y-8">
                                    <DetailHeader icon="settings" title="Hardware" />
                                    <div className="space-y-6">
                                        <DetailCard label="Fabricante" value={currentEq.manufacturer} icon="factory" />
                                        <DetailCard label="Modelo" value={currentEq.model} icon="model_training" />
                                        <DetailCard label="Nº de Série" value={currentEq.serialNumber} icon="barcode" isMono />
                                        <DetailCard label="Capacidade" value={currentEq.range} icon="straighten" />
                                        <DetailCard label="Localização" value={currentEq.location} icon="location_on" />
                                    </div>
                                </div>

                                {/* Col 2: Calibration Details */}
                                <div className="space-y-8">
                                    <DetailHeader icon="science" title="Calibração" />
                                    <div className="space-y-6">
                                        <DetailCard label="Laboratório" value={currentEq.lab} icon="home_work" />
                                        <DetailCard 
                                            label="Certificados" 
                                            value={Array.isArray(currentEq.certificateNumber) ? currentEq.certificateNumber.join(', ') : currentEq.certificateNumber} 
                                            icon="description" 
                                            isMono 
                                        />
                                        <DetailCard 
                                            label="Tipos de Serviço" 
                                            value={Array.isArray(currentEq.serviceType) ? currentEq.serviceType.join(', ') : currentEq.serviceType} 
                                            icon="category" 
                                        />
                                        <DetailCard 
                                            label="Investimento" 
                                            value={currentEq.calibrationValue && currentEq.calibrationValue.length > 0 
                                                ? currentEq.calibrationValue.reduce((a, b) => a + b, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                                                : "N/D"} 
                                            icon="payments" 
                                        />
                                    </div>
                                </div>

                                {/* Col 3: Metrological Monitoring */}
                                <div className="space-y-8">
                                    <DetailHeader icon="event_repeat" title="Monitoramento" />
                                    <div className="space-y-6">
                                        <DetailCard 
                                            label="Última Calibração" 
                                            value={currentEq.lastCalibrationDate ? new Date(currentEq.lastCalibrationDate.toString().split('T')[0] + 'T00:00:00').toLocaleDateString("pt-BR") : "Inexistente"} 
                                            icon="history" 
                                        />
                                        <DetailCard 
                                            label="Periodicidade" 
                                            value={currentEq.calibrationInterval ? `${currentEq.calibrationInterval} meses` : "N/D"} 
                                            icon="update" 
                                        />
                                        <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-[2rem] border border-primary/20 shadow-inner group hover:bg-primary/10 transition-all duration-300">
                                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[14px]">event_available</span>
                                                Próximo Vencimento
                                            </p>
                                            <p className={`text-2xl font-black ${(() => {
                                                if (!currentEq.nextCalibrationDate) return 'text-slate-900';
                                                const nextDate = new Date(currentEq.nextCalibrationDate.toString().split('T')[0] + 'T00:00:00');
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return nextDate.getTime() <= today.getTime() ? 'text-rose-500' : 'text-slate-900 dark:text-slate-100';
                                            })()} tracking-tight`}>
                                                {currentEq.nextCalibrationDate ? new Date(currentEq.nextCalibrationDate.toString().split('T')[0] + 'T00:00:00').toLocaleDateString("pt-BR") : "N/D"}
                                            </p>
                                            <div className="mt-4 w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${(() => {
                                                    if (!currentEq.nextCalibrationDate) return 'w-0 bg-slate-300';
                                                    const nextDate = new Date(currentEq.nextCalibrationDate.toString().split('T')[0] + 'T00:00:00');
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    return nextDate.getTime() <= today.getTime() ? 'w-full bg-rose-500' : 'w-2/3 bg-primary';
                                                })()}`}></div>
                                            </div>
                                        </div>
                                        <DetailCard label="Critério de Aceitação" value={currentEq.acceptance || "Aprovado via certificado"} icon="rule" />
                                    </div>
                                </div>

                                {/* Col 4: Operations & Notes */}
                                <div className="space-y-8">
                                    <DetailHeader icon="notes" title="Anotações" />
                                    <div className="space-y-6">
                                        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 h-full relative group">
                                            <span className="material-symbols-outlined absolute top-6 right-6 text-slate-200 dark:text-slate-800 text-6xl group-hover:text-primary/10 transition-colors">format_quote</span>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Observações Técnicas</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic relative z-10">
                                                {currentEq.notes || "Não há observações complementares registradas para este instrumento."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 md:p-10 border-t border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
                            <div className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px] md:text-[16px]">info</span>
                                Sincronizado: {new Date().toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={() => setIsDetailOpen(false)}
                                    className="flex-1 sm:flex-none px-6 py-3 text-xs font-black text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all uppercase tracking-widest"
                                >
                                    Voltar
                                </button>
                                {isAuthorized && (
                                    <a 
                                        href={`/sgq/cadastros/equipamentos?id=${currentEq.id}`}
                                        className="flex-1 sm:flex-none px-8 py-3.5 bg-slate-900 dark:bg-primary text-white text-xs font-black rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                    >
                                        Editar
                                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

                 {isCalibOpen && currentEq && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 font-sans">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 w-[95%] sm:w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                                Calibração Rápida
                            </h2>
                            <button onClick={() => setIsCalibOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateCalibration} className="space-y-8">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Instrumento</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">{currentEq.code} — {currentEq.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Data da Calibração</label>
                                    <input 
                                        required 
                                        type="date" 
                                        value={calDate} 
                                        onChange={e => setCalDate(e.target.value)} 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-primary/30 transition-all text-sm" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Período (Meses)</label>
                                    <input 
                                        required 
                                        type="number" 
                                        value={interval} 
                                        onChange={e => setIntervalValue(e.target.value === "" ? "" : Number(e.target.value))} 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-primary/30 transition-all text-sm" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black text-primary uppercase tracking-widest ml-1">Próxima Calibração Estimada</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity">calendar_month</span>
                                    <input 
                                        required 
                                        type="date" 
                                        value={nextCal} 
                                        onChange={e => setNextCal(e.target.value)} 
                                        className="w-full bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 rounded-[1.5rem] pl-12 pr-4 py-5 text-primary font-black text-lg focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all shadow-inner" 
                                    />
                                </div>
                                <div className="flex items-center gap-2 px-2">
                                    <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
                                    <p className="text-[10px] text-slate-400 italic">Data projetada automaticamente pelo sistema.</p>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 px-6 bg-primary hover:bg-teal-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 flex justify-center items-center gap-3 uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95">
                                Validar e Registrar
                                <span className="material-symbols-outlined text-[22px]">verified</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
            />

            <SuccessModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={successConfig.title}
                message={successConfig.message}
                type={successConfig.type}
                autoClose={successConfig.autoClose}
            />
        </div>
    )
}

function DetailHeader({ icon, title }: { icon: string, title: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
            <h3 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.2em]">{title}</h3>
        </div>
    )
}

function DetailCard({ label, value, icon, isMono = false }: { label: string, value: any, icon: string, isMono?: boolean }) {
    return (
        <div className="group">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors">{icon}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</p>
            </div>
            <p className={`text-sm font-black text-slate-800 dark:text-slate-200 pl-6 ${isMono ? 'font-mono' : ''}`}>
                {value || <span className="opacity-20">—</span>}
            </p>
        </div>
    )
}
