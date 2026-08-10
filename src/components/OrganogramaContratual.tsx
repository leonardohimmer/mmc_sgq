"use client";

import React, { useState } from "react";
import { formatOsCode } from "@/lib/os-balance-service";

interface ExecutionItemData {
  id: string;
  numeroSequencial: number;
  statusExecucao: string;
  statusEntrega: string;
  statusFaturamento: string;
  statusPagamento?: string | null;
  reportNumber?: string | null;
  reportPdfUrl?: string | null;
  partialInvoiceId?: string | null;
  partialInvoice?: {
    id: string;
    numeroNf: string;
    valorNota?: number;
    notaPdfUrl?: string | null;
    statusPagamento?: string | null;
  } | null;
}

interface PartialInvoiceData {
  id: string;
  numeroNf: string;
  qtdFaturada: number;
  valorNota?: number;
  dataEmissao?: string;
  notaPdfUrl?: string | null;
  statusPagamento?: string | null;
}

export interface OrganogramaRequestData {
  id: string;
  osCode?: string;
  type?: string;
  titulo?: string;
  createdAt?: string | Date | null;
  paymentConfirmedAt?: string | Date | null;
  clientPaymentConfirmedAt?: string | Date | null;
  proposalPdfUrl?: string | null;
  reportPdfUrl?: string | null;
  reportNumber?: string | null;
  invoicePdfUrl?: string | null;
  quantidadeEnsaios?: number | string | null;
  qtdContratada?: number;
  qtdExecutada?: number;
  qtdEntregue?: number;
  qtdFaturada?: number;
  qtdPagos?: number;
  clientPaymentConfirmed?: boolean;
  satisfactionSurvey?: { status?: string } | null;
  executionItems?: ExecutionItemData[];
  partialInvoices?: PartialInvoiceData[];
}

interface OrganogramaContratualProps {
  request: OrganogramaRequestData;
  compact?: boolean;
}

