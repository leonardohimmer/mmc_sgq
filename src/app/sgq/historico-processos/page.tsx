"use client"

import { toast } from "sonner"
import { useState, useEffect } from "react"
import { format, differenceInDays, differenceInBusinessDays } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function HistoricoProcessosPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Histórico de Processos</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Consulte todos os processos e pesquisas de satisfação que já foram finalizados e revisados.
                </p>
            </div>

            <HistoricoTab />
        </div>
    )
}

function HistoricoTab() {
    const [surveys, setSurveys] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchSurveys = async () => {
        setLoading(true)
        try {
            // Buscamos todas as pesquisas, mas filtraremos apenas as REVIEWED
            const res = await fetch('/api/pesquisa-satisfacao?includePending=false')
            if (res.ok) {
                const data = await res.json()
                // Apenas as revisadas entram no histórico
                setSurveys(data.surveys?.filter((s: any) => s.status === 'REVIEWED') || [])
            }
        } catch (error) {
            console.error("Erro ao buscar histórico:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSurveys()
    }, [])

    const handleOpenSurvey = (survey: any) => {
        setSelectedSurvey(survey)
    }

    const handleCloseModal = () => {
        setSelectedSurvey(null)
        fetchSurveys()
    }

    const filteredSurveys = surveys.filter(s => {
        const search = searchTerm.toLowerCase()
        return (
            s.request?.clientName?.toLowerCase().includes(search) ||
            s.request?.reportNumber?.toLowerCase().includes(search) ||
            s.request?.workName?.toLowerCase().includes(search)
        )
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[30vh]">
                <div className="h-8 w-8 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Barra de Busca */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input 
                    type="text"
                    placeholder="Buscar por cliente, relatório ou obra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200"
                />
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 border-l border-slate-200 dark:border-slate-800">
                    {filteredSurveys.length} Registros
                </div>
            </div>

            {filteredSurveys.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-slate-300 text-[32px]">folder_off</span>
                    </div>
                    <p className="text-slate-500 font-medium">Nenhum processo encontrado no histórico.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredSurveys.map((survey) => (
                        <div 
                            key={survey.id} 
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-500 rounded-xl p-5 hover:border-primary transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-sm"
                            onClick={() => handleOpenSurvey(survey)}
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="material-symbols-outlined text-[28px]">history_edu</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                            {survey.request?.clientName}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            Finalizado
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-slate-500">
                                        <p className="text-xs flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">description</span>
                                            Relatório: <span className="font-semibold">{survey.request?.reportNumber || 'N/A'}</span>
                                        </p>
                                        <p className="text-xs flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">apartment</span>
                                            Obra: {survey.request?.workName || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 min-w-[140px]">
                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                    <span className="text-lg font-black">{survey.ratingQuality || '5.0'}</span>
                                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                                
                                {survey.request?.performedAt && (() => {
                                    const businessDays = Math.max(0, differenceInBusinessDays(new Date(survey.createdAt), new Date(survey.request.performedAt)));
                                    const getColorClass = (days: number) => {
                                        if (days >= 7) return "text-rose-600 dark:text-rose-400";
                                        if (days >= 5) return "text-amber-600 dark:text-amber-500";
                                        return "text-emerald-600 dark:text-emerald-400";
                                    };
                                    const getBgClass = (days: number) => {
                                        if (days >= 7) return "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/30";
                                        if (days >= 5) return "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30";
                                        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30";
                                    };

                                    return (
                                        <div className={`flex flex-col items-end border-b border-slate-200 dark:border-slate-700 pb-1 mb-1 w-full`}>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Tempo de Processo</p>
                                            <p className={`text-xs font-black flex items-center gap-1 ${getColorClass(businessDays)}`}>
                                                <span className="material-symbols-outlined text-[14px]">timer</span>
                                                {businessDays} {businessDays === 1 ? 'dia útil' : 'dias úteis'}
                                            </p>
                                        </div>
                                    );
                                })()}

                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Finalizado em</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {format(new Date(survey.updatedAt), "dd/MM/yyyy")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedSurvey && (
                <SurveyModal survey={selectedSurvey} onClose={handleCloseModal} />
            )}
        </div>
    )
}

function SurveyModal({ survey, onClose }: { survey: any, onClose: () => void }) {
    const [isSaving, setIsSaving] = useState(false)
    const [internalNotes, setInternalNotes] = useState(survey.internalNotes || "")

    const calculateAverage = () => {
        const ratings = [
            survey.ratingSpeed,
            survey.ratingComm,
            survey.ratingTime,
            survey.ratingQuality,
            survey.ratingDoc
        ].filter(r => r !== null && r !== undefined);
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((a, b) => a + b, 0);
        return (sum / ratings.length).toFixed(1);
    }

    const handleUpdateNotes = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/pesquisa-satisfacao', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: survey.id,
                    internalNotes
                })
            })
            if (res.ok) {
                toast.success("Observações salvas com sucesso!")
                onClose()
            } else {
                toast.error("Erro ao salvar observações.")
            }
        } catch (error) {
            console.error("Erro:", error)
            toast.error("Erro ao conectar.")
        } finally {
            setIsSaving(false)
        }
    }

    const ratingsList = [
        { label: "1. Rapidez no atendimento", value: survey.ratingSpeed, justification: survey.justificationSpeed },
        { label: "2. Comunicação / Clareza", value: survey.ratingComm, justification: survey.justificationComm },
        { label: "3. Cumprimento do prazo", value: survey.ratingTime, justification: survey.justificationTime },
        { label: "4. Qualidade do serviço/produto", value: survey.ratingQuality, justification: survey.justificationQuality },
        { label: "5. Documentação/Relatório", value: survey.ratingDoc, justification: survey.justificationDoc },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/20">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-500">verified</span>
                            Processo Finalizado: {survey.request?.clientName}
                        </h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Histórico de Atendimento</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <div>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Média de Satisfação</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-200">{calculateAverage()}</span>
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map((starIndex) => {
                                        const rating = Number(calculateAverage());
                                        let iconName = 'star';
                                        let fill = 1;
                                        
                                        if (rating >= starIndex) {
                                            iconName = 'star';
                                            fill = 1;
                                        } else if (rating >= starIndex - 0.5) {
                                            iconName = 'star_half';
                                            fill = 1;
                                        } else {
                                            iconName = 'star';
                                            fill = 0;
                                        }
                                        
                                        return (
                                            <span 
                                                key={starIndex} 
                                                className="material-symbols-outlined text-[24px]"
                                                style={{ fontVariationSettings: `'FILL' ${fill}` }}
                                            >
                                                {iconName}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xs text-slate-500">Relatório: <span className="font-bold text-slate-700 dark:text-slate-300">{survey.request?.reportNumber || 'N/A'}</span></p>
                            {survey.request?.performedAt && (
                                <p className="text-xs text-slate-500">Executado em: <span className="font-bold text-slate-700 dark:text-slate-300">{format(new Date(survey.request.performedAt), "dd/MM/yyyy")}</span></p>
                            )}
                            <p className="text-xs text-slate-500">Emissão/Envio: <span className="font-bold text-slate-700 dark:text-slate-300">{format(new Date(survey.createdAt), "dd/MM/yyyy")}</span></p>
                            {survey.request?.performedAt && (() => {
                                const businessDays = Math.max(0, differenceInBusinessDays(new Date(survey.createdAt), new Date(survey.request.performedAt)));
                                const isDelayed = businessDays >= 7;
                                const isWarning = businessDays >= 5 && businessDays < 7;
                                
                                return (
                                    <div className={`mt-2 pt-2 border-t ${isDelayed ? 'border-rose-200 dark:border-rose-800' : isWarning ? 'border-amber-200 dark:border-amber-800' : 'border-emerald-200 dark:border-emerald-800/50'}`}>
                                        <p className={`text-[10px] font-bold uppercase ${isDelayed ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            Eficiência (Prazo: 7 d.ú.)
                                        </p>
                                        <p className={`text-lg font-black ${isDelayed ? 'text-rose-700 dark:text-rose-400' : isWarning ? 'text-amber-700 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                            {businessDays} {businessDays === 1 ? 'dia útil' : 'dias úteis'}
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">Detalhes da Avaliação</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {ratingsList.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((starIndex) => {
                                                const rating = item.value || 0;
                                                let iconName = 'star';
                                                let fill = 1;
                                                
                                                if (rating >= starIndex) {
                                                    iconName = 'star';
                                                    fill = 1;
                                                } else if (rating >= starIndex - 0.5) {
                                                    iconName = 'star_half';
                                                    fill = 1;
                                                } else {
                                                    iconName = 'star';
                                                    fill = 0;
                                                }
                                                
                                                return (
                                                    <span 
                                                        key={starIndex} 
                                                        className="material-symbols-outlined text-[20px]"
                                                        style={{ fontVariationSettings: `'FILL' ${fill}` }}
                                                    >
                                                        {iconName}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {item.justification && (
                                        <div className="bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 text-xs text-slate-600 dark:text-slate-400 italic">
                                            <span className="font-bold text-amber-600 dark:text-amber-500 block mb-1 not-italic">Justificativa do Cliente:</span>
                                            "{item.justification}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Sugestões de melhoria</h3>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[80px] whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 italic">
                            {survey.feedback ? `"${survey.feedback}"` : "Sem comentários adicionais."}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Observações Internas (Editável)</h3>
                        <textarea
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Adicione observações posteriores aqui..."
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[100px] text-sm"
                        ></textarea>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={handleUpdateNotes}
                        disabled={isSaving}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined text-[18px]">save</span>
                        )}
                        Salvar Observações
                    </button>
                </div>
            </div>
        </div>
    )
}
