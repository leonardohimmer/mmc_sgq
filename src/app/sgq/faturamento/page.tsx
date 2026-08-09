"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import SuccessModal from "@/components/SuccessModal";
import { formatOsCode } from "@/lib/os-balance-service";

interface TestExecutionItem {
  id: string;
  numeroSequencial: number;
  statusExecucao: string;
  statusFaturamento: string;
  statusEntrega: string;
  statusPagamento?: string | null;
  dataPagamento?: string | null;
  dataExecucao?: string | null;
  reportNumber?: string | null;
  reportPdfUrl?: string | null;
  partialInvoiceId?: string | null;
}

interface PartialInvoice {
  id: string;
  numeroNf: string;
  qtdFaturada: number;
  valorNota: number;
  dataEmissao: string;
  statusPagamento?: string | null;
  dataPagamento?: string | null;
  notaPdfUrl?: string | null;
  observacoes?: string | null;
}

interface RequestWithBalance {
  id: string;
  type: string;
  clientName: string;
  workName?: string | null;
  contractorName?: string | null;
  quantidadeEnsaios?: string | null;
  qtdContratada: number;
  qtdExecutada: number;
  qtdEntregue: number;
  qtdFaturada: number;
  qtdPendenteFaturamento: number;
  qtdPagos?: number;
  qtdPendentePagamento?: number;
  podeFinalizarPagamento?: boolean;
  valorUnitario?: number | null;
  valorTotal?: number | null;
  status: string;
  executionItems: TestExecutionItem[];
  partialInvoices: PartialInvoice[];
  createdAt: string;
}

