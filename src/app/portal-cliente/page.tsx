"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Ensaio {
    id: string;
    data: string;
    titulo: string;
    status: string;
    statusColor: "amber" | "emerald" | "blue" | "slate" | "orange";
    icon: string;
    reportPdfUrl?: string;
    reportNumber?: string;
}

export default function PortalClientePage() {
    const [activeTab, setActiveTab] = useState("Status de cada ensaio");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        tipoEnsaio: "",
        nomeContratante: "",
        nomeConstrutora: "",
        nomeObra: "",
        enderecoCompleto: "",
        emailProposta: "",
        emailRelatorio: "",
        dataDesejada: "",
        observacoes: ""
    });

    const [ensaios, setEnsaios] = useState<Ensaio[]>([]);

    useEffect(() => {
        fetch("/api/solicitacoes/cliente?clientName=CLAUDIO%20SCHERER")
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    const formatted = data.map(req => ({
                        id: req.id.split('-')[0].toUpperCase(),
                        data: new Date(req.createdAt).toLocaleDateString("pt-BR"),
                        titulo: req.type,
                        status: req.status === "RECEBIDO" ? "Recebido" : req.status === "EM_EXECUCAO" ? "Em execução" : req.status === "AGUARDANDO_APROVACAO" ? "Em análise" : "Finalizado",
                        statusColor: req.status === "RECEBIDO" ? "slate" : req.status === "EM_EXECUCAO" ? "blue" : req.status === "AGUARDANDO_APROVACAO" ? "orange" : "emerald",
                        icon: req.status === "RECEBIDO" ? "inventory_2" : req.status === "EM_EXECUCAO" ? "build_circle" : req.status === "AGUARDANDO_APROVACAO" ? "fact_check" : "check_circle",
                        reportPdfUrl: req.reportPdfUrl,
                        reportNumber: req.reportNumber
                    })) as Ensaio[];
                    setEnsaios(formatted);
                }
            })
            .catch(console.error);
    }, []);

    const tabs = ["Solicitações feitas", "Status de cada ensaio", "Últimos relatórios disponíveis"];

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/solicitacoes/cliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: formData.tipoEnsaio || "Ensaio Genérico",
                    contractorName: formData.nomeContratante,
                    constructionCompany: formData.nomeConstrutora,
                    workName: formData.nomeObra,
                    address: formData.enderecoCompleto,
                    proposalEmail: formData.emailProposta,
                    reportEmail: formData.emailRelatorio,
                    location: `${formData.nomeObra} - ${formData.enderecoCompleto}`,
                    desiredDate: formData.dataDesejada,
                    observations: formData.observacoes,
                    clientName: "CLAUDIO SCHERER"
                })
            });

            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    const req = json.request;
                    const novoEnsaio: Ensaio = {
                        id: req.id.split('-')[0].toUpperCase(),
                        data: new Date(req.createdAt).toLocaleDateString("pt-BR"),
                        titulo: req.type,
                        status: "Recebido",
                        statusColor: "slate",
                        icon: "inventory_2"
                    };

                    setEnsaios([novoEnsaio, ...ensaios]);
                    setActiveTab("Status de cada ensaio");
                    setFormData({
                        tipoEnsaio: "",
                        nomeContratante: "",
                        nomeConstrutora: "",
                        nomeObra: "",
                        enderecoCompleto: "",
                        emailProposta: "",
                        emailRelatorio: "",
                        dataDesejada: "",
                        observacoes: ""
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColors = (color: string) => {
        switch (color) {
            case "emerald": return "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 icon-bg-emerald-100 dark:icon-bg-emerald-500/20";
            case "amber": return "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 icon-bg-amber-100 dark:icon-bg-amber-500/20";
            case "blue": return "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 icon-bg-blue-100 dark:icon-bg-blue-500/20";
            case "slate": return "bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 icon-bg-slate-200 dark:icon-bg-slate-700/50";
            default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 icon-bg-gray-100 dark:icon-bg-gray-800";
        }
    };

    const getIconTheme = (color: string) => {
        switch (color) {
            case "emerald": return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30";
            case "amber": return "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-amber-500/30";
            case "orange": return "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 ring-orange-500/30";
            case "blue": return "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-blue-500/30";
            case "slate": return "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 ring-slate-400/30";
            default: return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ring-gray-400/30";
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            {/* Top Bar - Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30">
                <div className="max-w-[1600px] mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Logo area */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-md">
                                    M
                                </div>
                                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                    MMC <span className="text-slate-700 dark:text-slate-300 font-light">PORTAL</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">business</span>
                                MMC LAB CONTROLE TECNOLÓGICO LTDA
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                Contrato válido até 30/06/2023
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">person</span>
                                <span className="text-sm font-bold">CLAUDIO SCHERER</span>
                            </div>
                            <Link href="/login-cliente" className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Sair">
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="bg-blue-900 dark:bg-slate-900 border-t border-blue-800 dark:border-slate-800">
                    <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <nav className="flex overflow-x-auto hide-scrollbar w-full sm:w-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab
                                        ? "border-sky-400 text-sky-400 bg-blue-800/50 dark:bg-slate-800"
                                        : "border-transparent text-blue-100 hover:bg-blue-800/30 hover:text-white dark:text-slate-400 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        <div className="p-3 sm:p-0 w-full sm:w-auto flex justify-end">
                            <button
                                onClick={() => setActiveTab("Nova Solicitação")}
                                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                Nova Solicitação
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 py-8">
                {/* Active Tab Indicator */}
                <div className="mb-6 flex items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-lg shadow-sm border-b-0 text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {activeTab}
                        <button className="text-slate-400 hover:text-red-500 transition-colors flex items-center" onClick={() => setActiveTab("Status de cada ensaio")}>
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    </div>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 mt-auto"></div>
                </div>

                {activeTab === "Status de cada ensaio" && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-none shadow-sm p-6 relative">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                Acompanhamento de Ensaios
                            </h2>
                            <div className="relative w-full md:w-64">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Buscar ensaio..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {ensaios.map((ensaio, idx) => {
                                const statusClasses = getStatusColors(ensaio.statusColor);
                                const iconSettings = getIconTheme(ensaio.statusColor);

                                return (
                                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-950/50 group">
                                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                            <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ring-1 group-hover:scale-110 transition-transform ${iconSettings}`}>
                                                <span className="material-symbols-outlined text-[24px]">{ensaio.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{ensaio.titulo}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Solicitação #{ensaio.id} • {ensaio.data}</p>
                                            </div>
                                            {ensaio.status === "Finalizado" && ensaio.reportPdfUrl && (
                                                <a href={ensaio.reportPdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 sm:mt-0 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                                                    Baixar Relatório {ensaio.reportNumber ? `(${ensaio.reportNumber})` : ''}
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-4 sm:pt-0">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 font-bold text-sm rounded-full border shadow-sm ${statusClasses.split('icon-bg')[0]}`}>
                                                {ensaio.status === "Em análise" && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                                                {ensaio.status === "Finalizado" && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                                {ensaio.status === "Agendado" && <span className="material-symbols-outlined text-[16px]">schedule</span>}
                                                {ensaio.status === "Recebido" && <span className="w-2 h-2 rounded-full bg-slate-500"></span>}
                                                {ensaio.status}
                                            </div>
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Ver Detalhes">
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {activeTab === "Nova Solicitação" && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-none shadow-sm p-6 relative">
                        <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                Nova Solicitação de Ensaio
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Preencha os detalhes da sua demanda para análise da equipe técnica.
                            </p>
                        </div>

                        <form onSubmit={handleFormSubmit} className="max-w-3xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tipo de Ensaio */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de ensaio</label>
                                    <select
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={formData.tipoEnsaio}
                                        onChange={(e) => setFormData({ ...formData, tipoEnsaio: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Selecione um tipo...</option>
                                        <option value="Ensaio Guarda-corpo">Ensaio Guarda-corpo</option>
                                        <option value="Ensaio Compressão">Ensaio de Compressão (Cilindros)</option>
                                        <option value="Medição Acústica (NBR 15575)">Medição Acústica (NBR 15575)</option>
                                        <option value="Simulação Computacional">Simulação Computacional</option>
                                        <option value="Outro">Outro (Especificar nas observações)</option>
                                    </select>
                                </div>

                                {/* Nome do contratante */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome do contratante</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                        placeholder="Nome da empresa ou pessoa"
                                        value={formData.nomeContratante}
                                        onChange={(e) => setFormData({ ...formData, nomeContratante: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Nome da construtora */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da construtora <span className="text-xs font-normal text-slate-500">(opcional)</span></label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                        placeholder="Construtora XYZ"
                                        value={formData.nomeConstrutora}
                                        onChange={(e) => setFormData({ ...formData, nomeConstrutora: e.target.value })}
                                    />
                                </div>

                                {/* Nome da obra */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da obra</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                        placeholder="Nome do empreendimento"
                                        value={formData.nomeObra}
                                        onChange={(e) => setFormData({ ...formData, nomeObra: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Endereço completo */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Endereço completo</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                        placeholder="Rua, Número, Bairro, Cidade - UF, CEP"
                                        value={formData.enderecoCompleto}
                                        onChange={(e) => setFormData({ ...formData, enderecoCompleto: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* E-mail - Proposta */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail para envio da proposta</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                        placeholder="seu@email.com"
                                        value={formData.emailProposta}
                                        onChange={(e) => setFormData({ ...formData, emailProposta: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* E-mail - Relatório */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail para envio do relatório</label>
                                    <input
                                        type="email"
                                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                                        placeholder="seu@email.com"
                                        value={formData.emailRelatorio}
                                        onChange={(e) => setFormData({ ...formData, emailRelatorio: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Data Desejada */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Data desejada para o serviço / retirada</label>
                                <input
                                    type="date"
                                    className="w-full md:w-1/2 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-300"
                                    value={formData.dataDesejada}
                                    onChange={(e) => setFormData({ ...formData, dataDesejada: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Observações */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observações adicionais</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
                                    placeholder="Detalhes específicos sobre o material, norma de referência, urgência, etc."
                                    value={formData.observacoes}
                                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Upload Documentos */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Anexos e Documentos de Engenharia</label>
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                                    <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600 mb-2 group-hover:text-emerald-500 transition-colors">upload_file</span>
                                    <p className="text-slate-600 dark:text-slate-400 font-medium">Clique para selecionar arquivos ou arraste aqui</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">PDF, DWG, DOCX ou Imagens (Máx. 20MB)</p>
                                    <input type="file" className="hidden" multiple />
                                </div>
                            </div>

                            {/* Divider & Submit */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>Salvando e Enviando...</>
                                    ) : (
                                        <>
                                            Enviar Solicitação
                                            <span className="material-symbols-outlined text-[20px]">send</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )
                }

                {
                    !["Status de cada ensaio", "Nova Solicitação"].includes(activeTab) && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-none shadow-sm p-12 text-center">
                            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-[40px] text-slate-400 dark:text-slate-500">construction</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">Módulo em Construção</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                                A funcionalidade de <strong>{activeTab}</strong> está sendo desenvolvida e estará disponível no seu portal em breve.
                            </p>
                        </div>
                    )
                }
            </main >
        </div >
    );
}
