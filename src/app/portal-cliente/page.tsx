"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import SuccessModal from "@/components/SuccessModal";
import ConfirmModal from "@/components/ConfirmModal";



interface Ensaio {
    id: string;
    data: string;
    titulo: string;
    status: string;
    statusColor: "amber" | "emerald" | "blue" | "slate" | "orange" | "purple";
    icon: string;
    rawId: string;
    reportPdfUrl?: string;
    reportNumber?: string;
    proposalPdfUrl?: string;
    invoicePdfUrl?: string;
    clientPaymentConfirmed?: boolean;
    hasPendingSurvey?: boolean;
    hasCompletedSurvey?: boolean;
    fullData?: any;
}

const SERVICOS_AGRUPADOS = {
    "Em campo": [
        {
            label: "Ensaios Acústicos",
            subitens: [
                "Ensaio de Isolamento Acústico em Laboratório (Rw)",
                "Ensaio de Isolamento ao Ruído de Impacto",
                "Mapa de Ruído",
                "Inspeção com Câmera Acústica",
            ]
        },
        "Ensaio de Ancoragem",
        "Ensaio de Esclerometria",
        "Ensaio de Guarda-corpo e Parapeito",
        "Ensaio de Impacto de Corpo Mole e Corpo Duro",
        "Ensaio de Integridade de Estacas (PIT)",
        "Ensaio de Peças Suspensas",
        "Ensaio de Percussão",
        "Ensaio de Permeabilidade",
        "Ensaio de Resistência de Aderência à Tração (Arrancamento)",
        "Ensaio Lumínico",
        "Inspeção de Fachadas",
        "Inspeção Termográfica",
    ],
    "Em laboratório": [
        {
            label: "Ensaios Acústicos",
            subitens: [
                "Ensaio de Isolamento Acústico em Laboratório (Rw)",
                "Ensaio de Isolamento ao Ruído de Impacto",
                "Inspeção com Câmera Acústica",
            ]
        },
        "Ensaio de Guarda-corpo e Parapeito",
        "Ensaio de Impacto de Corpo Mole e Corpo Duro",
        "Ensaio de Resistência de Aderência à Tração",
        "Ensaio de Peças Suspensas",
        "Ensaio de Integridade de Estacas (PIT)",
        "Ensaio de Percussão",
        "Ensaio de Permeabilidade",
        "Ensaio de Esclerometria",
        "Inspeção de Fachadas",
        "Inspeção Termográfica",
    ],
    "Outros": [
        "Análise de Vibração",
        "Consultoria Acústica",
        "Licença de Instalação Acústica",
        "Projetos Acústicos",
        "Simulação Lumínica",
        "Simulação Térmica",
        "Simulações de Desempenho",
        "Outros",
    ]
}

const ESTADOS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};