export default function OrganogramaContratual({ request, compact = false }: OrganogramaContratualProps) {
  const [activeTab, setActiveTab] = useState<"tree" | "summary">("tree");

  if (!request) return null;

  const osFormattedCode = request.osCode || formatOsCode(request);

  // Calcular itens de execução
  const targetQuantity = request.qtdContratada || 
    (typeof request.quantidadeEnsaios === 'number' ? request.quantidadeEnsaios : parseInt(String(request.quantidadeEnsaios || '1')) || 1);

  const existingItems = request.executionItems || [];
  
  // Garantir representação de todos os ensaios contratados
  const ensaiosList = Array.from({ length: Math.max(targetQuantity, existingItems.length) }, (_, idx) => {
    const seq = idx + 1;
    const item = existingItems.find((i) => i.numeroSequencial === seq);
    return {
      numeroSequencial: seq,
      id: item?.id || `virtual-${seq}`,
      statusExecucao: item?.statusExecucao || "PENDENTE",
      statusEntrega: item?.statusEntrega || "PENDENTE",
      statusFaturamento: item?.statusFaturamento || "PENDENTE",
      statusPagamento: item?.statusPagamento || (request.clientPaymentConfirmed ? "PAGO" : "PENDENTE"),
      reportNumber: item?.reportNumber || (seq === 1 && request.reportNumber ? request.reportNumber : null),
      reportPdfUrl: item?.reportPdfUrl || (seq === 1 && request.reportPdfUrl ? request.reportPdfUrl : null),
      partialInvoiceId: item?.partialInvoiceId || null,
      partialInvoice: item?.partialInvoice || null,
    };
  });

  const totalEnsaios = ensaiosList.length;
  const ensaiosExecutados = ensaiosList.filter((e) => e.statusExecucao === "CONCLUIDO" || e.statusExecucao === "APROVADO").length;
  const laudosEntregues = ensaiosList.filter((e) => e.statusEntrega === "ENVIADO_AO_CLIENTE" || Boolean(e.reportPdfUrl)).length;
  const ensaiosFaturados = ensaiosList.filter((e) => e.statusFaturamento === "FATURADO" || Boolean(e.partialInvoiceId)).length;
  const ensaiosPagos = ensaiosList.filter((e) => e.statusPagamento === "PAGO" || request.clientPaymentConfirmed).length;

  const pendentesFaturamento = Math.max(0, laudosEntregues - ensaiosFaturados);
  const pendentesPagamento = Math.max(0, totalEnsaios - ensaiosPagos);

  const partialInvoices = request.partialInvoices || [];

  const openPdf = (url?: string | null) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-slate-900/90 text-white rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
      {/* Brilhos de fundo decorativos (Glows) */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Organograma com Resumo de Saldos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
            </span>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Organograma Contratual & Saldos da OS
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Fluxo hierárquico interligando Proposta Comercial, Ensaios e Notas Fiscais Parciais.
          </p>
        </div>

        {/* Badges de Contadores Rápidos */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-blue-400 text-[16px]">science</span>
            {laudosEntregues}/{totalEnsaios} Laudos
          </span>

          <span className={`px-3 py-1.5 rounded-xl border font-extrabold flex items-center gap-1.5 ${
            pendentesFaturamento > 0 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            {pendentesFaturamento > 0 ? `${pendentesFaturamento} Pendente(s) NF` : 'NFs em dia'}
          </span>

          <span className={`px-3 py-1.5 rounded-xl border font-extrabold flex items-center gap-1.5 ${
            pendentesPagamento > 0 
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            <span className="material-symbols-outlined text-[16px]">payments</span>
            {pendentesPagamento > 0 ? `${pendentesPagamento} a Quitar` : '100% Quitados'}
          </span>
        </div>
      </div>

      {/* ÁRVORE DO ORGANOGRAMA (ORGANOGRAM TREE FLOW) */}
      <div className="pt-6 relative z-10 space-y-6">

        {/* NÍVEL 1: NÓ RAIZ - PROPOSTA COMERCIAL */}
        <div className="flex flex-col items-center">
          <div className="group relative bg-gradient-to-br from-blue-900/80 via-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl border-2 border-blue-500/50 shadow-lg shadow-blue-950/50 hover:border-blue-400 transition-all max-w-lg w-full text-center">
            {/* Tag no topo */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-md">
              Nível 1 • Proposta Comercial Mãe
            </div>

            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">assignment</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
                    OS: #{osFormattedCode}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {request.type || request.titulo || "Contrato de Ensaios Tecnológicos"}
                  </h4>
                </div>
              </div>

              {request.proposalPdfUrl ? (
                <button
                  onClick={() => openPdf(request.proposalPdfUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
                  title="Baixar Proposta Comercial em PDF"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Proposta PDF</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  Proposta Registrada
                </span>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Contratado</span>
                <span className="text-sm font-black text-blue-300">{totalEnsaios} Ensaio(s)</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Entregues</span>
                <span className="text-sm font-black text-emerald-400">{laudosEntregues}/{totalEnsaios}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block font-bold">Quitação</span>
                <span className="text-sm font-black text-purple-300">{ensaiosPagos}/{totalEnsaios}</span>
              </div>
            </div>
          </div>

          {/* Linha Tronco Vertical Principal */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
          </div>
        </div>

        {/* NÍVEL 2: RAMIFICAÇÃO DOS ENSAIOS (PARCELAS 1 de N) */}
        <div className="relative">
          {/* Header do Nível 2 */}
          <div className="text-center mb-4">
            <span className="px-3 py-1 bg-indigo-900/80 border border-indigo-500/40 text-indigo-200 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Nível 2 • Detalhamento dos {totalEnsaios} Ensaio(s) Solicitado(s)
            </span>
          </div>

          {/* Grid de Cards dos Ensaios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
            {ensaiosList.map((ensaio) => {
              const isExecConcluida = ensaio.statusExecucao === "CONCLUIDO" || ensaio.statusExecucao === "APROVADO";
              const isLaudoEntregue = ensaio.statusEntrega === "ENVIADO_AO_CLIENTE" || Boolean(ensaio.reportPdfUrl);
              const isFaturado = ensaio.statusFaturamento === "FATURADO" || Boolean(ensaio.partialInvoiceId);
              const isPago = ensaio.statusPagamento === "PAGO" || request.clientPaymentConfirmed;

              // Encontrar Nota Fiscal Parcial associada a este ensaio especificamente
              const associatedNf = partialInvoices.find(
                (nf) => nf.id === ensaio.partialInvoiceId
              );

              return (
                <div key={ensaio.numeroSequencial} className="flex flex-col items-center">
                  {/* Card do Ensaio Individual */}
                  <div className={`w-full p-4 rounded-2xl border transition-all duration-300 bg-slate-900/90 relative flex flex-col justify-between min-h-[220px] ${
                    isLaudoEntregue && isPago
                      ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/20 hover:border-emerald-400'
                      : isLaudoEntregue
                      ? 'border-blue-500/60 shadow-lg shadow-blue-950/20 hover:border-blue-400'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}>
                    {/* Header do Ensaio */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            isLaudoEntregue 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            #{ensaio.numeroSequencial}
                          </span>
                          <span className="font-bold text-white text-xs">
                            Ensaio {ensaio.numeroSequencial} de {totalEnsaios}
                          </span>
                        </div>

                        {/* Badge de Execução */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          isLaudoEntregue 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isExecConcluida
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {isLaudoEntregue ? 'Laudo Entregue' : isExecConcluida ? 'Concluído' : 'Pendente'}
                        </span>
                      </div>

                      {/* Informações de Laudo Emitido */}
                      <div className="mt-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Laudo Técnico:</span>
                          <span className="font-mono font-bold text-slate-200 text-[11px]">
                            {ensaio.reportNumber || (ensaio.reportPdfUrl ? `REL-${ensaio.numeroSequencial}` : 'Pendente')}
                          </span>
                        </div>

                        {ensaio.reportPdfUrl ? (
                          <button
                            onClick={() => openPdf(ensaio.reportPdfUrl)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Baixar Laudo #{ensaio.numeroSequencial}</span>
                          </button>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic text-center py-1 bg-slate-900 rounded-lg">
                            Aguardando elaboração do relatório
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status de Faturamento e Quitação do Ensaio */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Faturamento:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isPago 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : isFaturado 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isPago ? 'Pago' : isFaturado ? 'Faturado (NF)' : 'Pendente'}
                        </span>
                      </div>

                      {isPago ? (
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]" title="Pagamento confirmado">check_circle</span>
                      ) : isFaturado ? (
                        <span className="material-symbols-outlined text-purple-400 text-[18px]" title="Nota Fiscal Emitida">receipt</span>
                      ) : (
                        <span className="material-symbols-outlined text-amber-400 text-[18px]" title="Aguardando faturamento">warning</span>
                      )}
                    </div>
                  </div>

                  {/* Linha Conectora Descendente para o Nível 3 (Notas Fiscais) */}
                  <div className="w-0.5 h-6 bg-purple-500/50 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>

                  {/* NÍVEL 3: NÓ DA NOTA FISCAL PARCIAL (VINCULADA AO ENSAIO) */}
                  <div className="w-full">
                    {associatedNf ? (
                      <div className="bg-purple-950/40 border border-purple-500/40 p-3 rounded-xl text-xs space-y-1.5 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-purple-300 flex items-center gap-1 text-[11px]">
                            <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                            NF nº {associatedNf.numeroNf}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            associatedNf.statusPagamento === 'PAGO' || isPago
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {associatedNf.statusPagamento === 'PAGO' || isPago ? 'Quitada' : 'Aguardando Pgt'}
                          </span>
                        </div>

                        {associatedNf.valorNota && (
                          <div className="text-[11px] text-slate-300 font-medium">
                            Valor: R$ {associatedNf.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        )}

                        {associatedNf.notaPdfUrl && (
                          <button
                            onClick={() => openPdf(associatedNf.notaPdfUrl)}
                            className="w-full flex items-center justify-center gap-1 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">download</span>
                            <span>Baixar NF</span>
                          </button>
                        )}
                      </div>
                    ) : isFaturado && request.invoicePdfUrl ? (
                      <div className="bg-purple-950/30 border border-purple-500/30 p-2.5 rounded-xl text-xs flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">receipt</span>
                          NF Global Vinculada
                        </span>
                        <button
                          onClick={() => openPdf(request.invoicePdfUrl)}
                          className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-md"
                        >
                          Baixar NF
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-dashed border-slate-800 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {isLaudoEntregue ? "⚠️ Pendente de NF Parcial" : "Aguardando Ensaio"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOTAS FISCAIS PARCIAIS GLOBAIS (SE HOUVER NFs NÃO VINCULADAS DIRETAMENTE A UM SÓ ITEM) */}
        {partialInvoices.length > 0 && (
          <div className="pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              Resumo de Notas Fiscais Parciais Emitidas ({partialInvoices.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {partialInvoices.map((nf) => (
                <div key={nf.id} className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-purple-200">
                      NF nº {nf.numeroNf} ({nf.qtdFaturada} ensaio{nf.qtdFaturada > 1 ? 's' : ''})
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {nf.valorNota ? `R$ ${nf.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Valor N/I'}
                      {nf.dataEmissao ? ` • ${new Date(nf.dataEmissao).toLocaleDateString('pt-BR')}` : ''}
                    </div>
                  </div>

                  {nf.notaPdfUrl && (
                    <button
                      onClick={() => openPdf(nf.notaPdfUrl)}
                      className="p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center"
                      title="Baixar Nota Fiscal PDF"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
