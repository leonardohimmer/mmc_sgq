"use client"

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import SuccessModal from "@/components/SuccessModal";
import ConfirmModal from "@/components/ConfirmModal";
import MMCLoadingScreen from "@/components/MMCLoadingScreen";
import { SkeletonGrid } from "@/components/SkeletonCard";
import Cropper from "react-easy-crop";
import EnsaioDetailsModal from "@/components/EnsaioDetailsModal";
import { ModalPasswordChange } from "@/components/ModalPasswordChange";
import OrganogramaContratual from "@/components/OrganogramaContratual";



interface Ensaio {
    id: string;
    osCode: string;
    data: string;
    titulo: string;
    status: string;
    statusColor: "amber" | "emerald" | "blue" | "slate" | "orange" | "purple";
    icon: string;
    rawId: string;
    qtdContratada: number;
    qtdEntregue: number;
    reportPdfUrl?: string;
    reportNumber?: string;
    proposalPdfUrl?: string;
    invoicePdfUrl?: string;
    clientPaymentConfirmed?: boolean;
    hasPendingSurvey?: boolean;
    hasCompletedSurvey?: boolean;
    sharedEmails?: string[];
    isOwner?: boolean;
    obra?: string;
    fullData?: any;
}

const SERVICOS_AGRUPADOS = {
    "Ensaios": [
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

const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.substring(0, 11);
    if (limited.length <= 2) {
        return limited;
    }
    if (limited.length <= 6) {
        return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
    }
    if (limited.length <= 10) {
        return `(${limited.substring(0, 2)}) ${limited.substring(2, 6)}-${limited.substring(6)}`;
    }
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
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

    // Estados para pesquisa, perfil e construtora
    const [searchTerm, setSearchTerm] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [constructorLogoUrl, setConstructorLogoUrl] = useState<string | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Estados para o Modal de Detalhes
    const [selectedEnsaioForDetails, setSelectedEnsaioForDetails] = useState<Ensaio | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleOpenDetailsModal = (ensaio: Ensaio) => {
        setSelectedEnsaioForDetails(ensaio);
        setShowDetailsModal(true);
    };

    // Estados para o Modal de Compartilhamento
    const [sharingEnsaio, setSharingEnsaio] = useState<Ensaio | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleOpenShareModal = (ensaio: Ensaio) => {
        setSharingEnsaio(ensaio);
        setShowShareModal(true);
    };

    const handleSaveShareSuccess = (rawId: string, updatedEmails: string[]) => {
        setEnsaios(prev =>
            prev.map(e => (e.rawId === rawId ? { ...e, sharedEmails: updatedEmails } : e))
        );
    };

    // Estados para o Cropper de Imagem
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
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
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
    const [scheduleModal, setScheduleModal] = useState<{
        isOpen: boolean;
        ensaio: Ensaio | null;
        itemNum: number;
        qtdAgendar: number;
        desiredDate: string;
        timeSlot: string;
        notes: string;
        isSubmitting: boolean;
    }>({
        isOpen: false,
        ensaio: null,
        itemNum: 1,
        qtdAgendar: 1,
        desiredDate: "",
        timeSlot: "Manhã (08:00 - 12:00)",
        notes: "",
        isSubmitting: false
    });

    const toggleExpandCard = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenScheduleModal = (ensaio: Ensaio, e: React.MouseEvent) => {
        e.stopPropagation();
        const entregues = ensaio.qtdEntregue || 0;
        const contratados = ensaio.qtdContratada || 1;
        const nextItemNum = Math.min(entregues + 1, contratados);
        setScheduleModal({
            isOpen: true,
            ensaio,
            itemNum: nextItemNum,
            qtdAgendar: 1,
            desiredDate: getTodayString(),
            timeSlot: "Manhã (08:00 - 12:00)",
            notes: "",
            isSubmitting: false
        });
    };

    const handleSubmitSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduleModal.ensaio) return;

        setScheduleModal(prev => ({ ...prev, isSubmitting: true }));
        try {
            const endItemNum = scheduleModal.itemNum + scheduleModal.qtdAgendar - 1;
            const itemText = scheduleModal.qtdAgendar === 1
                ? `Ensaio ${scheduleModal.itemNum}`
                : `Ensaios ${scheduleModal.itemNum} a ${endItemNum}`;
            const fullNotes = `Solicitado pelo Cliente: ${scheduleModal.qtdAgendar} ensaio(s) (${itemText}) | Horário: ${scheduleModal.timeSlot}${scheduleModal.notes ? ` | ${scheduleModal.notes}` : ''}`;

            const res = await fetch(`/api/solicitacoes/${scheduleModal.ensaio.rawId}/itens`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numeroSequencial: scheduleModal.itemNum,
                    qtdAgendar: scheduleModal.qtdAgendar,
                    dataPlanejada: scheduleModal.desiredDate,
                    observacoes: fullNotes,
                    statusExecucao: 'AGENDADO'
                })
            });

            const json = await res.json();
            if (res.ok) {
                toast.success(`Solicitação de agendamento de ${scheduleModal.qtdAgendar} ensaio(s) (${itemText}) para ${new Date(scheduleModal.desiredDate + 'T12:00:00').toLocaleDateString('pt-BR')} enviada! Aguardando confirmação do colaborador.`);
                setScheduleModal(prev => ({ ...prev, isOpen: false }));
                fetchClientRequests();
            } else {
                toast.error(json.error || "Erro ao agendar ensaio.");
            }
        } catch (err: any) {
            toast.error("Erro ao conectar com o servidor.");
        } finally {
            setScheduleModal(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    // 1. Carregar cache local de ensaios imediatamente ao montar (Zero Delay)
    useEffect(() => {
        try {
            const cachedKey = `mmc_client_ensaios_cache_${session?.user?.email || 'user'}`;
            const cached = localStorage.getItem(cachedKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setEnsaios(parsed);
                    setIsLoadingData(false);
                }
            }
        } catch (e) {
            console.error("Erro ao ler cache local de ensaios:", e);
        }
    }, [session?.user?.email]);

    const filteredEnsaios = ensaios.filter(ensaio => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        return (
            (ensaio.titulo || "").toLowerCase().includes(query) ||
            (ensaio.id || "").toLowerCase().includes(query) ||
            (ensaio.status || "").toLowerCase().includes(query)
        );
    });

    const fetchClientRequests = useCallback(() => {
        if (status === "loading" || !session?.user?.name) return;

        const nameEncoded = encodeURIComponent(session.user.name);
        const emailEncoded = encodeURIComponent(session.user.email || '');
        const currentUserEmail = (session.user.email || '').toLowerCase().trim();
        const currentUserName = (session.user.name || '').toLowerCase().trim();

        fetch(`/api/solicitacoes/cliente?clientName=${nameEncoded}&userEmail=${emailEncoded}`)
            .then(res => res.json())
            .then((data: any[]) => {
                if (Array.isArray(data)) {
                    const formatted = data.map(req => {
                        const reqClientEmail = (req.clientEmail || '').toLowerCase().trim();
                        const reqClientName = (req.clientName || '').toLowerCase().trim();
                        const isOwner = Boolean(
                            (currentUserEmail && reqClientEmail && currentUserEmail === reqClientEmail) ||
                            (currentUserName && reqClientName && currentUserName === reqClientName)
                        );

                        const refDate = new Date(req.clientPaymentConfirmedAt || req.paymentConfirmedAt || req.createdAt);
                        const yyyy = refDate.getFullYear();
                        const mm = String(refDate.getMonth() + 1).padStart(2, '0');
                        const dd = String(refDate.getDate()).padStart(2, '0');
                        const hh = String(refDate.getHours()).padStart(2, '0');
                        const min = String(refDate.getMinutes()).padStart(2, '0');
                        const osCode = `${yyyy}${mm}${dd}-${hh}${min}`;

                        const items = req.executionItems || [];
                        const qtdContratada = Math.max(req.qtdContratada || 1, items.length || 1);
                        const countDelivered = items.filter(
                            (i: any) => i.statusEntrega === 'ENVIADO_AO_CLIENTE' || i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO' || Boolean(i.reportPdfUrl && i.reportPdfUrl.trim() !== '')
                        ).length;
                        const qtdEntregue = req.qtdEntregue !== undefined && req.qtdEntregue > 0
                            ? req.qtdEntregue
                            : (countDelivered > 0 ? countDelivered : (req.reportPdfUrl ? 1 : 0));

                        return {
                            id: req.id.split('-')[0].toUpperCase(),
                            osCode,
                            rawId: req.id,
                            qtdContratada,
                            qtdEntregue,
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
                            sharedEmails: req.sharedEmails || [],
                            isOwner: isOwner,
                            obra: req.workName || req.location || req.contractorName || "",
                            fullData: req
                        };
                    }) as (Ensaio & { fullData: any })[];

                    setEnsaios(formatted);
                    try {
                        const cachedKey = `mmc_client_ensaios_cache_${session?.user?.email || 'user'}`;
                        localStorage.setItem(cachedKey, JSON.stringify(formatted));
                    } catch (e) {
                        console.error("Erro ao salvar cache de ensaios:", e);
                    }
                }
                setIsLoadingData(false);
            })
            .catch(err => {
                console.error("Erro ao carregar dados", err);
                setIsLoadingData(false);
            });
    }, [status, session?.user?.name, session?.user?.email]);

    useEffect(() => {
        fetchClientRequests();
        const interval = setInterval(fetchClientRequests, 15000);
        return () => clearInterval(interval);
    }, [fetchClientRequests]);

    // Carregar foto do perfil do usuário e logo da construtora
    useEffect(() => {
        if (status === "loading" || !session?.user) return;

        // 1. Carregar perfil para avatarUrl
        fetch("/api/users/profile")
            .then(res => res.json())
            .then(data => {
                if (data && data.avatarUrl) {
                    setAvatarUrl(data.avatarUrl);
                }
            })
            .catch(err => console.error("Erro ao buscar perfil do usuário:", err));

        // 2. Carregar conteúdo do site para buscar logo da construtora
        fetch("/api/site-content?section=clients")
            .then(res => res.json())
            .then(data => {
                const clientsList = data.clients?.items || [];
                const match = clientsList.find((c: any) => 
                    c.name && clientCompany && c.name.toLowerCase().trim() === clientCompany.toLowerCase().trim()
                );
                if (match && match.logoUrl) {
                    setConstructorLogoUrl(match.logoUrl);
                }
            })
            .catch(err => console.error("Erro ao buscar conteúdos do site:", err));
    }, [session, status, clientCompany]);

    // Lógica para Upload e Ajuste de Imagem de Perfil (Cropper)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImg = async (imageSrc: string, crop: any): Promise<string> => {
        const image = new window.Image();
        image.src = imageSrc;
        await new Promise(resolve => image.onload = resolve);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 200;
        canvas.height = 200;

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
        );

        return canvas.toDataURL("image/jpeg", 0.7);
    };

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels);
            setAvatarUrl(croppedImage);
            setImageSrc(null); // Fechar modal do cropper
        } catch (e) {
            console.error("Erro ao cortar imagem:", e);
            toast.error("Erro ao cortar a imagem.");
        }
    };

    const handleSaveProfilePhoto = async (photoBase64: string) => {
        setIsSavingProfile(true);
        try {
            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl: photoBase64 })
            });

            if (res.ok) {
                toast.success("Foto de perfil atualizada com sucesso!");
                setShowProfileModal(false);
            } else {
                const data = await res.json();
                toast.error(data.error || "Erro ao salvar foto de perfil.");
            }
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            toast.error("Erro ao salvar a foto de perfil.");
        } finally {
            setIsSavingProfile(false);
        }
    };

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
                clientEmail: session?.user?.email || null,
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
                const refDate = new Date(req?.createdAt || Date.now());
                const yyyy = refDate.getFullYear();
                const mm = String(refDate.getMonth() + 1).padStart(2, '0');
                const dd = String(refDate.getDate()).padStart(2, '0');
                const hh = String(refDate.getHours()).padStart(2, '0');
                const min = String(refDate.getMinutes()).padStart(2, '0');
                const osCode = `${yyyy}${mm}${dd}-${hh}${min}`;

                const formattedNovoEnsaio: Ensaio = {
                    id: req.id.split('-')[0].toUpperCase(),
                    osCode,
                    rawId: req.id,
                    qtdContratada: req.qtdContratada || 1,
                    qtdEntregue: 0,
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
        setActiveTab("Nova Solicitação");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAcceptProposal = (ensaio: Ensaio) => {
        const ensaioText = (ensaio.qtdContratada || 1) > 1 ? `para os ensaios OS ${ensaio.osCode}` : `para o ensaio OS ${ensaio.osCode}`;
        setConfirmConfig({
            title: "Confirmar Aceite da Proposta",
            message: `Deseja realmente aceitar a proposta técnica comercial ${ensaioText}?\n\nAo confirmar, o status será atualizado e daremos andamento ao agendamento.`,
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
        const ensaioText = (ensaio.qtdContratada || 1) > 1 ? `para os ensaios OS ${ensaio.osCode}` : `para o ensaio OS ${ensaio.osCode}`;
        setConfirmConfig({
            title: "Confirmar Pagamento",
            message: `Você confirma que já realizou o pagamento ${ensaioText}?\n\nEsta confirmação será enviada para nosso departamento financeiro para agilizar a baixa.`,
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
        setActiveTab("Status de cada ensaio");
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
                                    className="object-contain transition-all w-[100px] sm:w-[140px]"
                                    priority
                                />
                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">PORTAL</span>
                            </div>
                            
                            {/* Mobile Theme Toggle, Profile & Logout */}
                            <div className="flex sm:hidden items-center gap-2">
                                <ThemeToggle />
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                                    title="Meu Perfil"
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={clientName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    )}
                                </button>
                                <Link href="/login-cliente" className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" title="Sair">
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                </Link>
                            </div>
                        </div>

                        {/* Customer Info - Hidden on very small screens, visible on tablets up */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2 uppercase truncate max-w-[300px]">
                                {constructorLogoUrl ? (
                                    <img src={constructorLogoUrl} alt={clientCompany} className="w-6 h-6 object-contain rounded-md shrink-0" />
                                ) : (
                                    <span className="material-symbols-outlined text-[18px] shrink-0">business</span>
                                )}
                                <span>{clientCompany}</span>
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
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-left focus:outline-none"
                                    title="Meu Perfil"
                                >
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={clientName} className="w-5 h-5 rounded-full object-cover shrink-0" />
                                    ) : (
                                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">person</span>
                                    )}
                                    <span className="text-xs font-bold uppercase truncate max-w-[100px]">{clientName.split(' ')[0]}</span>
                                </button>
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
                {/* Tab: Status List */}
                {activeTab === "Status de cada ensaio" && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Caixa de Pesquisa de Ensaios */}
                        {ensaios.length > 0 && (
                            <div className="relative max-w-md w-full animate-in fade-in slide-in-from-top-1 duration-200">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[20px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Pesquisar por ensaio ou ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-300"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {(status === "loading" || isLoadingData) && ensaios.length === 0 ? (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <MMCLoadingScreen 
                                    compact={true} 
                                    message="Buscando seus ensaios..." 
                                    submessage="Sincronizando em tempo real com os servidores MMC LAB" 
                                />
                                <SkeletonGrid count={6} />
                            </div>
                        ) : ensaios.length === 0 ? (
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
                        ) : filteredEnsaios.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-slate-400 text-3xl">search_off</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Nenhum ensaio encontrado</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                                    Não encontramos nenhum ensaio correspondente a "{searchTerm}".
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 items-start">
                                {filteredEnsaios.map((ensaio) => (
                                    <div 
                                        key={ensaio.rawId} 
                                        onClick={() => handleOpenDetailsModal(ensaio)}
                                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col hover:-translate-y-0.5"
                                    >
                                        {/* Status Header */}
                                        <div className="flex justify-between items-start mb-2 relative z-10 gap-1.5 flex-wrap">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColors(ensaio.statusColor)}`}>
                                                    <span className="material-symbols-outlined text-[14px]">{ensaio.icon}</span>
                                                    {ensaio.status}
                                                </div>
                                                {ensaio.sharedEmails && ensaio.sharedEmails.length > 0 && (
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30" title={`Compartilhado com: ${ensaio.sharedEmails.join(', ')}`}>
                                                        <span className="material-symbols-outlined text-[12px]">group</span>
                                                        <span>{ensaio.sharedEmails.length}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30">
                                                OS: {ensaio.osCode}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 mb-2 relative z-10">
                                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] sm:text-[11px] font-bold mb-1.5 uppercase tracking-wide flex-wrap">
                                                <span className="flex items-center gap-1 shrink-0">
                                                    <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                                                    {ensaio.data}
                                                </span>
                                                {ensaio.obra && (
                                                    <>
                                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-bold truncate max-w-[200px]" title={ensaio.obra}>
                                                            <span className="material-symbols-outlined text-[13px] text-primary shrink-0">apartment</span>
                                                            <span className="truncate">{ensaio.obra}</span>
                                                        </span>
                                                    </>
                                                )}
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-extrabold text-[10px] ${
                                                    (ensaio.qtdEntregue || 0) > 0 
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' 
                                                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20'
                                                }`}>
                                                    <span className="material-symbols-outlined text-[12px]">description</span>
                                                    <span>{ensaio.qtdEntregue || 0} de {ensaio.qtdContratada || 1} {ensaio.qtdContratada === 1 ? 'relatório' : 'relatórios'}</span>
                                                </span>
                                            </div>
                                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-primary transition-colors">
                                                {ensaio.titulo}
                                            </h3>
                                            
                                            {/* Survey Indicator (Apenas para o criador do ensaio) */}
                                            {ensaio.hasPendingSurvey && ensaio.isOwner && (
                                                 <Link 
                                                     href={`/portal-cliente/pesquisa/${ensaio.rawId}`}
                                                     onClick={(e) => e.stopPropagation()}
                                                     className="inline-flex items-center justify-between gap-1.5 w-full p-2.5 my-1.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/10 border border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-extrabold shadow-sm hover:scale-[1.01] transition-all"
                                                 >
                                                     <div className="flex items-center gap-1.5">
                                                         <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400 shrink-0">rate_review</span>
                                                         <span>Pesquisa de Satisfação Disponível ({ensaio.qtdEntregue} de {ensaio.qtdContratada} ensaios realizados)</span>
                                                     </div>
                                                     <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
                                                 </Link>
                                            )}

                                            {/* Banner de Confirmação de Pagamento da Nota Fiscal (Exibido SOMENTE se a Nota Fiscal foi enviada) */}
                                            {(() => {
                                                const hasNfEnviada = Boolean(ensaio.invoicePdfUrl) || 
                                                    Boolean(ensaio.fullData?.partialInvoices && ensaio.fullData.partialInvoices.some((inv: any) => Boolean(inv.notaPdfUrl) || Boolean(inv.numeroNf)));
                                                
                                                if (!ensaio.clientPaymentConfirmed && (ensaio.isOwner ?? true) && hasNfEnviada) {
                                                    return (
                                                        <div className="mt-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex flex-col gap-2 relative z-10 shadow-xs">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 text-xs font-extrabold">
                                                                    <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">payments</span>
                                                                    Aguardando Confirmação de Pagamento
                                                                </div>
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                                                                    Pendente
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-medium">
                                                                O faturamento/Nota Fiscal deste ensaio foi processado. Se você já efetuou o pagamento, confirme no botão abaixo para agilizar a baixa.
                                                            </p>
                                                            <div className="flex mt-0.5">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleConfirmPayment(ensaio); }}
                                                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:scale-[1.01] active:scale-[0.98]"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">payments</span>
                                                                    Confirmar que já paguei
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>

                                        {/* Actions Grid */}
                                        <div className="flex flex-col gap-2 w-full mt-2 relative z-10">
                                            {/* Botão de Agendamento por Saldo */}
                                            {((ensaio.qtdContratada || 1) - (ensaio.qtdEntregue || 0)) > 0 && 
                                              ensaio.isOwner && 
                                              ensaio.status !== "Recebido" && 
                                              ensaio.status !== "Aguardando Aceite" && (
                                                <button
                                                    onClick={(e) => handleOpenScheduleModal(ensaio, e)}
                                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                                    <span>Agendar Próximo Ensaio (Saldo: {((ensaio.qtdContratada || 1) - (ensaio.qtdEntregue || 0))} {((ensaio.qtdContratada || 1) - (ensaio.qtdEntregue || 0)) === 1 ? 'restante' : 'restantes'})</span>
                                                </button>
                                            )}

                                            {/* Toggle de Documentos Dentro do Card */}
                                            <button
                                                onClick={(e) => toggleExpandCard(ensaio.rawId, e)}
                                                className="w-full flex items-center justify-between p-2 px-3 rounded-xl text-[11px] font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">folder_open</span>
                                                    <span>Ver Documentos (Proposta, Relatórios, NFs)</span>
                                                </div>
                                                <span className="material-symbols-outlined text-[18px] transition-transform duration-200" style={{ transform: expandedCardIds[ensaio.rawId] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                    expand_more
                                                </span>
                                            </button>

                                            {/* Conteúdo Expandido de Documentos */}
                                            {expandedCardIds[ensaio.rawId] && (
                                                <div className="w-full p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                                    {/* Proposta Comercial */}
                                                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                                                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[16px] text-blue-500">assignment</span>
                                                            Proposta Comercial:
                                                        </span>
                                                        {ensaio.proposalPdfUrl ? (
                                                            <button
                                                                onClick={() => openPdfLink(ensaio.proposalPdfUrl, `Proposta-${ensaio.osCode}.pdf`, 'view')}
                                                                className="px-2.5 py-1 rounded-lg font-extrabold text-[10px] bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1 shadow-sm"
                                                            >
                                                                <span className="material-symbols-outlined text-[13px]">download</span>
                                                                Visualizar Proposta
                                                            </button>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Pendente</span>
                                                        )}
                                                    </div>

                                                    {/* Relatórios de Ensaio (1 de N, 2 de N...) */}
                                                    <div className="space-y-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80">
                                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-[16px] text-emerald-500">description</span>
                                                                Relatórios Parciais ({ensaio.qtdEntregue} de {ensaio.qtdContratada}):
                                                            </span>
                                                        </div>
                                                        
                                                        {(() => {
                                                            const items = (ensaio.fullData?.executionItems || []).filter((item: any) => item.reportPdfUrl && item.reportPdfUrl.trim() !== "");
                                                            if (items.length > 0) {
                                                                return (
                                                                    <div className="space-y-1.5 pl-1">
                                                                        {items.map((item: any) => (
                                                                            <div key={item.id || item.numeroSequencial} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/80 p-2 px-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs">
                                                                                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate pr-2">
                                                                                    <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                                                                        #{item.numeroSequencial}
                                                                                    </span>
                                                                                    <span className="truncate">Relatório {item.numeroSequencial} de {ensaio.qtdContratada}</span>
                                                                                    {item.reportNumber && <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">({item.reportNumber})</span>}
                                                                                </span>
                                                                                <button
                                                                                    onClick={() => openPdfLink(item.reportPdfUrl, `Relatorio-Ensaio-${item.numeroSequencial}.pdf`, 'view')}
                                                                                    className="px-2.5 py-1 rounded-lg font-extrabold text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 shadow-xs shrink-0"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-[13px]">download</span>
                                                                                    Baixar PDF
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            } else if (ensaio.reportPdfUrl) {
                                                                return (
                                                                    <div className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/80 p-2 px-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs">
                                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                                            <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                                                                #1
                                                                            </span>
                                                                            <span>Relatório Geral {ensaio.reportNumber ? `(${ensaio.reportNumber})` : ''}</span>
                                                                        </span>
                                                                        <button
                                                                            onClick={() => openPdfLink(ensaio.reportPdfUrl, `Relatorio-${ensaio.reportNumber || ensaio.id}.pdf`, 'view')}
                                                                            className="px-2.5 py-1 rounded-lg font-extrabold text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 shadow-xs"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[13px]">download</span>
                                                                            Baixar PDF
                                                                        </button>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div className="text-[11px] text-slate-400 italic pl-5">
                                                                        {ensaio.qtdEntregue > 0 ? `${ensaio.qtdEntregue} relatório(s) entregue(s)` : "Aguardando postagem de relatórios"}
                                                                    </div>
                                                                );
                                                            }
                                                        })()}
                                                    </div>

                                                    {/* Notas Fiscais Parciais */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-[16px] text-purple-500">receipt</span>
                                                                Notas Fiscais Parciais:
                                                            </span>
                                                        </div>

                                                        {(() => {
                                                            const invoices = (ensaio.fullData?.partialInvoices || []).filter((inv: any) => inv.notaPdfUrl || inv.invoicePdfUrl);
                                                            if (invoices.length > 0) {
                                                                return (
                                                                    <div className="space-y-1.5 pl-1">
                                                                        {invoices.map((inv: any, idx: number) => {
                                                                            const pdfUrl = inv.notaPdfUrl || inv.invoicePdfUrl;
                                                                            return (
                                                                                <div key={inv.id || idx} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/80 p-2 px-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs">
                                                                                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate pr-2">
                                                                                        <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                                                                            NF
                                                                                        </span>
                                                                                        <span className="truncate">Nota Fiscal nº {inv.numeroNf || inv.nfeNumber || (idx + 1)}</span>
                                                                                        {inv.qtdFaturada && <span className="text-[10px] text-slate-400 hidden sm:inline">({inv.qtdFaturada} ensaio{inv.qtdFaturada > 1 ? 's' : ''})</span>}
                                                                                    </span>
                                                                                    <button
                                                                                        onClick={() => openPdfLink(pdfUrl, `NF-${inv.numeroNf || (idx + 1)}.pdf`, 'view')}
                                                                                        className="px-2.5 py-1 rounded-lg font-extrabold text-[10px] bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center gap-1 shadow-xs shrink-0"
                                                                                    >
                                                                                        <span className="material-symbols-outlined text-[13px]">download</span>
                                                                                        Baixar NF
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                );
                                                            } else if (ensaio.invoicePdfUrl) {
                                                                return (
                                                                    <div className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900/80 p-2 px-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-xs">
                                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                                            <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                                                                                NF
                                                                            </span>
                                                                            <span>Nota Fiscal Comercial</span>
                                                                        </span>
                                                                        <button
                                                                            onClick={() => openPdfLink(ensaio.invoicePdfUrl, `NotaFiscal-${ensaio.id}.pdf`, 'view')}
                                                                            className="px-2.5 py-1 rounded-lg font-extrabold text-[10px] bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center gap-1 shadow-xs"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[13px]">download</span>
                                                                            Baixar NF
                                                                        </button>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div className="text-[11px] text-slate-400 italic pl-5">
                                                                        Aguardando faturamento
                                                                    </div>
                                                                );
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Primary Actions Row (Aceitar / Revisar / Compartilhar) */}
                                            {ensaio.isOwner ? (
                                                <div className="flex flex-row gap-1.5 relative z-10 w-full">
                                                    {ensaio.status === "Aguardando Aceite" && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleAcceptProposal(ensaio); }}
                                                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/30 active:scale-[0.98] truncate"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px] shrink-0">check_circle</span>
                                                            <span className="truncate">Aceitar Proposta</span>
                                                        </button>
                                                    )}
                                                    {(ensaio.status === "Recebido" || ensaio.status === "Aguardando Aceite") && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditRequest(ensaio); }}
                                                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-[0.98] truncate"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px] shrink-0">edit</span>
                                                            <span className="truncate">Revisar</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleOpenShareModal(ensaio); }}
                                                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-primary/10 hover:text-primary hover:border-primary/30 active:scale-[0.98] truncate"
                                                        title="Compartilhar visualização do ensaio por e-mail"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px] text-primary shrink-0">share</span>
                                                        <span className="truncate">Compartilhar</span>
                                                        {ensaio.sharedEmails && ensaio.sharedEmails.length > 0 && (
                                                            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-primary/20 text-primary font-extrabold">
                                                                {ensaio.sharedEmails.length}
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                    <span className="material-symbols-outlined text-[13px]">visibility</span>
                                                    Acesso apenas para visualização
                                                </div>
                                            )}
                                        </div>
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
                                                onChange={(e) => setFormData({...formData, telefone: formatPhoneNumber(e.target.value)})}
                                                required
                                                maxLength={15}
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

            <ShareModal
                ensaio={sharingEnsaio}
                isOpen={showShareModal}
                onClose={() => {
                    setShowShareModal(false);
                    setSharingEnsaio(null);
                }}
                onSaveSuccess={handleSaveShareSuccess}
            />

                            {/* Modal de Perfil do Cliente */}
                            {showProfileModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                                        {/* Header */}
                                        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">person</span>
                                                Meu Perfil
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setShowProfileModal(false);
                                                    // Reset avatarUrl from database if they cropped but didn't save
                                                    fetch("/api/users/profile")
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            if (data && data.avatarUrl) {
                                                                setAvatarUrl(data.avatarUrl);
                                                            } else {
                                                                setAvatarUrl(null);
                                                            }
                                                        })
                                                        .catch(console.error);
                                                }}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                            >
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-6">
                                            {/* Avatar Upload Container */}
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                                    {avatarUrl ? (
                                                        <img src={avatarUrl} alt={clientName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[48px] text-slate-400">person</span>
                                                    )}
                                                    <label
                                                        htmlFor="avatar-upload"
                                                        className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center px-1"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px] mb-0.5">photo_camera</span>
                                                        Alterar
                                                    </label>
                                                </div>
                                                <input
                                                    type="file"
                                                    id="avatar-upload"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    onClick={(e) => {
                                                        // Reset value to allow uploading same file
                                                        (e.target as HTMLInputElement).value = "";
                                                    }}
                                                />
                                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Clique na foto para alterar</span>
                                            </div>

                                            {/* User details */}
                                            <div className="space-y-4">
                                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900/50 space-y-3">
                                                    <div>
                                                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Nome Completo</label>
                                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{clientName}</div>
                                                    </div>
                                                    <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                                                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Construtora</label>
                                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                                                            {constructorLogoUrl && (
                                                                <img src={constructorLogoUrl} alt={clientCompany} className="w-4 h-4 object-contain" />
                                                            )}
                                                            {clientCompany}
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                                                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">E-mail</label>
                                                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{session?.user?.email}</div>
                                                    </div>
                                                    <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsPasswordModalOpen(true)}
                                                            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60 group"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">lock_reset</span>
                                                                <span>Redefinir / Alterar Senha</span>
                                                            </span>
                                                            <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                                            <button
                                                onClick={() => {
                                                    setShowProfileModal(false);
                                                    // Reset avatarUrl from database
                                                    fetch("/api/users/profile")
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            if (data && data.avatarUrl) {
                                                                setAvatarUrl(data.avatarUrl);
                                                            } else {
                                                                setAvatarUrl(null);
                                                            }
                                                        })
                                                        .catch(console.error);
                                                }}
                                                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold transition-all text-xs"
                                            >
                                                Fechar
                                            </button>
                                            <button
                                                onClick={() => handleSaveProfilePhoto(avatarUrl || "")}
                                                disabled={isSavingProfile}
                                                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all text-xs shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-1.5"
                                            >
                                                {isSavingProfile ? (
                                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[16px]">save</span>
                                                )}
                                                Salvar Alterações
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cropper Modal (Submodal do Perfil) */}
                            {imageSrc && (
                                <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
                                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">crop</span>
                                                Ajustar Foto
                                            </h3>
                                            <button onClick={() => setImageSrc(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
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
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">Ajustar Zoom</label>
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">zoom_out</span>
                                                    <input
                                                        type="range"
                                                        min={1}
                                                        max={3}
                                                        step={0.1}
                                                        value={zoom}
                                                        onChange={(e) => setZoom(Number(e.target.value))}
                                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">zoom_in</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3 mt-2">
                                                <button onClick={() => setImageSrc(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs">
                                                    Cancelar
                                                </button>
                                                <button onClick={showCroppedImage} className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold transition-all shadow-lg shadow-primary/20 text-xs">
                                                    Cortar e Ajustar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <EnsaioDetailsModal
                                isOpen={showDetailsModal}
                                onClose={() => setShowDetailsModal(false)}
                                ensaio={selectedEnsaioForDetails}
                                onEdit={handleEditRequest}
                                onShare={handleOpenShareModal}
                                onAcceptProposal={handleAcceptProposal}
                                onConfirmPayment={handleConfirmPayment}
                            />

                            {/* Modal de Agendamento do Próximo Ensaio */}
                            {scheduleModal.isOpen && scheduleModal.ensaio && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setScheduleModal(prev => ({ ...prev, isOpen: false }))}>
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30">
                                                    OS: {scheduleModal.ensaio.osCode}
                                                </span>
                                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                                                    {scheduleModal.qtdAgendar === 1
                                                        ? `Agendar Ensaio ${scheduleModal.itemNum} de ${scheduleModal.ensaio.qtdContratada}`
                                                        : `Agendar ${scheduleModal.qtdAgendar} Ensaios (Ensaios ${scheduleModal.itemNum} a ${scheduleModal.itemNum + scheduleModal.qtdAgendar - 1} de ${scheduleModal.ensaio.qtdContratada})`
                                                    }
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {scheduleModal.ensaio.titulo}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setScheduleModal(prev => ({ ...prev, isOpen: false }))}
                                                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">close</span>
                                            </button>
                                        </div>
                                        <form onSubmit={handleSubmitSchedule} className="space-y-4">
                                            {/* Seleção da Quantidade do Saldo a Agendar */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
                                                    <span>Quantidade de Ensaios a Agendar *</span>
                                                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold lowercase">
                                                        (saldo restante: {Math.max(1, (scheduleModal.ensaio?.qtdContratada || 1) - (scheduleModal.ensaio?.qtdEntregue || 0))})
                                                    </span>
                                                </label>
                                                <select
                                                    value={scheduleModal.qtdAgendar}
                                                    onChange={(e) => setScheduleModal(prev => ({ ...prev, qtdAgendar: Number(e.target.value) }))}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                >
                                                    {Array.from({ length: Math.max(1, (scheduleModal.ensaio?.qtdContratada || 1) - (scheduleModal.ensaio?.qtdEntregue || 0)) }, (_, i) => i + 1).map(num => (
                                                        <option key={num} value={num}>
                                                            {num} {num === 1 ? 'ensaio' : 'ensaios'} {num === ((scheduleModal.ensaio?.qtdContratada || 1) - (scheduleModal.ensaio?.qtdEntregue || 0)) ? '(saldo total)' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                    Data Desejada para a Execução *
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    min={getTodayString()}
                                                    value={scheduleModal.desiredDate}
                                                    onChange={(e) => setScheduleModal(prev => ({ ...prev, desiredDate: e.target.value }))}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                    Turno Preferencial
                                                </label>
                                                <select
                                                    value={scheduleModal.timeSlot}
                                                    onChange={(e) => setScheduleModal(prev => ({ ...prev, timeSlot: e.target.value }))}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                >
                                                    <option value="Manhã (08:00 - 12:00)">Manhã (08:00 - 12:00)</option>
                                                    <option value="Tarde (13:00 - 17:00)">Tarde (13:00 - 17:00)</option>
                                                    <option value="Horário Comercial (Flexível)">Horário Comercial (Flexível)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                    Observações da Obra / Local Exato
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Ex: Ponto de contato na obra, pavimento/bloco específico, instruções de acesso..."
                                                    value={scheduleModal.notes}
                                                    onChange={(e) => setScheduleModal(prev => ({ ...prev, notes: e.target.value }))}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setScheduleModal(prev => ({ ...prev, isOpen: false }))}
                                                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={scheduleModal.isSubmitting}
                                                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {scheduleModal.isSubmitting ? (
                                                        <>
                                                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            <span>Agendando...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                            <span>Confirmar Agendamento</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <ModalPasswordChange
                                isOpen={isPasswordModalOpen}
                                onClose={() => setIsPasswordModalOpen(false)}
                            />
                        </div>
                    );
                }

function ShareModal({
    ensaio,
    isOpen,
    onClose,
    onSaveSuccess
}: {
    ensaio: Ensaio | null;
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: (rawId: string, updatedEmails: string[]) => void;
}) {
    const [emails, setEmails] = useState<string[]>(ensaio?.sharedEmails || []);
    const [newEmailInput, setNewEmailInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEmails(ensaio?.sharedEmails || []);
        setNewEmailInput("");
    }, [ensaio]);

    if (!isOpen || !ensaio) return null;

    const handleAddEmail = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = newEmailInput.trim().toLowerCase();
        if (!trimmed) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            toast.error("Por favor, digite um endereço de e-mail válido.");
            return;
        }

        if (emails.includes(trimmed)) {
            toast.error("Este e-mail já está adicionado na lista de compartilhamento.");
            return;
        }

        setEmails([...emails, trimmed]);
        setNewEmailInput("");
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter(e => e !== emailToRemove));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/solicitacoes/${ensaio.rawId}/compartilhar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sharedEmails: emails })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Permissões de compartilhamento salvas com sucesso!");
                onSaveSuccess(ensaio.rawId, data.sharedEmails);
                onClose();
            } else {
                toast.error(data.error || "Erro ao salvar compartilhamento.");
            }
        } catch (error) {
            console.error("Erro ao salvar e-mails compartilhados:", error);
            toast.error("Erro de conexão ao salvar os e-mails.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[22px]">share</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Compartilhar Ensaio #{ensaio.id}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {ensaio.titulo}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
                        <span>
                            As pessoas com os e-mails cadastrados abaixo poderão acompanhar o status, cronograma e baixar propostas e relatórios deste processo no Portal do Cliente.
                        </span>
                    </p>

                    {/* Form Adicionar Email */}
                    <form onSubmit={handleAddEmail} className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                                mail
                            </span>
                            <input
                                type="email"
                                placeholder="digite.o.email@empresa.com"
                                value={newEmailInput}
                                onChange={(e) => setNewEmailInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 shrink-0"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Adicionar
                        </button>
                    </form>

                    {/* Lista de E-mails */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                            <span>E-mails Autorizados ({emails.length})</span>
                            {emails.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setEmails([])}
                                    className="text-[10px] text-red-500 hover:underline normal-case font-semibold"
                                >
                                    Remover todos
                                </button>
                            )}
                        </div>

                        {emails.length === 0 ? (
                            <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl mb-1">mark_email_unread</span>
                                <p className="text-xs font-medium text-slate-400">Nenhum e-mail adicionado para este ensaio ainda.</p>
                            </div>
                        ) : (
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                {emails.map((email) => (
                                    <div
                                        key={email}
                                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl transition-all"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 text-xs font-bold">
                                                {email[0].toUpperCase()}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                {email}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEmail(email)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                                            title="Remover e-mail"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">check</span>
                                Salvar Compartilhamento
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
