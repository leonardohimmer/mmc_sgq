"use client";

import React from "react";
import { formatOsCode } from "@/lib/os-balance-service";
import OrganogramaContratual from "@/components/OrganogramaContratual";

interface EnsaioDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ensaio: {
        id: string;
        data?: string;
        titulo?: string;
        status?: string;
        statusColor?: string;
        icon?: string;
        rawId?: string;
        osCode?: string;
        qtdContratada?: number;
        qtdEntregue?: number;
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
    } | null;
    onEdit?: (ensaio: any) => void;
    onShare?: (ensaio: any) => void;
    onAcceptProposal?: (ensaio: any) => void;
    onConfirmPayment?: (ensaio: any) => void;
}

export default function EnsaioDetailsModal({
    isOpen,
    onClose,
    ensaio,
    onEdit,
    onShare,
    onAcceptProposal,
    onConfirmPayment
}: EnsaioDetailsModalProps) {
    if (!isOpen || !ensaio) return null;

    const data = ensaio.fullData || {};

    const openPdf = (url?: string, filename?: string) => {
        if (!url) return;
        window.open(url, "_blank");
    };

    const getStatusColors = (color?: string) => {
        switch (color) {
            case "emerald": return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
            case "amber": return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
            case "blue": return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
            case "orange": return "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30";
            case "purple": return "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30";
            default: return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
        }
    };

    // Formatar tipos e quantidades
    const typesList = (data.type || ensaio.titulo || "Ensaio").split(" + ");
    const quantitiesList = (data.quantidadeEnsaios || "").toString().split(" + ");

    // Endereço completo
    const endereco = data.address || [
        data.rua ? `${data.rua}, ${data.numero || 'S/N'}` : null,
        data.bairro,
        data.cidade && data.estado ? `${data.cidade} - ${data.estado}` : data.cidade || data.estado,
        data.cep ? `CEP: ${data.cep}` : null
    ].filter(Boolean).join(" - ") || "Endereço não informado";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4 shrink-0">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                            <span className="material-symbols-outlined text-[28px]">{ensaio.icon || 'science'}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getStatusColors(ensaio.statusColor)}`}>
                                    {ensaio.status || data.status || "Em andamento"}
                                </span>
                                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30">
                                    OS: {ensaio.osCode || formatOsCode(data)}
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                {ensaio.titulo || data.type || "Detalhes do Ensaio"}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                        title="Fechar"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Modal Body Scrollable */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm">
                    {/* Linha da Obra e Contratante */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                                Obra / Empreendimento
                            </span>
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
                                <span>{ensaio.obra || data.workName || data.location || "Não especificado"}</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                                Construtora / Contratante
                            </span>
                            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">business</span>
                                <span>{data.constructionCompany || data.contractorName || "Não especificado"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Detalhamento dos Serviços Solicitados */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">list_alt</span>
                            Serviços e Quantidades Solicitadas
                        </h3>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                            {typesList.map((tipo: string, idx: number) => (
                                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs">
                                            {idx + 1}
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{tipo.trim()}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700">
                                        Qtd: {quantitiesList[idx] || "1"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Endereço da Obra */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            Localização / Endereço Completo
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-[22px] mt-0.5 shrink-0">place</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                {endereco}
                            </span>
                        </div>
                    </div>

                    {/* Datas e Contatos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-2">
                                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                Datas e Prazos
                            </h4>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Data de Solicitação:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{ensaio.data || (data.createdAt ? new Date(data.createdAt).toLocaleDateString("pt-BR") : "N/I")}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Datas Desejadas:</span>
                                <span className="font-bold text-primary">{data.datasDesejadas || data.desiredDate || "A agendar"}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-2">
                                <span className="material-symbols-outlined text-[16px]">contacts</span>
                                Informações de Contato
                            </h4>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Solicitante:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{data.clientName || "Não informado"}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Telefone:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{data.clientPhone || data.telefone || "Não informado"}</span>
                            </div>
                            {data.proposalEmail && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">E-mail Proposta:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{data.proposalEmail}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observações */}
                    {data.observations && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">notes</span>
                                Observações do Pedido
                            </h3>
                            <div className="bg-amber-50/50 dark:bg-amber-500/5 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 text-slate-700 dark:text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                                {data.observations}
                            </div>
                        </div>
                    )}

                    {/* Compartilhamento */}
                    {ensaio.sharedEmails && ensaio.sharedEmails.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">group</span>
                                Compartilhado Com
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {ensaio.sharedEmails.map((email, i) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">mail</span>
                                        {email}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Organograma Contratual Visual (Árvore de Documentos & Saldos) */}
                    <OrganogramaContratual request={data.id ? data : (ensaio.fullData || ensaio)} />
                    {data.executionItems && data.executionItems.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 p-5 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400">pie_chart</span>
                                    Saldo do Contrato ({data.qtdEntregue || 0} de {data.qtdContratada || data.executionItems.length} Ensaios Concluídos)
                                </h3>
                                <span className="px-3 py-1 bg-indigo-600 text-white font-extrabold text-xs rounded-full shadow-sm">
                                    {data.porcentagemConcluida || Math.round(((data.qtdEntregue || 0) / (data.qtdContratada || data.executionItems.length)) * 100)}% Concluído
                                </span>
                            </div>

                            {/* Barra de Progresso */}
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                                    style={{ width: `${data.porcentagemConcluida || Math.round(((data.qtdEntregue || 0) / (data.qtdContratada || data.executionItems.length)) * 100)}%` }}
                                />
                            </div>

                            {/* Indicadores Numéricos */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
                                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Contratado</span>
                                    <span className="text-base font-extrabold text-slate-900 dark:text-white">{data.qtdContratada || data.executionItems.length}</span>
                                </div>
                                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Laudos Entregues</span>
                                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{data.qtdEntregue || 0}</span>
                                </div>
                                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ensaios Pagos</span>
                                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{data.qtdPagos ?? (data.clientPaymentConfirmed ? (data.qtdContratada || data.executionItems.length) : 0)}</span>
                                </div>
                                <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block">NFs Parciais</span>
                                    <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">{data.partialInvoices ? data.partialInvoices.length : 0}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabela Cronograma de Ensaios Individuais (1 de N) */}
                    {data.executionItems && data.executionItems.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
                                Detalhamento dos Ensaios da OS ({data.executionItems.length} parcelas)
                            </h3>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {data.executionItems.map((item: any) => {
                                        const isEntregue = item.statusEntrega === 'ENVIADO_AO_CLIENTE';
                                        const isConcluido = item.statusExecucao === 'CONCLUIDO' || item.statusExecucao === 'APROVADO';

                                        return (
                                            <div key={item.id || item.numeroSequencial} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                                        isEntregue ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                                        isConcluido ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                    }`}>
                                                        #{item.numeroSequencial}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                                            <span>Ensaio {item.numeroSequencial} de {data.executionItems.length}</span>
                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                                                isEntregue ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                                                isConcluido ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                                                'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                                            }`}>
                                                                {isEntregue ? 'Relatório Entregue' : isConcluido ? 'Concluído' : item.statusExecucao || 'Pendente'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5">
                                                            {item.dataExecucao ? `Executado em: ${new Date(item.dataExecucao).toLocaleDateString('pt-BR')}` : item.dataPlanejada ? `Previsto: ${new Date(item.dataPlanejada).toLocaleDateString('pt-BR')}` : 'Aguardando agendamento'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    {item.statusFaturamento === 'FATURADO' && (
                                                        <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 rounded-lg text-[11px] font-bold">
                                                            Faturado (NF)
                                                        </span>
                                                    )}
                                                    {item.reportPdfUrl ? (
                                                        <button
                                                            onClick={() => openPdf(item.reportPdfUrl, `Laudo-Ensaio-${item.numeroSequencial}.pdf`)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                                            Laudo Parcial #{item.numeroSequencial}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Aguardando laudo</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lista de Notas Fiscais Parciais */}
                    {data.partialInvoices && data.partialInvoices.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                                Notas Fiscais Parciais Emitidas ({data.partialInvoices.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {data.partialInvoices.map((nf: any) => (
                                    <div key={nf.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white text-xs">
                                                NF nº {nf.numeroNf} ({nf.qtdFaturada} ensaio{nf.qtdFaturada > 1 ? 's' : ''})
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {nf.dataEmissao ? new Date(nf.dataEmissao).toLocaleDateString('pt-BR') : 'Data N/I'} - R$ {nf.valorNota ? nf.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                                            </div>
                                        </div>
                                        {nf.notaPdfUrl && (
                                            <button
                                                onClick={() => openPdf(nf.notaPdfUrl, `NF-${nf.numeroNf}.pdf`)}
                                                className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors"
                                                title="Baixar Nota Fiscal"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">download</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Documentos do Ensaio */}
                    {(ensaio.reportPdfUrl || ensaio.proposalPdfUrl || ensaio.invoicePdfUrl) && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                Documentos Principais da OS
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {ensaio.proposalPdfUrl && (
                                    <button
                                        onClick={() => openPdf(ensaio.proposalPdfUrl, `Proposta-${ensaio.id}.pdf`)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-2xl border bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 font-bold text-xs transition-colors shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">assignment</span>
                                        <span>Proposta Técnica</span>
                                    </button>
                                )}

                                {ensaio.reportPdfUrl && (
                                    <button
                                        onClick={() => openPdf(ensaio.reportPdfUrl, `Relatorio-${ensaio.reportNumber || ensaio.id}.pdf`)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-2xl border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 font-bold text-xs transition-colors shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">description</span>
                                        <span>Último Relatório Emitido</span>
                                    </button>
                                )}

                                {ensaio.invoicePdfUrl && (
                                    <button
                                        onClick={() => openPdf(ensaio.invoicePdfUrl, `NotaFiscal-${ensaio.id}.pdf`)}
                                        className="flex items-center justify-center gap-2 p-3 rounded-2xl border bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 font-bold text-xs transition-colors shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">receipt</span>
                                        <span>Última Nota Fiscal</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Actions */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 flex-wrap">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        Fechar
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                        {ensaio.isOwner && ensaio.status === "Aguardando Aceite" && onAcceptProposal && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onAcceptProposal(ensaio);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                Aceitar Proposta
                            </button>
                        )}

                        {ensaio.isOwner && (ensaio.status === "Recebido" || ensaio.status === "Aguardando Aceite") && onEdit && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onEdit(ensaio);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                Revisar Pedido
                            </button>
                        )}

                        {ensaio.isOwner && onShare && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onShare(ensaio);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-bold text-xs transition-colors"
                            >
                                <span className="material-symbols-outlined text-[16px]">share</span>
                                Compartilhar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
