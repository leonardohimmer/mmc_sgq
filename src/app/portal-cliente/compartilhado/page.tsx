"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { downloadPdf, viewPdf } from "@/lib/pdf-utils";

interface SharedProcessData {
    id: string;
    rawId: string;
    osCode: string;
    titulo: string;
    tipo: string;
    status: string;
    step: number;
    data: string;
    createdAt: string;
    desiredDate?: string;
    datasDesejadas?: string;
    quantidadeEnsaios?: string;
    qtdContratada: number;
    obra: string;
    contractorName?: string;
    constructionCompany?: string;
    workName?: string;
    location?: string;
    address?: string;
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    observations?: string;
    technicalObservations?: string;
    proposalPdfUrl?: string;
    reportPdfUrl?: string;
    reportNumber?: string;
    invoicePdfUrl?: string;
    invoiceNumber?: string;
    clientPaymentConfirmed?: boolean;
    executionItems?: Array<{
        id: string;
        itemNumber: number;
        tipoEnsaio: string;
        statusExecucao: string;
        statusEntrega: string;
        dataExecucao?: string;
        reportPdfUrl?: string;
        numeroRelatorio?: string;
        fotos?: string[];
    }>;
    partialInvoices?: Array<{
        id: string;
        numeroNf: string;
        dataEmissao?: string;
        valorNota?: number;
        qtdFaturada?: number;
        statusPagamento?: string;
        notaPdfUrl?: string;
    }>;
    sharedWithEmail: string;
    ownerName: string;
    isSharedView: boolean;
}

const STEPS = [
    { num: 1, label: "Recebido", icon: "inventory_2" },
    { num: 2, label: "Proposta", icon: "mark_email_read" },
    { num: 3, label: "Agendamento", icon: "calendar_month" },
    { num: 4, label: "Execução", icon: "build_circle" },
    { num: 5, label: "Relatório", icon: "edit_document" },
    { num: 6, label: "Análise", icon: "fact_check" },
    { num: 7, label: "Faturamento", icon: "receipt" },
    { num: 8, label: "Finalizado", icon: "check_circle" }
];

function SharedProcessContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processData, setProcessData] = useState<SharedProcessData | null>(null);

    useEffect(() => {
        if (!token) {
            setError("Nenhum token de acesso foi fornecido no link.");
            setLoading(false);
            return;
        }

        const fetchSharedData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/solicitacoes/compartilhado?token=${encodeURIComponent(token)}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    setProcessData(data.process);
                } else {
                    setError(data.error || "Não foi possível carregar os dados deste ensaio.");
                }
            } catch (err) {
                console.error("Erro ao carregar dados do processo compartilhado:", err);
                setError("Erro de conexão ao acessar o servidor. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchSharedData();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <div className="space-y-1">
                        <h3 className="font-extrabold text-white text-base">Validando Acesso Seguro...</h3>
                        <p className="text-xs text-slate-400">Carregando informações do processo compartilhado</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !processData) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-5">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-[32px]">lock_reset</span>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-extrabold text-white">Acesso Indisponível</h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            {error || "Este link de compartilhamento não é válido ou foi revogado."}
                        </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                        <Link
                            href="/login-cliente"
                            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-md"
                        >
                            Ir para o Portal do Cliente
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const endereco = processData.address || [
        processData.rua ? `${processData.rua}, ${processData.numero || 'S/N'}` : null,
        processData.bairro,
        processData.cidade && processData.estado ? `${processData.cidade} - ${processData.estado}` : processData.cidade || processData.estado,
        processData.cep ? `CEP: ${processData.cep}` : null
    ].filter(Boolean).join(" - ") || "Endereço não informado";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-primary selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black">
                            M
                        </div>
                        <div>
                            <span className="font-extrabold tracking-tight text-white text-sm sm:text-base">MMC Lab</span>
                            <span className="text-[10px] text-primary block -mt-1 font-semibold uppercase tracking-wider">Acesso Compartilhado</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="truncate max-w-[200px]">{processData.sharedWithEmail}</span>
                        </div>
                        <Link
                            href={`/login-cliente?email=${encodeURIComponent(processData.sharedWithEmail)}`}
                            className="px-3.5 py-1.5 rounded-xl bg-primary/15 border border-primary/30 hover:bg-primary/25 text-primary text-xs font-bold transition-all"
                        >
                            Entrar / Criar Conta
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
                {/* Banner Informativo de Permissões de Somente Leitura */}
                <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-blue-950/20">
                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[22px]">visibility</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-extrabold text-blue-200 flex items-center gap-2">
                                <span>Acesso Exclusivo para Visualização e Download</span>
                                <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                                    Convidado
                                </span>
                            </h2>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                Você está acompanhando este processo compartilhado por <strong>{processData.ownerName}</strong>. 
                                Você tem permissão para acompanhar o cronograma e realizar o download de todos os documentos técnicos.
                                Nenhuma alteração cadastral ou cancelamento pode ser feito por este acesso.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Principal: Informações do Processo */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    {/* Header do Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                                    OS #{processData.osCode}
                                </span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                                    ID: #{processData.id}
                                </span>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    {processData.status}
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-white pt-1">
                                {processData.titulo}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium">
                                {processData.obra}
                            </p>
                        </div>

                        <div className="text-left sm:text-right bg-slate-950/60 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-800/80">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Data de Solicitação</span>
                            <span className="text-sm font-extrabold text-slate-200">{processData.data}</span>
                        </div>
                    </div>

                    {/* Timeline / Linha do Tempo das Etapas */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-primary">timeline</span>
                            Progresso do Processo
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                            {STEPS.map((s) => {
                                const isCurrent = processData.step === s.num;
                                const isCompleted = processData.step > s.num;
                                return (
                                    <div
                                        key={s.num}
                                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                                            isCurrent
                                                ? "bg-primary/15 border-primary text-primary shadow-md shadow-primary/10"
                                                : isCompleted
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                : "bg-slate-950/40 border-slate-800 text-slate-500"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {isCompleted ? "check_circle" : s.icon}
                                        </span>
                                        <span className="text-[11px] font-bold leading-tight line-clamp-1">
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grid de Informações Técnicas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente / Titular</span>
                            <div className="text-sm font-extrabold text-slate-200">{processData.ownerName}</div>
                            {processData.constructionCompany && (
                                <div className="text-xs text-slate-400">{processData.constructionCompany}</div>
                            )}
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quantidade Contratada</span>
                            <div className="text-sm font-extrabold text-slate-200">
                                {processData.qtdContratada} {processData.qtdContratada === 1 ? 'ensaio' : 'ensaios'}
                            </div>
                            <div className="text-xs text-slate-400">{processData.quantidadeEnsaios || 'Volume padrão'}</div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-1 sm:col-span-2 lg:col-span-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Endereço da Obra</span>
                            <div className="text-xs font-semibold text-slate-300 line-clamp-2" title={endereco}>
                                {endereco}
                            </div>
                        </div>
                    </div>

                    {/* Observações */}
                    {processData.observations && (
                        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Observações Gerais</span>
                            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                                {processData.observations}
                            </p>
                        </div>
                    )}
                </div>

                {/* Seção de Documentos Oficiais para Download */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[22px]">download_for_offline</span>
                                Documentos Oficiais para Download
                            </h2>
                            <p className="text-xs text-slate-400">
                                Acesse e baixe os laudos técnicos, propostas e notas fiscais geradas para esta solicitação.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Proposta Técnica */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-white">Proposta Técnica</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Escopo, condições e valores contratados</p>
                                </div>
                            </div>
                            {processData.proposalPdfUrl ? (
                                <div className="flex items-center gap-2 w-full">
                                    <button
                                        type="button"
                                        onClick={() => downloadPdf(processData.proposalPdfUrl, `Proposta-OS-${processData.osCode}.pdf`)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
                                        title="Baixar arquivo PDF no computador"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">download</span>
                                        <span>Baixar Proposta (PDF)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => viewPdf(processData.proposalPdfUrl)}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                                        title="Visualizar em nova aba"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-2 px-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-500 font-medium">
                                    Documento em elaboração
                                </div>
                            )}
                        </div>

                        {/* Relatório Técnico Conclusivo */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">verified</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-white">Relatório Técnico</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {processData.reportNumber ? `Laudo Oficial nº ${processData.reportNumber}` : "Laudo Conclusivo do Ensaio"}
                                    </p>
                                </div>
                            </div>
                            {processData.reportPdfUrl ? (
                                <div className="flex items-center gap-2 w-full">
                                    <button
                                        type="button"
                                        onClick={() => downloadPdf(processData.reportPdfUrl, `Relatorio-${processData.reportNumber || processData.osCode || processData.id}.pdf`)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
                                        title="Baixar arquivo PDF no computador"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">download</span>
                                        <span>Baixar Laudo (PDF)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => viewPdf(processData.reportPdfUrl)}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                                        title="Visualizar em nova aba"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-2 px-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-500 font-medium">
                                    Aguardando emissão técnica
                                </div>
                            )}
                        </div>

                        {/* Última Nota Fiscal */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-white">Nota Fiscal</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {processData.invoiceNumber ? `NF nº ${processData.invoiceNumber}` : "Documento Fiscal da OS"}
                                    </p>
                                </div>
                            </div>
                            {processData.invoicePdfUrl ? (
                                <div className="flex items-center gap-2 w-full">
                                    <button
                                        type="button"
                                        onClick={() => downloadPdf(processData.invoicePdfUrl, `NotaFiscal-${processData.invoiceNumber || processData.osCode || processData.id}.pdf`)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20 active:scale-[0.98]"
                                        title="Baixar arquivo PDF no computador"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">download</span>
                                        <span>Baixar Nota Fiscal (PDF)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => viewPdf(processData.invoicePdfUrl)}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                                        title="Visualizar em nova aba"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-2 px-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-500 font-medium">
                                    Ainda não emitida
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Itens de Execução Parciais */}
                    {processData.executionItems && processData.executionItems.length > 0 && (
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Ensaios Parciais do Cronograma ({processData.executionItems.length})
                            </h3>
                            <div className="space-y-2">
                                {processData.executionItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 flex-wrap"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                                #{item.itemNumber}
                                            </div>
                                            <div>
                                                <div className="text-xs font-extrabold text-white">
                                                    {item.tipoEnsaio}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    {item.dataExecucao
                                                        ? `Executado em ${new Date(item.dataExecucao).toLocaleDateString("pt-BR")}`
                                                        : "Aguardando execução em campo"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                                                    item.statusExecucao === "CONCLUIDO" || item.statusExecucao === "APROVADO"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                }`}
                                            >
                                                {item.statusExecucao === "CONCLUIDO" ? "Concluído" : item.statusExecucao || "Pendente"}
                                            </span>

                                            {item.reportPdfUrl && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadPdf(item.reportPdfUrl, `Relatorio-Ensaio-${item.itemNumber}.pdf`)}
                                                        className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs"
                                                        title="Baixar Laudo Parcial"
                                                    >
                                                        <span className="material-symbols-outlined text-[15px]">download</span>
                                                        <span>Baixar</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => viewPdf(item.reportPdfUrl)}
                                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                                        title="Visualizar em nova aba"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notas Fiscais Parciais (se houver) */}
                    {processData.partialInvoices && processData.partialInvoices.length > 0 && (
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Notas Fiscais Parciais ({processData.partialInvoices.length})
                            </h3>
                            <div className="space-y-2">
                                {processData.partialInvoices.map((inv) => (
                                    <div
                                        key={inv.id}
                                        className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                                    >
                                        <div>
                                            <div className="text-xs font-extrabold text-white">
                                                Nota Fiscal nº {inv.numeroNf}
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                {inv.dataEmissao ? new Date(inv.dataEmissao).toLocaleDateString("pt-BR") : "Data N/I"}
                                                {inv.valorNota ? ` - R$ ${inv.valorNota.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                                            </div>
                                        </div>
                                        {inv.notaPdfUrl && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => downloadPdf(inv.notaPdfUrl, `NF-${inv.numeroNf}.pdf`)}
                                                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-xs"
                                                    title="Baixar Nota Fiscal"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">download</span>
                                                    <span>Baixar NF</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => viewPdf(inv.notaPdfUrl)}
                                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                                    title="Visualizar em nova aba"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Rodapé de Convite ao Portal Completo */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center space-y-3">
                    <h3 className="text-sm font-extrabold text-white">
                        Deseja gerenciar seus próprios ensaios?
                    </h3>
                    <p className="text-xs text-slate-400 max-w-lg mx-auto">
                        Crie uma conta gratuita no Portal do Cliente MMC Lab utilizando seu e-mail (<strong>{processData.sharedWithEmail}</strong>) para solicitar novos ensaios, aprovar orçamentos e centralizar todos os seus processos.
                    </p>
                    <div>
                        <Link
                            href={`/login-cliente?email=${encodeURIComponent(processData.sharedWithEmail)}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px]">person_add</span>
                            Cadastrar-se no Portal do Cliente
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center text-xs text-slate-600 border-t border-slate-900">
                <p>&copy; {new Date().getFullYear()} MMC Engenharia &amp; Laboratório Tecnológico. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default function SharedProcessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SharedProcessContent />
        </Suspense>
    );
}