export default function FaturamentoParcialPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<RequestWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RequestWithBalance | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Form emissão de NF
  const [numeroNf, setNumeroNf] = useState("");
  const [valorNota, setValorNota] = useState("");
  const [notaPdfUrl, setNotaPdfUrl] = useState("");
  const [notaFileName, setNotaFileName] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [issuingNf, setIssuingNf] = useState(false);

  const handleNotaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNotaPdfUrl(result);
        setNotaFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/solicitacoes");
      if (res.ok) {
        const data: RequestWithBalance[] = await res.json();
        // Filtra apenas OSs onde ao menos um relatório foi entregue ao cliente (ou que já possuem faturamento emitido)
        const eligibleRequests = data.filter((req) => 
          (req.qtdEntregue > 0 || (req.partialInvoices && req.partialInvoices.length > 0) || req.qtdFaturada > 0)
        );
        setRequests(eligibleRequests);
        if (eligibleRequests.length > 0) {
          // Manter ou atualizar solicitação selecionada
          const current = selectedRequest ? eligibleRequests.find((r) => r.id === selectedRequest.id) : null;
          setSelectedRequest(current || eligibleRequests[0]);
        } else {
          setSelectedRequest(null);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações para faturamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRequest = (req: RequestWithBalance) => {
    setSelectedRequest(req);
    setSelectedItemIds([]);
    setNumeroNf("");
    setValorNota("");
    setNotaPdfUrl("");
    setObservacoes("");
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const selectAllLiberados = () => {
    if (!selectedRequest) return;
    const liberados = selectedRequest.executionItems
      .filter((i) => i.statusFaturamento === "LIBERADO" || i.statusFaturamento === "PENDENTE")
      .map((i) => i.id);
    setSelectedItemIds(liberados);
  };

  const handleEmitirNf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    if (!numeroNf.trim()) {
      setNotification({
        isOpen: true,
        title: "Campo Obrigatório",
        message: "Por favor, informe o Número da Nota Fiscal.",
        type: "error",
      });
      return;
    }

    if (selectedItemIds.length === 0) {
      setNotification({
        isOpen: true,
        title: "Nenhum Ensaio Selecionado",
        message: "Selecione ao menos 1 ensaio para incluir nesta Nota Fiscal Parcial.",
        type: "error",
      });
      return;
    }

    setIssuingNf(true);
    try {
      const payload = {
        numeroNf: numeroNf.trim(),
        itemIds: selectedItemIds,
        valorNota: valorNota ? parseFloat(valorNota) : undefined,
        notaPdfUrl: notaPdfUrl.trim() || undefined,
        observacoes: observacoes.trim() || undefined,
      };

      const res = await fetch(`/api/solicitacoes/${selectedRequest.id}/faturamento-parcial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setNotification({
          isOpen: true,
          title: "NF Parcial Emitida com Sucesso!",
          message: `Nota Fiscal nº ${numeroNf} gerada para ${selectedItemIds.length} ensaio(s).`,
          type: "success",
        });

        setNumeroNf("");
        setValorNota("");
        setNotaPdfUrl("");
        setObservacoes("");
        setSelectedItemIds([]);

        // Recarregar dados
        await fetchRequests();
      } else {
        setNotification({
          isOpen: true,
          title: "Erro ao Emite NF",
          message: json.error || "Não foi possível registrar a Nota Fiscal Parcial.",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Erro na emissão de NF parcial:", error);
      setNotification({
        isOpen: true,
        title: "Erro de Conexão",
        message: error.message || "Ocorreu um erro ao comunicar com o servidor.",
        type: "error",
      });
    } finally {
      setIssuingNf(false);
    }
  };

  const handleConfirmarPagamentoNf = async (invoiceId: string) => {
    if (!selectedRequest) return;
    setProcessingPayment(true);
    try {
      const res = await fetch(`/api/solicitacoes/${selectedRequest.id}/confirmar-pagamento-parcial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partialInvoiceId: invoiceId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setNotification({
          isOpen: true,
          title: "Pagamento Confirmado!",
          message: json.message || "Pagamento da Nota Fiscal Parcial confirmado com sucesso.",
          type: "success",
        });
        await fetchRequests();
      } else {
        setNotification({
          isOpen: true,
          title: "Erro ao confirmar pagamento",
          message: json.error || "Não foi possível confirmar o pagamento.",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Erro ao confirmar pagamento:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleFinalizarEEnviarParaHistorico = async () => {
    if (!selectedRequest) return;
    setProcessingPayment(true);
    try {
      const res = await fetch(`/api/solicitacoes/${selectedRequest.id}/confirmar-pagamento-parcial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "FINALIZAR_PROCESSO" }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setNotification({
          isOpen: true,
          title: "Processo Finalizado com Sucesso!",
          message: "O processo foi totalmente pago, finalizado e enviado para o Histórico de Processos.",
          type: "success",
        });
        await fetchRequests();
      } else {
        setNotification({
          isOpen: true,
          title: "Erro ao Finalizar Processo",
          message: json.error || "Não foi possível finalizar o processo.",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Erro ao finalizar processo:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const totalPendentesFaturamento = requests.reduce(
    (acc, r) => acc + (r.qtdPendenteFaturamento || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-purple-600">payments</span>
          Gestão de Faturamento Parcial & Notas Fiscais
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Controle de ensaios liberados para faturamento, emissão em lote de Notas Fiscais Parciais e históricos contratuais.
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total de Pedidos Abertos
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {requests.length}
          </span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 shadow-sm">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
            Ensaios Concluídos Pendentes de NF
          </span>
          <span className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
            {totalPendentesFaturamento} ensaio(s)
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/30 p-5 rounded-2xl border border-purple-200/80 dark:border-purple-800/50 shadow-sm">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block mb-1">
            Status Faturamento Parcial
          </span>
          <span className="text-2xl font-extrabold text-purple-900 dark:text-purple-300">
            Habilitado (1 a N)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna 1: Lista de Solicitações / OSs */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>Selecione a OS Mãe</span>
            <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold">
              {requests.length}
            </span>
          </h2>

          <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
            {requests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              const hasPendenteNf = req.qtdPendenteFaturamento > 0;

              return (
                <div
                  key={req.id}
                  onClick={() => handleSelectRequest(req)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-mono">
                      OS: {formatOsCode(req)}
                    </span>
                    {hasPendenteNf && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                        {req.qtdPendenteFaturamento} a faturar
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {req.type}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {req.clientName} {req.workName ? `• ${req.workName}` : ""}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-between text-[11px] text-slate-400 gap-1 flex-wrap">
                    <span>Contratados: <strong>{req.qtdContratada}</strong></span>
                    <span>Executados: <strong>{req.qtdExecutada}</strong></span>
                    <span>Faturados: <strong>{req.qtdFaturada}</strong></span>
                    <span>Pagos: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{req.qtdPagos ?? 0}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 2 e 3: Painel de Faturamento da OS Selecionada */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRequest ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Header da OS */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                    OS Mãe • {selectedRequest.type}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {selectedRequest.clientName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedRequest.workName || selectedRequest.contractorName || "Sem localização informada"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700">
                    Contratados: {selectedRequest.qtdContratada}
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200/80 dark:border-indigo-800/50">
                    Executados: {selectedRequest.qtdExecutada}
                  </span>
                  <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-bold text-xs rounded-xl border border-purple-200/80 dark:border-purple-800/50">
                    Faturados: {selectedRequest.qtdFaturada}
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    Pagos: {selectedRequest.qtdPagos ?? 0}
                  </span>
                </div>
              </div>

              {/* Banner de Pagamento Total Concluído & Envio ao Histórico */}
              {(selectedRequest.qtdPagos !== undefined && selectedRequest.qtdPagos >= selectedRequest.qtdContratada) || selectedRequest.status === "FINALIZADO" ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-3xl">verified</span>
                    <div>
                      <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-sm">
                        Pagamento Total Concluído ({selectedRequest.qtdPagos ?? selectedRequest.qtdContratada} de {selectedRequest.qtdContratada} ensaios pagos)
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        {selectedRequest.status === "FINALIZADO"
                          ? "Este processo já foi finalizado e enviado ao Histórico de Processos."
                          : "Todos os ensaios foram totalmente pagos. Clique ao lado para mover para o Histórico de Processos."}
                      </p>
                    </div>
                  </div>
                  {selectedRequest.status !== "FINALIZADO" && (
                    <button
                      type="button"
                      onClick={handleFinalizarEEnviarParaHistorico}
                      disabled={processingPayment}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {processingPayment ? (
                        <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">history_edu</span>
                      )}
                      Finalizar e Mover p/ Histórico
                    </button>
                  )}
                </div>
              ) : null}

              {/* Tabela de Selección dos Ensaios para NF Parcial */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">checklist</span>
                    Selecione os Ensaios Concluídos para Emitir NF Parcial
                  </h3>

                  <button
                    onClick={selectAllLiberados}
                    type="button"
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline"
                  >
                    Selecionar Todos Liberados
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedRequest.executionItems.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-400">
                      Nenhum item de execução cadastrado para esta OS.
                    </div>
                  ) : (
                    selectedRequest.executionItems.map((item) => {
                      const isSelected = selectedItemIds.includes(item.id);
                      const isFaturado = item.statusFaturamento === "FATURADO";
                      const isConcluido = item.statusExecucao === "CONCLUIDO" || item.statusExecucao === "APROVADO";

                      return (
                        <div
                          key={item.id}
                          onClick={() => !isFaturado && toggleSelectItem(item.id)}
                          className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                            isFaturado
                              ? "bg-slate-50/50 dark:bg-slate-800/20 cursor-not-allowed opacity-75"
                              : isSelected
                              ? "bg-purple-50/60 dark:bg-purple-950/30 cursor-pointer"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected || isFaturado}
                              disabled={isFaturado}
                              onChange={() => !isFaturado && toggleSelectItem(item.id)}
                              className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                            />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                Ensaio #{item.numeroSequencial} de {selectedRequest.qtdContratada}
                              </span>
                              <div className="text-xs text-slate-500 mt-0.5">
                                Status Execução:{" "}
                                <span className={isConcluido ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                                  {item.statusExecucao}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.statusPagamento === "PAGO" ? (
                              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Pago
                              </span>
                            ) : isFaturado ? (
                              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-extrabold text-xs rounded-full">
                                Faturado (Aguard. Pgto)
                              </span>
                            ) : isConcluido ? (
                              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-extrabold text-xs rounded-full">
                                Liberado p/ NF
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs rounded-full">
                                Pendente Execução
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Formulário de Emissão de NF Parcial */}
              <form onSubmit={handleEmitirNf} className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">receipt</span>
                  Emitir Nota Fiscal Parcial para {selectedItemIds.length} ensaio(s) selecionado(s)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Número da NF Parcial *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: NF-1001"
                      value={numeroNf}
                      onChange={(e) => setNumeroNf(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Valor da Nota (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 1500.00"
                      value={valorNota}
                      onChange={(e) => setValorNota(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Anexar Documento da Nota Fiscal (PDF) <span className="text-red-500">*</span>
                  </label>

                  {notaPdfUrl ? (
                    <div className="flex items-center justify-between p-3.5 bg-purple-50/90 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-700 rounded-xl">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-2xl">receipt_long</span>
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                            {notaFileName || "Nota_Fiscal.pdf"}
                          </span>
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                            ✓ PDF da Nota Fiscal Anexado com Sucesso
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {notaPdfUrl.startsWith("http") && (
                          <a
                            href={notaPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          >
                            Visualizar
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setNotaPdfUrl("");
                            setNotaFileName("");
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                          title="Remover arquivo"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center group cursor-pointer">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleNotaFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-purple-600 transition-colors">
                          upload_file
                        </span>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Clique para selecionar ou arraste o PDF da Nota Fiscal
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Selecione o arquivo da Nota Fiscal em formato PDF
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    value={notaPdfUrl.startsWith("data:") ? "" : notaPdfUrl}
                    onChange={(e) => {
                      setNotaPdfUrl(e.target.value);
                      setNotaFileName(e.target.value ? "Link Externo NF" : "");
                    }}
                    placeholder="Ou informe aqui a URL/link do PDF da Nota Fiscal..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-medium focus:ring-2 focus:ring-purple-500 outline-none text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Observações Internas / Faturamento
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Observações referentes a esta medição..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={issuingNf || selectedItemIds.length === 0 || !notaPdfUrl || !notaPdfUrl.trim()}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {issuingNf ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    )}
                    Enviar Nota Fiscal ({selectedItemIds.length})
                  </button>
                </div>
              </form>

              {/* Histórico de Notas Fiscais Parciais Já Emitidas nesta OS */}
              {selectedRequest.partialInvoices && selectedRequest.partialInvoices.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">history</span>
                    Notas Fiscais Parciais Emitidas para esta OS ({selectedRequest.partialInvoices.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedRequest.partialInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            NF nº {inv.numeroNf} • {inv.qtdFaturada} ensaio(s)
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Emissão: {format(new Date(inv.dataEmissao), "dd/MM/yyyy")} • Valor: R${" "}
                            {inv.valorNota ? inv.valorNota.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {inv.statusPagamento === "PAGO" ? (
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              NF Paga
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleConfirmarPagamentoNf(inv.id)}
                              disabled={processingPayment}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {processingPayment ? (
                                <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>
                              ) : (
                                <span className="material-symbols-outlined text-[14px]">payments</span>
                              )}
                              Confirmar Pgto NF
                            </button>
                          )}

                          {inv.notaPdfUrl && (
                            <a
                              href={inv.notaPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              Ver PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhuma OS selecionada</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Selecione uma OS da lista ao lado para gerenciar ensaios liberados e emitir Notas Fiscais Parciais.
              </p>
            </div>
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={notification.isOpen}
        onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        autoClose={true}
      />
    </div>
  );
}