export default function PortalClientePage() {
    const { data: session, status } = useSession();
    const clientName = session?.user?.name || "Carregando...";
    const clientCompany = session?.user?.company || "Empresa não informada";

    const [activeTab, setActiveTab] = useState("Status de cada ensaio");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string,
        message: string,
        onConfirm: () => void,
        type?: 'primary' | 'danger' | 'warning',
        confirmText?: string,
        cancelText?: string
    }>({
        title: "",
        message: "",
        onConfirm: () => {}
    })
    const [modalConfig, setModalConfig] = useState({ title: "", message: "" });


    const [formData, setFormData] = useState({
        tipoEnsaio: [{ tipo: "", quantidade: "" }],
        nomeContratante: "",
        nomeConstrutora: "",
        nomeObra: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        telefone: "",
        emailsProposta: [""],
        emailsRelatorio: [""],
        datasDesejadas: [""],
        observacoes: ""
    });


    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const [ensaios, setEnsaios] = useState<Ensaio[]>([]);

    useEffect(() => {
        if (status === "loading" || !session?.user?.name) return;

        const nameEncoded = encodeURIComponent(session.user.name);
        fetch(`/api/solicitacoes/cliente?clientName=${nameEncoded}`)
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    const formatted = data.map(req => ({
                        id: req.id.split('-')[0].toUpperCase(),
                        rawId: req.id,
                        data: new Date(req.createdAt).toLocaleDateString("pt-BR"),
                        titulo: req.type,
                        status: req.status === "RECEBIDO" ? "Recebido" : req.status === "AGUARDANDO_ACEITE" ? "Aguardando Aceite" : req.status === "AGUARDANDO_AGENDAMENTO" ? "Aguardando Agendamento" : req.status === "EM_EXECUCAO" ? "Em execução" : req.status === "ELABORANDO_RELATORIO" ? "Elaborando Relatório" : req.status === "AGUARDANDO_APROVACAO" ? "Em análise" : req.status === "COBRANCA" ? "Faturamento em Processamento" : req.status === "PAGAMENTO" ? "Aguardando Pagamento" : "Finalizado",
                        statusColor: req.status === "RECEBIDO" ? "slate" : req.status === "AGUARDANDO_ACEITE" ? "purple" : req.status === "AGUARDANDO_AGENDAMENTO" ? "emerald" : req.status === "EM_EXECUCAO" ? "blue" : req.status === "ELABORANDO_RELATORIO" ? "orange" : req.status === "AGUARDANDO_APROVACAO" ? "orange" : req.status === "COBRANCA" ? "blue" : req.status === "PAGAMENTO" ? "blue" : "emerald",
                        icon: req.status === "RECEBIDO" ? "inventory_2" : req.status === "AGUARDANDO_ACEITE" ? "mark_email_read" : req.status === "AGUARDANDO_AGENDAMENTO" ? "calendar_month" : req.status === "EM_EXECUCAO" ? "build_circle" : req.status === "ELABORANDO_RELATORIO" ? "edit_document" : req.status === "AGUARDANDO_APROVACAO" ? "fact_check" : req.status === "COBRANCA" ? "receipt" : req.status === "PAGAMENTO" ? "payments" : "check_circle",
                        reportPdfUrl: req.reportPdfUrl,
                        reportNumber: req.reportNumber,
                        proposalPdfUrl: req.proposalPdfUrl,
                        invoicePdfUrl: req.invoicePdfUrl,
                        clientPaymentConfirmed: req.clientPaymentConfirmed,
                        hasPendingSurvey: req.satisfactionSurvey?.status === 'PENDING',
                        hasCompletedSurvey: req.satisfactionSurvey?.status === 'COMPLETED',
                        fullData: req // Store full data for editing
                    })) as (Ensaio & { fullData: any })[];
                    setEnsaios(formatted);
                }
            })
            .catch(console.error);
    }, [session, status]);




    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const changedBy = session?.user?.name || "Cliente";

        try {
            const enderecoCompleto = `${formData.rua}, ${formData.numero}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}, CEP: ${formData.cep}`;
            
            const payload = {
                type: formData.tipoEnsaio.filter(t => t.tipo.trim() !== "").map(t => t.tipo).join(" + ") || "Ensaio Genérico",
                contractorName: formData.nomeContratante,
                constructionCompany: formData.nomeConstrutora,
                workName: formData.nomeObra,
                address: enderecoCompleto,
                rua: formData.rua,
                numero: formData.numero,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
                cep: formData.cep,
                proposalEmail: formData.emailsProposta.filter(e => e.trim() !== "").join(", "),
                reportEmail: formData.emailsRelatorio.filter(e => e.trim() !== "").join(", "),
                emailsProposta: formData.emailsProposta.filter(e => e.trim() !== ""),
                emailsRelatorio: formData.emailsRelatorio.filter(e => e.trim() !== ""),
                location: `${formData.nomeObra} - ${enderecoCompleto}`,
                datasDesejadas: formData.datasDesejadas.filter(d => d.trim() !== "").join(", "),
                desiredDate: formData.datasDesejadas[0] || new Date().toISOString(), // Adicionado campo esperado pela API
                observations: isEditing 
                    ? `[SOLICITAÇÃO REVISADA PELO CLIENTE em ${new Date().toLocaleString('pt-BR')}]\n${formData.observacoes}`
                    : formData.observacoes,
                clientName: session?.user?.name || "Cliente",
                clientPhone: formData.telefone,
                quantidadeEnsaios: formData.tipoEnsaio.filter(t => t.tipo.trim() !== "").map(t => t.quantidade).join(" + "),
                status: 'RECEBIDO', // Mandar de volta para o início como revisado
                step: 1
            };

            const url = isEditing ? `/api/solicitacoes/${editingRequestId}` : "/api/solicitacoes/cliente";
            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (res.ok && json.success) {
                const successTitle = isEditing ? "Solicitação Atualizada!" : "Solicitação Enviada!";
                const successMessage = isEditing 
                    ? "Sua solicitação foi atualizada com sucesso e enviada para revisão técnica." 
                    : "Sua solicitação foi recebida com sucesso! Acompanhe o status aqui no portal.";

                toast.success(successTitle);
                
                setModalConfig({
                    title: successTitle,
                    message: successMessage
                });
                setShowSuccessModal(true);

                if (isEditing) {
                    resetForm();
                    // O reload será feito no onClose do modal
                    return;
                }

                // Para nova solicitação, formatar o objeto para o estado local
                const req = json.request;
                const formattedNovoEnsaio: Ensaio = {
                    id: req.id.split('-')[0].toUpperCase(),
                    rawId: req.id,
                    data: new Date(req.createdAt).toLocaleDateString("pt-BR"),
                    titulo: req.type,
                    status: "Recebido",
                    statusColor: "slate",
                    icon: "inventory_2",
                    fullData: req
                };

                setEnsaios([formattedNovoEnsaio, ...ensaios]);
                setActiveTab("Status de cada ensaio");
                resetForm();
                setFiles([]);
            } else {
                toast.error("Erro ao enviar solicitação: " + (json.error || "Erro desconhecido"));
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação", error);
            toast.error("Erro de conexão. Por favor, verifique sua internet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColors = (color: string) => {
        switch (color) {
            case "emerald": return "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 icon-bg-emerald-100 dark:icon-bg-emerald-500/20";
            case "amber": return "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 icon-bg-amber-100 dark:icon-bg-amber-500/20";
            case "purple": return "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 icon-bg-purple-100 dark:icon-bg-purple-500/20";
            case "blue": return "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 icon-bg-blue-100 dark:icon-bg-blue-500/20";
            case "slate": return "bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 icon-bg-slate-200 dark:icon-bg-slate-700/50";
            default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 icon-bg-gray-100 dark:icon-bg-gray-800";
        }
    };

    const getIconTheme = (color: string) => {
        switch (color) {
            case "emerald": return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30";
            case "amber": return "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-amber-500/30";
            case "purple": return "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 ring-purple-500/30";
            case "orange": return "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 ring-orange-500/30";
            case "blue": return "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-blue-500/30";
            case "slate": return "bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 ring-slate-400/30";
            default: return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ring-gray-400/30";
        }
    }

    const openPdfLink = (url: string | undefined, filename: string, mode: 'view' | 'download' = 'view') => {
        if (!url) return;
        
        if (url.startsWith('data:')) {
            try {
                const arr = url.split(',');
                const mimeMatch = arr[0].match(/:(.*?);/);
                const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                const blobUrl = URL.createObjectURL(blob);
                
                if (mode === 'download') {
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                } else {
                    window.open(blobUrl, "_blank");
                }
            } catch (e) {
                console.error("Erro ao abrir PDF", e);
                window.open(url, "_blank");
            }
        } else {
            if (mode === 'download') {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(url, "_blank");
            }
        }
    };

    const handleEditRequest = (ensaio: any) => {
        const req = ensaio.fullData;
        if (!req) return;

        const tiposParsed = req.type ? req.type.split(" + ") : [""];
        const quantidadesParsed = req.quantidadeEnsaios ? req.quantidadeEnsaios.toString().split(" + ") : [];
        
        const ensaiosAgrupados = tiposParsed.map((t: string, i: number) => ({
            tipo: t,
            quantidade: quantidadesParsed[i] || ""
        }));

        setFormData({
            tipoEnsaio: ensaiosAgrupados.length > 0 ? ensaiosAgrupados : [{ tipo: "", quantidade: "" }],
            nomeContratante: req.contractorName || "",
            nomeConstrutora: req.constructionCompany || "",
            nomeObra: req.workName || "",
            rua: req.rua || "",
            numero: req.numero || "",
            bairro: req.bairro || "",
            cidade: req.cidade || "",
            estado: req.estado || "",
            cep: req.cep || "",
            telefone: req.clientPhone || "",
            emailsProposta: req.emailsProposta && req.emailsProposta.length > 0 ? (typeof req.emailsProposta === 'string' ? req.emailsProposta.split(', ') : req.emailsProposta) : [""],
            emailsRelatorio: req.emailsRelatorio && req.emailsRelatorio.length > 0 ? (typeof req.emailsRelatorio === 'string' ? req.emailsRelatorio.split(', ') : req.emailsRelatorio) : [""],
            datasDesejadas: req.datasDesejadas && req.datasDesejadas.length > 0 ? (typeof req.datasDesejadas === 'string' ? req.datasDesejadas.split(', ') : req.datasDesejadas) : [""],
            observacoes: req.observations || ""
        });
        setEditingRequestId(ensaio.rawId);
        setIsEditing(true);
    };

    const handleAcceptProposal = (ensaio: Ensaio) => {
        setConfirmConfig({
            title: "Confirmar Aceite da Proposta",
            message: `Deseja realmente aceitar a proposta técnica comercial para o ensaio #${ensaio.id}?\n\nAo confirmar, o status será atualizado e daremos andamento ao agendamento.`,
            type: 'primary',
            confirmText: "Sim, Aceitar",
            cancelText: "Voltar",
            onConfirm: async () => {
                const loadingToast = toast.loading("Confirmando aceite da proposta...");
                try {
                    const res = await fetch('/api/solicitacoes/aceite-proposta', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            requestId: ensaio.rawId,
                            clientName: session?.user?.name || "Cliente"
                        })
                    });

                    const data = await res.json();
                    toast.dismiss(loadingToast);

                    if (res.ok && data.success) {
                        toast.success("Proposta aceita com sucesso!");
                        setModalConfig({
                            title: "Proposta Aceita!",
                            message: "Você aceitou a proposta com sucesso! Nossa equipe técnica dará andamento e entrará em contato para agendar o serviço."
                        });
                        setShowSuccessModal(true);

                        // Atualizar o estado local dos ensaios
                        setEnsaios(prevEnsaios => prevEnsaios.map(e => {
                            if (e.rawId === ensaio.rawId) {
                                return {
                                    ...e,
                                    status: "Aguardando Agendamento",
                                    statusColor: "emerald",
                                    icon: "calendar_month"
                                };
                            }
                            return e;
                        }));
                    } else {
                        toast.error(data.error || "Erro ao aceitar a proposta. Tente novamente.");
                    }
                } catch (error) {
                    toast.dismiss(loadingToast);
                    console.error("Erro ao enviar aceite", error);
                    toast.error("Erro de conexão. Verifique sua internet.");
                }
            }
        });
        setShowConfirmModal(true);
    };

    const handleConfirmPayment = (ensaio: Ensaio) => {
        setConfirmConfig({
            title: "Confirmar Pagamento",
            message: `Você confirma que já realizou o pagamento para o ensaio #${ensaio.id}?\n\nEsta confirmação será enviada para nosso departamento financeiro para agilizar a baixa.`,
            type: 'primary',
            confirmText: "Sim, Confirmar",
            cancelText: "Voltar",
            onConfirm: async () => {
                const loadingToast = toast.loading("Registrando confirmação de pagamento...");
                try {
                    const res = await fetch('/api/solicitacoes/confirmar-pagamento', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            requestId: ensaio.rawId,
                            clientName: session?.user?.name || "Cliente"
                        })
                    });

                    const data = await res.json();
                    toast.dismiss(loadingToast);

                    if (res.ok && data.success) {
                        toast.success("Pagamento confirmado com sucesso!");
                        setModalConfig({
                            title: "Pagamento Informado!",
                            message: "Sua confirmação de pagamento foi registrada com sucesso! Nosso setor financeiro processará a baixa em breve."
                        });
                        setShowSuccessModal(true);
                        
                        // Atualizar o estado local dos ensaios
                        setEnsaios(prevEnsaios => prevEnsaios.map(e => {
                            if (e.rawId === ensaio.rawId) {
                                return {
                                    ...e,
                                    clientPaymentConfirmed: true
                                };
                            }
                            return e;
                        }));
                    } else {
                        toast.error(data.error || "Erro ao confirmar pagamento. Tente novamente.");
                    }
                } catch (error) {
                    toast.dismiss(loadingToast);
                    console.error("Erro ao enviar confirmação de pagamento", error);
                    toast.error("Erro de conexão. Verifique sua internet.");
                }
            }
        });
        setShowConfirmModal(true);
    };




    const resetForm = () => {
        setIsEditing(false);
        setEditingRequestId(null);
        setFormData({
            tipoEnsaio: [{ tipo: "", quantidade: "" }],
            nomeContratante: "",
            nomeConstrutora: "",
            nomeObra: "",
            rua: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            telefone: "",
            emailsProposta: [""],
            emailsRelatorio: [""],
            datasDesejadas: [""],
            observacoes: ""
        });
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-30">
                <div className="max-w-[1600px] mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Logo area */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Image
                                    src="/logo.png"
                                    alt="MMC LAB"
                                    width={120}
                                    height={40}
                                    className="object-contain dark:brightness-200 dark:grayscale transition-all w-[100px] sm:w-[140px]"
                                    priority
                                />
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">PORTAL</span>
                            </div>
                            
                            {/* Mobile Theme Toggle & Logout */}
                            <div className="flex sm:hidden items-center gap-2">
                                <ThemeToggle />
                                <Link href="/login-cliente" className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" title="Sair">
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                </Link>
                            </div>
                        </div>

                        {/* Customer Info - Hidden on very small screens, visible on tablets up */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5 uppercase truncate max-w-[300px]">
                                <span className="material-symbols-outlined text-[18px]">business</span>
                                {clientCompany}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setActiveTab("Nova Solicitação");
                                }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 sm:py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                <span>Solicitar Ensaio</span>
                            </button>
                            
                            <div className="hidden sm:flex items-center gap-3">
                                <ThemeToggle />
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                                    <span className="text-xs font-bold uppercase truncate max-w-[100px]">{clientName.split(' ')[0]}</span>
                                </div>
                                <Link href="/login-cliente" className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Sair">
                                    <span className="material-symbols-outlined text-[20px]">logout</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 py-6 sm:py-8">
                {/* Custom Tab Navigation - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-fit">
                        <button
                            onClick={() => {
                                setActiveTab("Status de cada ensaio");
                                resetForm();
                            }}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "Status de cada ensaio" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">list_alt</span>
                            Status dos Ensaios
                        </button>
                        <button
                            onClick={() => setActiveTab("Nova Solicitação")}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "Nova Solicitação" ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{isEditing ? "edit_note" : "add_circle"}</span>
                            {isEditing ? "Editar Solicitação" : "Nova Solicitação"}
                        </button>
                    </div>

                    {activeTab === "Status de cada ensaio" && (
                        <div className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {ensaios.length} ensaios encontrados
                        </div>
                    )}
                </div>

                {/* Tab: Status List */}
                {activeTab === "Status de cada ensaio" && (
                    <div className="space-y-4 sm:space-y-6">
                        {ensaios.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl">inventory_2</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Nenhum ensaio solicitado</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                                    Você ainda não possui solicitações registradas. Clique no botão abaixo para iniciar seu primeiro pedido.
                                </p>
                                <button
                                    onClick={() => setActiveTab("Nova Solicitação")}
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-primary-dark shadow-lg shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined">add_circle</span>
                                    Solicitar Primeiro Ensaio
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {ensaios.map((ensaio) => (
                                    <div key={ensaio.rawId} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                                        {/* Status Header */}
                                        <div className="flex justify-between items-start mb-5 relative z-10">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider ${getStatusColors(ensaio.statusColor)}`}>
                                                <span className="material-symbols-outlined text-[16px]">{ensaio.icon}</span>
                                                {ensaio.status}
                                            </div>
                                            <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">
                                                ID: #{ensaio.id}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 mb-6 relative z-10">
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-bold mb-2 uppercase tracking-wide">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                {ensaio.data}
                                            </div>
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-primary transition-colors">
                                                {ensaio.titulo}
                                            </h3>
                                            
                                            {/* Survey Indicator */}
                                            {ensaio.hasPendingSurvey && (
                                                <Link 
                                                    href={`/portal-cliente/pesquisa/${ensaio.rawId}`}
                                                    className="inline-flex items-center gap-2 w-full p-3 mb-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-400 text-xs font-bold animate-pulse"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">rate_review</span>
                                                    Pendente: Pesquisa de Satisfação
                                                </Link>
                                            )}

                                            {/* Banner de Aceite de Proposta */}
                                            {ensaio.status === "Aguardando Aceite" && (
                                                <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex flex-col gap-3 relative z-10">
                                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
                                                        <span className="material-symbols-outlined text-[20px] text-amber-600 dark:text-amber-400">assignment_turned_in</span>
                                                        Proposta pendente de aceite
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-semibold">
                                                        Analise a proposta técnica comercial e confirme o aceite para darmos início ao agendamento do ensaio.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                                        <button
                                                            disabled={!ensaio.proposalPdfUrl}
                                                            onClick={() => openPdfLink(ensaio.proposalPdfUrl, `Proposta-${ensaio.id}.pdf`, 'download')}
                                                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                                                                ensaio.proposalPdfUrl
                                                                ? "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 active:scale-[0.98]"
                                                                : "bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-850 cursor-not-allowed opacity-50"
                                                            }`}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                                            Baixar Proposta
                                                        </button>
                                                        <button
                                                            onClick={() => handleAcceptProposal(ensaio)}
                                                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                            Aceitar Proposta
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Banner de Confirmação de Pagamento */}
                                            {ensaio.status === "Aguardando Pagamento" && (
                                                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex flex-col gap-3 relative z-10">
                                                    {ensaio.clientPaymentConfirmed ? (
                                                        <>
                                                            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                                                                <span className="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                                                                Pagamento confirmado
                                                            </div>
                                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-semibold">
                                                                Você já confirmou o pagamento deste ensaio. Nossa equipe financeira está realizando a conciliação financeira.
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 text-xs font-bold">
                                                                <span className="material-symbols-outlined text-[20px] text-blue-600 dark:text-blue-400">payments</span>
                                                                Aguardando Confirmação de Pagamento
                                                            </div>
                                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-semibold">
                                                                Identificamos que o faturamento foi processado. Se você já efetuou o pagamento, confirme no botão abaixo.
                                                            </p>
                                                            <div className="flex mt-1">
                                                                <button
                                                                    onClick={() => handleConfirmPayment(ensaio)}
                                                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">payments</span>
                                                                    Confirmar que já paguei
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions Grid */}
                                        <div className="grid grid-cols-2 gap-2 sm:gap-3 relative z-10">
                                            {/* Report Download */}
                                            <button
                                                disabled={!ensaio.reportPdfUrl}
                                                onClick={() => openPdfLink(ensaio.reportPdfUrl, `Relatorio-${ensaio.reportNumber || ensaio.id}.pdf`)}
                                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                                                    ensaio.reportPdfUrl 
                                                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100" 
                                                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">description</span>
                                                Relatório
                                            </button>

                                            {/* Proposal Download */}
                                            <button
                                                disabled={!ensaio.proposalPdfUrl}
                                                onClick={() => openPdfLink(
                                                    ensaio.proposalPdfUrl, 
                                                    `Proposta-${ensaio.id}.pdf`,
                                                    'download'
                                                )}
                                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                                                    ensaio.proposalPdfUrl 
                                                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 active:scale-[0.98]" 
                                                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">download</span>
                                                Baixar Proposta
                                            </button>

                                            {/* Invoice Download */}
                                            <button
                                                disabled={!ensaio.invoicePdfUrl}
                                                onClick={() => openPdfLink(ensaio.invoicePdfUrl, `NotaFiscal-${ensaio.id}.pdf`)}
                                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                                                    ensaio.invoicePdfUrl 
                                                    ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 active:scale-[0.98]" 
                                                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">receipt</span>
                                                Nota Fiscal
                                            </button>

                                            {/* Edit Button - Only if status is initial/requested */}
                                            <button
                                                disabled={ensaio.status !== "Recebido" && ensaio.status !== "Aguardando Aceite"}
                                                onClick={() => handleEditRequest(ensaio)}
                                                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                                                    ensaio.status === "Recebido" || ensaio.status === "Aguardando Aceite"
                                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-[0.98]" 
                                                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed opacity-50"
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                Revisar
                                            </button>
                                        </div>

                                        {/* Decorative Background Icon */}
                                        <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-[120px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                                            {ensaio.icon}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Nova Solicitação Form */}
                {activeTab === "Nova Solicitação" && (
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
                            {/* Form Header */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 sm:px-10 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                        {isEditing ? "Revisar Solicitação" : "Nova Demanda de Ensaio"}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Preencha os campos abaixo com as informações da obra.</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={resetForm}
                                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-slate-400">close</span>
                                </button>
                            </div>

                            <div className="p-6 sm:p-10 space-y-8">
                                {/* Section: Serviços */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-[18px]">lab_research</span>
                                        </div>
                                        <label className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Serviços Desejados</label>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-12 gap-3 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                                            <div className="col-span-10 sm:col-span-10 relative">
                                                <select
                                                    value={formData.tipoEnsaio[0].tipo}
                                                    onChange={(e) => {
                                                        const newTipos = [{ ...formData.tipoEnsaio[0], tipo: e.target.value }];
                                                        setFormData({ ...formData, tipoEnsaio: newTipos });
                                                    }}
                                                    required
                                                    className="w-full p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 text-xs sm:text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Selecione o ensaio...</option>
                                                    {Object.entries(SERVICOS_AGRUPADOS).map(([grupo, itens]) => (
                                                        <optgroup key={grupo} label={grupo} className="font-bold bg-slate-100 dark:bg-slate-800">
                                                            {itens.map((subItem: any, subIdx) => {
                                                                if (typeof subItem === "string") {
                                                                    return <option key={subItem + subIdx} value={subItem}>{subItem}</option>
                                                                } else {
                                                                    return (
                                                                        <React.Fragment key={subItem.label + subIdx}>
                                                                            <option disabled className="text-slate-400 font-semibold">── {subItem.label} ──</option>
                                                                            {subItem.subitens.map((s: string) => (
                                                                                <option key={s} value={s}>&nbsp;&nbsp;&nbsp;&nbsp;• {s}</option>
                                                                            ))}
                                                                        </React.Fragment>
                                                                    )
                                                                }
                                                            })}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-2 sm:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="Qtd"
                                                    value={formData.tipoEnsaio[0].quantidade}
                                                    onChange={(e) => {
                                                        const newTipos = [{ ...formData.tipoEnsaio[0], quantidade: e.target.value }];
                                                        setFormData({ ...formData, tipoEnsaio: newTipos });
                                                    }}
                                                    required
                                                    className="w-full p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 text-xs sm:text-sm text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Dados do Contrato */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contratante / Obra</label>
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Nome do Contratante"
                                                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                                                value={formData.nomeContratante}
                                                onChange={(e) => setFormData({...formData, nomeContratante: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nome da Obra"
                                                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                                                value={formData.nomeObra}
                                                onChange={(e) => setFormData({...formData, nomeObra: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Contato Direto</label>
                                        </div>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Telefone / WhatsApp"
                                                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                                                value={formData.telefone}
                                                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Nome da Construtora *"
                                                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                value={formData.nomeConstrutora}
                                                onChange={(e) => setFormData({...formData, nomeConstrutora: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Endereço */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Localização do Ensaio</label>
                                    </div>
                                    <div className="grid grid-cols-12 gap-3 sm:gap-4">
                                        <div className="col-span-12 sm:col-span-8">
                                            <input type="text" placeholder="Rua / Avenida" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" value={formData.rua} onChange={(e) => setFormData({...formData, rua: e.target.value})} required />
                                        </div>
                                        <div className="col-span-12 sm:col-span-4">
                                            <input type="text" placeholder="Número" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" value={formData.numero} onChange={(e) => setFormData({...formData, numero: e.target.value})} required />
                                        </div>
                                        <div className="col-span-12 sm:col-span-4">
                                            <input type="text" placeholder="Bairro" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value})} required />
                                        </div>
                                        <div className="col-span-12 sm:col-span-5">
                                            <input type="text" placeholder="Cidade" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} required />
                                        </div>
                                        <div className="col-span-6 sm:col-span-1">
                                            <select className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm appearance-none" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} required>
                                                <option value="">UF</option>
                                                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-6 sm:col-span-2">
                                            <input type="text" placeholder="CEP" className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" value={formData.cep} onChange={(e) => setFormData({...formData, cep: e.target.value})} required />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Emails e Datas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Emails Proposta */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">send</span>
                                                E-mails para Proposta
                                            </label>
                                            <button type="button" onClick={() => setFormData({...formData, emailsProposta: [...formData.emailsProposta, ""]})} className="text-[10px] font-bold text-primary hover:underline">+ Adicionar</button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.emailsProposta.map((email, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input type="email" placeholder="email@exemplo.com" className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm" value={email} onChange={(e) => {
                                                        const n = [...formData.emailsProposta];
                                                        n[idx] = e.target.value;
                                                        setFormData({...formData, emailsProposta: n});
                                                    }} required />
                                                    {idx > 0 && (
                                                        <button type="button" onClick={() => setFormData({...formData, emailsProposta: formData.emailsProposta.filter((_, i) => i !== idx)})} className="p-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Datas */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">event</span>
                                                Datas Desejadas
                                            </label>
                                            <button type="button" onClick={() => setFormData({...formData, datasDesejadas: [...formData.datasDesejadas, ""]})} className="text-[10px] font-bold text-primary hover:underline">+ Adicionar</button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.datasDesejadas.map((data, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input 
                                                        type="date" 
                                                        min={getTodayString()}
                                                        className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary" 
                                                        value={data} 
                                                        onClick={(e) => {
                                                            try {
                                                                (e.currentTarget as any).showPicker();
                                                            } catch (err) {}
                                                        }}
                                                        onFocus={(e) => {
                                                            try {
                                                                (e.currentTarget as any).showPicker();
                                                            } catch (err) {}
                                                        }}
                                                        onChange={(e) => {
                                                            const selectedDate = e.target.value;
                                                            const today = getTodayString();
                                                            if (selectedDate && selectedDate < today) {
                                                                toast.error("Por favor, selecione hoje ou uma data futura.");
                                                                return;
                                                            }
                                                            const n = [...formData.datasDesejadas];
                                                            n[idx] = selectedDate;
                                                            setFormData({...formData, datasDesejadas: n});
                                                        }} 
                                                        required 
                                                    />
                                                    {idx > 0 && (
                                                        <button type="button" onClick={() => setFormData({...formData, datasDesejadas: formData.datasDesejadas.filter((_, i) => i !== idx)})} className="p-2 text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Observações */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">notes</span>
                                        Observações / Detalhes Adicionais
                                    </label>
                                    <textarea 
                                        rows={4} 
                                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                                        placeholder="Descreva aqui detalhes importantes sobre o ensaio, materiais ou urgência..."
                                        value={formData.observacoes}
                                        onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Form Footer Actions */}
                            <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-8 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-10 py-3.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                            {isEditing ? "Salvar Alterações" : "Enviar Solicitação"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            <SuccessModal 
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    const criticalActions = ["Solicitação Atualizada!", "Solicitação Enviada!", "Pagamento Informado!", "Proposta Aceita!"];
                    if (isEditing || criticalActions.includes(modalConfig.title)) {
                        window.location.reload();
                    }
                }}
                title={modalConfig.title}
                message={modalConfig.message}
            />
            
            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                cancelText={confirmConfig.cancelText}
            />
        </div>
    );
}
