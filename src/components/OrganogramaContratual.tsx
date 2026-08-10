"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'proposta-ensaio' | 'ensaio-nf';
  seq?: number;
  nfId?: string;
}

export default function OrganogramaContratual({ request }: OrganogramaContratualProps) {
  const [hoveredNfId, setHoveredNfId] = useState<string | null>(null);
  const [hoveredSeq, setHoveredSeq] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);
  const ensaioRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const nfRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [lines, setLines] = useState<ConnectionLine[]>([]);

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
      statusPagamento: item?.statusPagamento || (request.paymentConfirmedAt ? "PAGO" : "PENDENTE"),
      reportNumber: item?.reportNumber || (seq === 1 && request.reportNumber ? request.reportNumber : null),
      reportPdfUrl: item?.reportPdfUrl || (seq === 1 && request.reportPdfUrl ? request.reportPdfUrl : null),
      partialInvoiceId: item?.partialInvoiceId || item?.partialInvoice?.id || null,
      partialInvoice: item?.partialInvoice || null,
    };
  });

  const totalEnsaios = ensaiosList.length;
  const laudosEntregues = ensaiosList.filter((e) => e.statusEntrega === "ENVIADO_AO_CLIENTE" || Boolean(e.reportPdfUrl)).length;
  const ensaiosFaturados = ensaiosList.filter((e) => e.statusFaturamento === "FATURADO" || Boolean(e.partialInvoiceId)).length;
  const ensaiosPagos = ensaiosList.filter((e) => e.statusPagamento === "PAGO" || Boolean(request.paymentConfirmedAt)).length;

  const pendentesFaturamento = Math.max(0, laudosEntregues - ensaiosFaturados);
  const pendentesPagamento = Math.max(0, totalEnsaios - ensaiosPagos);

  // Processamento e Agrupamento das Notas Fiscais Parciais
  const rawInvoices = request.partialInvoices || [];
  
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
    let unassignedFaturados = ensaiosList.filter((e) => e.statusFaturamento === 'FATURADO' || e.partialInvoiceId);

    processedInvoices = rawInvoices.map((nf) => {
      let covered = ensaiosList.filter((e) => e.partialInvoiceId === nf.id || e.partialInvoice?.id === nf.id);
      
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
        statusPagamento: nf.statusPagamento || (request.paymentConfirmedAt ? 'PAGO' : 'PENDENTE'),
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
        statusPagamento: request.paymentConfirmedAt ? 'PAGO' : 'PENDENTE',
        coveredSequenciais: coveredSeqs.length > 0 ? coveredSeqs : ensaiosList.map((e) => e.numeroSequencial),
      },
    ];
  }

  // Lista de ensaios que ainda NÃO possuem nota fiscal emitida
  const allCoveredSeqs = new Set(processedInvoices.flatMap((nf) => nf.coveredSequenciais));
  const ensaiosSemNf = ensaiosList.filter((e) => !allCoveredSeqs.has(e.numeroSequencial));

  // Agrupamento por Clusters (NF + Seus Ensaios) para centralizar verticalmente
  const clusters: Array<{
    id: string;
    nf: typeof processedInvoices[0] | null;
    ensaios: typeof ensaiosList;
  }> = [];

  processedInvoices.forEach((nf) => {
    const ensaiosDoNf = ensaiosList.filter((e) => nf.coveredSequenciais.includes(e.numeroSequencial));
    clusters.push({
      id: `cluster-nf-${nf.id}`,
      nf,
      ensaios: ensaiosDoNf,
    });
  });

  if (ensaiosSemNf.length > 0) {
    clusters.push({
      id: "cluster-sem-nf",
      nf: null,
      ensaios: ensaiosSemNf,
    });
  }

  // Recalcular as coordenadas das linhas SVG de conexão
  const updateLines = useCallback(() => {
    if (!containerRef.current || !proposalRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const proposalRect = proposalRef.current.getBoundingClientRect();

    const proposalRight = proposalRect.right - containerRect.left;
    const proposalCenterY = proposalRect.top + proposalRect.height / 2 - containerRect.top;

    const newLines: ConnectionLine[] = [];

    // 1. Conexão Proposta -> Cada Ensaio
    ensaiosList.forEach((e) => {
      const ensaioEl = ensaioRefs.current[e.numeroSequencial];
      if (ensaioEl) {
        const eRect = ensaioEl.getBoundingClientRect();
        const eLeft = eRect.left - containerRect.left;
        const eCenterY = eRect.top + eRect.height / 2 - containerRect.top;

        newLines.push({
          id: `p-to-e-${e.numeroSequencial}`,
          x1: proposalRight,
          y1: proposalCenterY,
          x2: eLeft,
          y2: eCenterY,
          type: 'proposta-ensaio',
          seq: e.numeroSequencial,
        });
      }
    });

    // 2. Conexão Ensaio -> Nota Fiscal Correspondente
    processedInvoices.forEach((nf) => {
      const nfEl = nfRefs.current[nf.id];
      if (nfEl) {
        const nfRect = nfEl.getBoundingClientRect();
        const nfLeft = nfRect.left - containerRect.left;
        const nfCenterY = nfRect.top + nfRect.height / 2 - containerRect.top;

        nf.coveredSequenciais.forEach((seq) => {
          const ensaioEl = ensaioRefs.current[seq];
          if (ensaioEl) {
            const eRect = ensaioEl.getBoundingClientRect();
            const eRight = eRect.right - containerRect.left;
            const eCenterY = eRect.top + eRect.height / 2 - containerRect.top;

            newLines.push({
              id: `e-${seq}-to-nf-${nf.id}`,
              x1: eRight,
              y1: eCenterY,
              x2: nfLeft,
              y2: nfCenterY,
              type: 'ensaio-nf',
              seq,
              nfId: nf.id,
            });
          }
        });
      }
    });

    setLines(newLines);
  }, [ensaiosList, processedInvoices]);

  useEffect(() => {
    updateLines();
    const t1 = setTimeout(updateLines, 100);
    const t2 = setTimeout(updateLines, 500);

    window.addEventListener('resize', updateLines);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines]);

  const openPdf = (url?: string | null) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-slate-950 text-white rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden font-sans"
    >
      {/* Overlay SVG com Linhas de Conexão */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block overflow-visible">
        <defs>
          <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {lines.map((line) => {
          const isHovered = 
            (hoveredNfId && line.nfId === hoveredNfId) || 
            (hoveredSeq !== null && line.seq === hoveredSeq);

          const dx = Math.max(30, Math.abs(line.x2 - line.x1) * 0.45);
          const pathD = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

          const isPropostaLine = line.type === 'proposta-ensaio';
          const strokeColor = isHovered 
            ? (isPropostaLine ? '#60a5fa' : '#c084fc')
            : (isPropostaLine ? 'rgba(59, 130, 246, 0.4)' : 'rgba(168, 85, 247, 0.4)');

          const strokeWidth = isHovered ? 3 : 1.75;

          return (
            <g key={line.id}>
              {/* Linha Curva de Conexão */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={isPropostaLine ? 'none' : '5,3'}
                filter={isHovered ? 'url(#glow-purple)' : undefined}
                className="transition-all duration-300"
              />
              {/* Ponto de Início */}
              <circle
                cx={line.x1}
                cy={line.y1}
                r={isHovered ? 4 : 2.5}
                fill={isPropostaLine ? '#3b82f6' : '#a855f7'}
              />
              {/* Ponto de Destino */}
              <circle
                cx={line.x2}
                cy={line.y2}
                r={isHovered ? 4 : 2.5}
                fill={isPropostaLine ? '#3b82f6' : '#a855f7'}
              />
            </g>
          );
        })}
      </svg>

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
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-6 relative z-10 min-w-[760px]">

          {/* COLUNA 1: PROPOSTA COMERCIAL (ESQUERDA) */}
          <div className="flex flex-col justify-center h-full relative group">
            <div
              ref={proposalRef}
              className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950 p-4 rounded-xl border-2 border-blue-500/50 shadow-xl relative flex flex-col justify-between hover:border-blue-400 transition-all duration-300 my-auto"
            >
              {/* Tag do Topo */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest rounded-full shadow-md">
                  1 • Proposta Comercial
                </span>
                <span className="text-[10px] font-mono font-extrabold text-blue-400">
                  OS: #{osFormattedCode}
                </span>
              </div>

              {/* Conteúdo Principal da Proposta */}
              <div className="space-y-2.5 my-2">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30 shrink-0 shadow-inner">
                    <span className="material-symbols-outlined text-[18px]">assignment</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {request.type || request.titulo || "Contrato de Ensaios Tecnológicos"}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Solicitado por: <strong className="text-slate-200">{request.type || "Cliente MMC"}</strong>
                    </p>
                  </div>
                </div>

                {/* Quadro de Métricas Contratuais */}
                <div className="grid grid-cols-3 gap-1.5 text-center pt-1">
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[8px] text-slate-400 uppercase font-bold block">Contratados</span>
                    <span className="text-xs font-black text-blue-300">{totalEnsaios} Ensaio(s)</span>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[8px] text-slate-400 uppercase font-bold block">Entregues</span>
                    <span className="text-xs font-black text-emerald-400">{laudosEntregues}/{totalEnsaios}</span>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[8px] text-slate-400 uppercase font-bold block">Quitação</span>
                    <span className="text-xs font-black text-purple-300">{ensaiosPagos}/{totalEnsaios}</span>
                  </div>
                </div>
              </div>

              {/* Botão Baixar Proposta PDF */}
              <div className="pt-2 border-t border-slate-800/80 mt-auto">
                {request.proposalPdfUrl ? (
                  <button
                    onClick={() => openPdf(request.proposalPdfUrl)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg shadow-md transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    <span>Visualizar Proposta PDF</span>
                  </button>
                ) : (
                  <div className="w-full text-center py-1.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[10px] text-slate-400 italic">
                    Proposta Registrada no Sistema
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUNAS 2 & 3 AGRUPADAS POR CLUSTERS (MEIO & DIREITA) */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center mb-1">
              <span className="px-2.5 py-0.5 bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                2 • Ensaios Solicitados ({totalEnsaios})
              </span>
              <span className="px-2.5 py-0.5 bg-purple-950 border border-purple-500/40 text-purple-300 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                3 • Notas Fiscais Parciais ({processedInvoices.length})
              </span>
            </div>

            {clusters.map((cluster) => {
              const nf = cluster.nf;
              const isMultiEnsaio = nf ? nf.coveredSequenciais.length > 1 : false;
              const isNfHighlighted = nf ? (hoveredNfId === nf.id || (hoveredSeq !== null && nf.coveredSequenciais.includes(hoveredSeq))) : false;

              return (
                <div
                  key={cluster.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/80"
                >
                  {/* SUB-COLUNA MEIO: ENSAIOS DESTE CLUSTER */}
                  <div className="space-y-2">
                    {cluster.ensaios.map((ensaio) => {
                      const isExecConcluida = ensaio.statusExecucao === "CONCLUIDO" || ensaio.statusExecucao === "APROVADO";
                      const isLaudoEntregue = ensaio.statusEntrega === "ENVIADO_AO_CLIENTE" || Boolean(ensaio.reportPdfUrl);
                      const isFaturado = ensaio.statusFaturamento === "FATURADO" || Boolean(ensaio.partialInvoiceId);
                      const isPago = ensaio.statusPagamento === "PAGO" || Boolean(request.paymentConfirmedAt);

                      const isEnsaioHighlighted = (hoveredNfId && nf?.id === hoveredNfId) || hoveredSeq === ensaio.numeroSequencial;

                      return (
                        <div
                          key={ensaio.numeroSequencial}
                          ref={(el) => { ensaioRefs.current[ensaio.numeroSequencial] = el; }}
                          onMouseEnter={() => setHoveredSeq(ensaio.numeroSequencial)}
                          onMouseLeave={() => setHoveredSeq(null)}
                          className={`p-2.5 rounded-xl border transition-all duration-300 relative bg-slate-900/90 ${
                            isEnsaioHighlighted
                              ? 'border-purple-400 bg-purple-950/30 shadow-lg shadow-purple-950/40 scale-[1.01]'
                              : isLaudoEntregue && isPago
                              ? 'border-emerald-500/50 hover:border-emerald-400'
                              : isLaudoEntregue
                              ? 'border-blue-500/50 hover:border-blue-400'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {/* Topo do Ensaio Card */}
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                                isLaudoEntregue
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}>
                                #{ensaio.numeroSequencial}
                              </span>
                              <span className="font-bold text-white text-[11px]">
                                Ensaio {ensaio.numeroSequencial} de {totalEnsaios}
                              </span>
                            </div>

                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider border ${
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
                          <div className="bg-slate-950/70 p-1.5 px-2 rounded-lg border border-slate-800/80 flex items-center justify-between gap-1.5 text-[11px]">
                            <div className="truncate">
                              <span className="text-[9px] text-slate-400 block leading-none">Laudo Técnico:</span>
                              <span className="font-mono font-bold text-slate-200 text-[10px] truncate block">
                                {ensaio.reportNumber || (ensaio.reportPdfUrl ? `REL-${ensaio.numeroSequencial}` : 'Pendente')}
                              </span>
                            </div>

                            {ensaio.reportPdfUrl ? (
                              <button
                                onClick={() => openPdf(ensaio.reportPdfUrl)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-md transition-all flex items-center gap-1 shadow-sm shrink-0"
                              >
                                <span className="material-symbols-outlined text-[13px]">download</span>
                                <span>Laudo #{ensaio.numeroSequencial}</span>
                              </button>
                            ) : (
                              <span className="text-[9px] text-slate-500 italic">Em elaboração</span>
                            )}
                          </div>

                          {/* Status de Faturamento do Ensaio */}
                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">Faturamento:</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                              isPago 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                : isFaturado 
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {isPago ? 'Pago' : isFaturado ? (nf ? `Faturado (NF nº ${nf.numeroNf})` : 'Faturado') : 'Pendente NF'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* SUB-COLUNA DIREITA: NOTA FISCAL DESTE CLUSTER (CENTRALIZADA VERTICALMENTE) */}
                  <div className="flex flex-col justify-center h-full my-auto">
                    {nf ? (
                      <div
                        ref={(el) => { nfRefs.current[nf.id] = el; }}
                        onMouseEnter={() => setHoveredNfId(nf.id)}
                        onMouseLeave={() => setHoveredNfId(null)}
                        className={`p-3 rounded-xl border transition-all duration-300 relative bg-purple-950/30 shadow-md ${
                          isNfHighlighted
                            ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-950/60 scale-[1.01]'
                            : 'border-purple-500/40 hover:border-purple-400'
                        }`}
                      >
                        {/* Header da NF */}
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="p-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                            </span>
                            <span className="font-extrabold text-white text-[12px]">
                              Nota Fiscal nº {nf.numeroNf}
                            </span>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                            nf.statusPagamento === 'PAGO'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {nf.statusPagamento === 'PAGO' ? 'Quitada' : 'Aguardando Pgt'}
                          </span>
                        </div>

                        {/* DESTAQUE VISUAL DE MULTI-ENSAIO */}
                        <div className="my-1.5 bg-slate-950/80 p-2 rounded-lg border border-purple-500/30 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">Abrangência:</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 ${
                              isMultiEnsaio 
                                ? 'bg-purple-600 text-white shadow-sm' 
                                : 'bg-slate-800 text-purple-300 border border-purple-500/30'
                            }`}>
                              <span className="material-symbols-outlined text-[11px]">link</span>
                              {isMultiEnsaio 
                                ? `Cobre ${nf.coveredSequenciais.length} Ensaios (#${nf.coveredSequenciais.join(", #")})` 
                                : `Cobre Ensaio #${nf.coveredSequenciais[0]}`}
                            </span>
                          </div>

                          {nf.valorNota && (
                            <div className="flex justify-between text-[10px] pt-1 border-t border-slate-800/80">
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
                            className="w-full flex items-center justify-center gap-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-md shadow-sm transition-all"
                          >
                            <span className="material-symbols-outlined text-[13px]">download</span>
                            <span>Baixar NF nº {nf.numeroNf} (PDF)</span>
                          </button>
                        ) : (
                          <div className="w-full text-center py-1.5 bg-slate-950/60 rounded-md border border-slate-800 text-[9px] text-slate-400 italic">
                            Aguardando postagem do PDF da NF
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/10 text-center space-y-1.5">
                        <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
                          <span className="material-symbols-outlined text-[18px]">warning</span>
                          <span>Pendente de NF</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {cluster.ensaios.length} ensaio(s) (# {cluster.ensaios.map(e => e.numeroSequencial).join(", #")}) aguardando emissão de NF.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
