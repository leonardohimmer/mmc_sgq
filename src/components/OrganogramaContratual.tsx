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
  executionItems?: ExecutionItemData[];
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

export default function OrganogramaContratual({ request }: OrganogramaContratualProps) {
  const [hoveredNfId, setHoveredNfId] = useState<string | null>(null);
  const [hoveredSeq, setHoveredSeq] = useState<number | null>(null);

  if (!request) return null;

  const osFormattedCode = request.osCode || formatOsCode(request);

  // Calcular total de ensaios contratados
  const targetQuantity = request.qtdContratada || 
    (typeof request.quantidadeEnsaios === 'number' ? request.quantidadeEnsaios : parseInt(String(request.quantidadeEnsaios || '1')) || 1);

  const existingItems = request.executionItems || [];
  
  // Garantir lista representativa de todos os ensaios
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
      partialInvoiceId: item?.partialInvoiceId || item?.partialInvoice?.id || null,
      partialInvoice: item?.partialInvoice || null,
    };
  });

  const totalEnsaios = ensaiosList.length;
  const laudosEntregues = ensaiosList.filter((e) => e.statusEntrega === "ENVIADO_AO_CLIENTE" || Boolean(e.reportPdfUrl)).length;
  const ensaiosFaturados = ensaiosList.filter((e) => e.statusFaturamento === "FATURADO" || Boolean(e.partialInvoiceId)).length;
  const ensaiosPagos = ensaiosList.filter((e) => e.statusPagamento === "PAGO" || request.clientPaymentConfirmed).length;

  const pendentesFaturamento = Math.max(0, laudosEntregues - ensaiosFaturados);
  const pendentesPagamento = Math.max(0, totalEnsaios - ensaiosPagos);

  // Processamento e Agrupamento das Notas Fiscais Parciais
  const rawInvoices = request.partialInvoices || [];
  
  // Se não houver partialInvoices mas existir invoicePdfUrl global
  let processedInvoices: Array<{
    id: string;
    numeroNf: string;
    qtdFaturada: number;
    valorNota?: number;
    dataEmissao?: string;
    notaPdfUrl?: string | null;
    statusPagamento?: string | null;
    coveredSequenciais: number[];
  }> = [];

  if (rawInvoices.length > 0) {
    // Mapear cada NF e identificar quais ensaios ela cobre
    let unassignedFaturados = ensaiosList.filter((e) => e.statusFaturamento === 'FATURADO' || e.partialInvoiceId);

    processedInvoices = rawInvoices.map((nf) => {
      // 1. Procurar ensaios explicitamente vinculados por id
      let covered = ensaiosList.filter((e) => e.partialInvoiceId === nf.id || e.partialInvoice?.id === nf.id);
      
      // 2. Se não encontrou por ID, vincular aos primeiros faturados ainda não atribuídos
      if (covered.length === 0 && unassignedFaturados.length > 0) {
        covered = unassignedFaturados.slice(0, nf.qtdFaturada || 1);
        unassignedFaturados = unassignedFaturados.slice(nf.qtdFaturada || 1);
      }

      const coveredSequenciais = covered.map((c) => c.numeroSequencial);

      return {
        id: nf.id,
        numeroNf: nf.numeroNf,
        qtdFaturada: nf.qtdFaturada || coveredSequenciais.length || 1,
        valorNota: nf.valorNota,
        dataEmissao: nf.dataEmissao,
        notaPdfUrl: nf.notaPdfUrl,
        statusPagamento: nf.statusPagamento || (request.clientPaymentConfirmed ? 'PAGO' : 'PENDENTE'),
        coveredSequenciais: coveredSequenciais.length > 0 ? coveredSequenciais : [1],
      };
    });
  } else if (request.invoicePdfUrl || ensaiosFaturados > 0) {
    const coveredSeqs = ensaiosList.filter((e) => e.statusFaturamento === 'FATURADO' || Boolean(e.reportPdfUrl)).map((e) => e.numeroSequencial);
    processedInvoices = [
      {
        id: 'global-nf',
        numeroNf: 'Global / Única',
        qtdFaturada: coveredSeqs.length || totalEnsaios,
        notaPdfUrl: request.invoicePdfUrl,
        statusPagamento: request.clientPaymentConfirmed ? 'PAGO' : 'PENDENTE',
        coveredSequenciais: coveredSeqs.length > 0 ? coveredSeqs : ensaiosList.map((e) => e.numeroSequencial),
      },
    ];
  }

  // Lista de ensaios que ainda NÃO possuem nota fiscal emitida
  const allCoveredSeqs = new Set(processedInvoices.flatMap((nf) => nf.coveredSequenciais));
  const ensaiosSemNf = ensaiosList.filter((e) => !allCoveredSeqs.has(e.numeroSequencial));

  const openPdf = (url?: string | null) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
      {/* Brilhos de fundo decorativos */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Organograma */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </span>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-100">
              Organograma Contratual (Fluxo Horizontal)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Proposta Comercial (Esquerda) ➔ Ensaios Solicitados (Meio) ➔ Notas Fiscais Emitidas (Direita)
          </p>
        </div>

        {/* Resumo de Saldos Rápidos */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold flex items-center gap-1.5">
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

      {/* GRID HORIZONTAL: ESQUERDA (Proposta) | MEIO (Ensaios) | DIREITA (Notas Fiscais) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-6 relative z-10">

        {/* COLUNA 1: PROPOSTA COMERCIAL (ESQUERDA) */}
        <div className="lg:col-span-4 flex flex-col justify-between relative group">
          <div className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950 p-5 rounded-2xl border-2 border-blue-500/50 shadow-xl relative h-full flex flex-col justify-between hover:border-blue-400 transition-all duration-300">
            {/* Tag do Topo */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-md">
                1 • Proposta Comercial
              </span>
              <span className="text-[11px] font-mono font-extrabold text-blue-400">
                OS: #{osFormattedCode}
              </span>
            </div>

            {/* Conteúdo Principal da Proposta */}
            <div className="space-y-3 my-2">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30 shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">assignment</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {request.type || request.titulo || "Contrato de Ensaios Tecnológicos"}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Solicitado por: <strong className="text-slate-200">{request.type || "Cliente MMC"}</strong>
                  </p>
                </div>
              </div>

              {/* Quadro de Métricas Contratuais */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Contratados</span>
                  <span className="text-sm font-black text-blue-300">{totalEnsaios} Ensaio(s)</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Entregues</span>
                  <span className="text-sm font-black text-emerald-400">{laudosEntregues}/{totalEnsaios}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Quitação</span>
                  <span className="text-sm font-black text-purple-300">{ensaiosPagos}/{totalEnsaios}</span>
                </div>
              </div>
            </div>

            {/* Botão Baixar Proposta PDF */}
            <div className="pt-3 border-t border-slate-800/80 mt-auto">
              {request.proposalPdfUrl ? (
                <button
                  onClick={() => openPdf(request.proposalPdfUrl)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Visualizar Proposta Comercial PDF</span>
                </button>
              ) : (
                <div className="w-full text-center py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 italic">
                  Proposta Registrada no Sistema
                </div>
              )}
            </div>

            {/* Conector Seta para o Meio (apenas em telas grandes) */}
            <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-blue-600 border-2 border-slate-950 items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* COLUNA 2: ENSAIOS SOLICITADOS (MEIO) */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
          <div className="text-center mb-1">
            <span className="px-3 py-1 bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              2 • Ensaios Solicitados ({totalEnsaios})
            </span>
          </div>

          <div className="space-y-3">
            {ensaiosList.map((ensaio) => {
              const isExecConcluida = ensaio.statusExecucao === "CONCLUIDO" || ensaio.statusExecucao === "APROVADO";
              const isLaudoEntregue = ensaio.statusEntrega === "ENVIADO_AO_CLIENTE" || Boolean(ensaio.reportPdfUrl);
              const isFaturado = ensaio.statusFaturamento === "FATURADO" || Boolean(ensaio.partialInvoiceId);
              const isPago = ensaio.statusPagamento === "PAGO" || request.clientPaymentConfirmed;

              // Verificar se este ensaio está destacado no hover
              const nfQueCobreEste = processedInvoices.find((nf) => nf.coveredSequenciais.includes(ensaio.numeroSequencial));
              const isHighlighted = (hoveredNfId && nfQueCobreEste?.id === hoveredNfId) || hoveredSeq === ensaio.numeroSequencial;

              return (
                <div
                  key={ensaio.numeroSequencial}
                  onMouseEnter={() => setHoveredSeq(ensaio.numeroSequencial)}
                  onMouseLeave={() => setHoveredSeq(null)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 relative bg-slate-900/90 ${
                    isHighlighted
                      ? 'border-purple-400 bg-purple-950/30 shadow-lg shadow-purple-950/40 scale-[1.02]'
                      : isLaudoEntregue && isPago
                      ? 'border-emerald-500/50 hover:border-emerald-400'
                      : isLaudoEntregue
                      ? 'border-blue-500/50 hover:border-blue-400'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Topo do Ensaio Card */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[11px] ${
                        isLaudoEntregue
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        #{ensaio.numeroSequencial}
                      </span>
                      <span className="font-bold text-white text-xs">
                        Ensaio {ensaio.numeroSequencial} de {totalEnsaios}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      isLaudoEntregue 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isExecConcluida
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isLaudoEntregue ? 'Laudo Entregue' : isExecConcluida ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>

                  {/* Laudo Técnico + Botão Download */}
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 block">Laudo Técnico:</span>
                      <span className="font-mono font-bold text-slate-200 text-[11px] truncate block">
                        {ensaio.reportNumber || (ensaio.reportPdfUrl ? `REL-${ensaio.numeroSequencial}` : 'Pendente')}
                      </span>
                    </div>

                    {ensaio.reportPdfUrl ? (
                      <button
                        onClick={() => openPdf(ensaio.reportPdfUrl)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-sm shrink-0"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>Laudo #{ensaio.numeroSequencial}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Em elaboração</span>
                    )}
                  </div>

                  {/* Status de Faturamento do Ensaio */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Faturamento:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                      isPago 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : isFaturado 
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {isPago ? 'Pago' : isFaturado ? (nfQueCobreEste ? `Faturado (NF nº ${nfQueCobreEste.numeroNf})` : 'Faturado') : 'Pendente NF'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA 3: NOTAS FISCAIS PARCIAIS / EMITIDAS (DIREITA) */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
          <div className="text-center mb-1">
            <span className="px-3 py-1 bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              3 • Notas Fiscais Parciais ({processedInvoices.length})
            </span>
          </div>

          <div className="space-y-3">
            {processedInvoices.length > 0 ? (
              processedInvoices.map((nf) => {
                const isMultiEnsaio = nf.coveredSequenciais.length > 1;
                const isHighlighted = hoveredNfId === nf.id || (hoveredSeq !== null && nf.coveredSequenciais.includes(hoveredSeq));

                return (
                  <div
                    key={nf.id}
                    onMouseEnter={() => setHoveredNfId(nf.id)}
                    onMouseLeave={() => setHoveredNfId(null)}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative bg-purple-950/30 shadow-md ${
                      isHighlighted
                        ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-950/60 scale-[1.02]'
                        : 'border-purple-500/40 hover:border-purple-400'
                    }`}
                  >
                    {/* Header da NF */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        </span>
                        <span className="font-extrabold text-white text-xs">
                          Nota Fiscal nº {nf.numeroNf}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        nf.statusPagamento === 'PAGO'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {nf.statusPagamento === 'PAGO' ? 'Quitada' : 'Aguardando Pgt'}
                      </span>
                    </div>

                    {/* DESTAQUE VISUAL DE MULTI-ENSAIO (Conexão com os ensaios referentes) */}
                    <div className="my-2 bg-slate-950/80 p-2.5 rounded-xl border border-purple-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Abrangência de Ensaios:</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                          isMultiEnsaio 
                            ? 'bg-purple-600 text-white shadow-sm' 
                            : 'bg-slate-800 text-purple-300 border border-purple-500/30'
                        }`}>
                          <span className="material-symbols-outlined text-[13px]">link</span>
                          {isMultiEnsaio 
                            ? `Cobre ${nf.coveredSequenciais.length} Ensaios (Ensaios #${nf.coveredSequenciais.join(" e #")})` 
                            : `Cobre Ensaio #${nf.coveredSequenciais[0]}`}
                        </span>
                      </div>

                      {nf.valorNota && (
                        <div className="flex justify-between text-xs pt-1 border-t border-slate-800/80">
                          <span className="text-slate-400">Valor Faturado:</span>
                          <span className="font-bold text-purple-200">
                            R$ {nf.valorNota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botão Baixar Nota Fiscal PDF */}
                    {nf.notaPdfUrl ? (
                      <button
                        onClick={() => openPdf(nf.notaPdfUrl)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">download</span>
                        <span>Baixar NF nº {nf.numeroNf} (PDF)</span>
                      </button>
                    ) : (
                      <div className="w-full text-center py-1.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[10px] text-slate-400 italic">
                        Aguardando postagem do PDF da NF
                      </div>
                    )}
                  </div>
                );
              })
            ) : null}

            {/* Ensaios Pendentes de Nota Fiscal */}
            {ensaiosSemNf.length > 0 && (
              <div className="p-4 rounded-2xl border border-dashed border-amber-500/40 bg-amber-950/10 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>{ensaiosSemNf.length} Ensaio(s) Pendente(s) de Nota Fiscal</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ensaios #{ensaiosSemNf.map((e) => e.numeroSequencial).join(", #")} aguardando emissão de NF parcial pelo financeiro.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
