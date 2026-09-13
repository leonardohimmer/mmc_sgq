import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateOsBalance, ensureExecutionItemsCreated, updateOsStatusBasedOnBalance } from '@/lib/os-balance-service';

// GET /api/solicitacoes/[id]/itens - Retorna os itens de execução e o resumo do saldo
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const request = await prisma.testRequest.findUnique({
      where: { id },
      include: {
        executionItems: {
          orderBy: { numeroSequencial: 'asc' },
          include: {
            partialInvoice: true,
          },
        },
        partialInvoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'OS não encontrada.' }, { status: 404 });
    }

    // Garantir que os itens de execução existam
    if (request.executionItems.length === 0) {
      await ensureExecutionItemsCreated(id, request.quantidadeEnsaios);
    }

    const balance = await calculateOsBalance(id);
    const updatedRequest = await prisma.testRequest.findUnique({
      where: { id },
      include: {
        executionItems: {
          orderBy: { numeroSequencial: 'asc' },
          include: {
            partialInvoice: true,
          },
        },
        partialInvoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      request: updatedRequest,
      balance,
    });
  } catch (error: any) {
    console.error('Erro ao buscar itens de execução:', error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor.' }, { status: 500 });
  }
}

// PATCH /api/solicitacoes/[id]/itens - Atualiza o status de um item de execução individual (ex: Ensaio 1 de N)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await context.params;
    const body = await req.json();

    const {
      itemId,
      numeroSequencial,
      qtdAgendar,
      statusExecucao,
      statusPagamento,
      dataPlanejada,
      dataExecucao,
      reportNumber,
      reportPdfUrl,
      observacoes,
      tecnicoId,
    } = body;

    let targetItem = null;

    if (itemId) {
      targetItem = await prisma.testExecutionItem.findUnique({ where: { id: itemId } });
    } else if (numeroSequencial) {
      targetItem = await prisma.testExecutionItem.findUnique({
        where: {
          requestId_numeroSequencial: {
            requestId,
            numeroSequencial: Number(numeroSequencial),
          },
        },
      });
    }

    if (!targetItem) {
      return NextResponse.json({ error: 'Item de execução não encontrado.' }, { status: 404 });
    }

    // Trava de Over-delivering ao tentar aprovar ou concluir novos ensaios
    if (statusExecucao === 'CONCLUIDO' || statusExecucao === 'APROVADO') {
      const balance = await calculateOsBalance(requestId);
      if (
        !balance.podeExecutarNovos &&
        targetItem.statusExecucao !== 'CONCLUIDO' &&
        targetItem.statusExecucao !== 'APROVADO'
      ) {
        return NextResponse.json(
          {
            error: `Bloqueio de Over-delivering: A OS Mãe já atingiu a quantidade limite contratada (${balance.qtdContratada} ensaios).`,
          },
          { status: 400 }
        );
      }
    }

    const countAgendar = Math.max(1, Number(qtdAgendar || 1));
    const startSeq = targetItem.numeroSequencial;
    const endSeq = startSeq + countAgendar - 1;

    // Atualiza os itens da faixa solicitada (de startSeq até endSeq)
    await prisma.testExecutionItem.updateMany({
      where: {
        requestId,
        numeroSequencial: {
          gte: startSeq,
          lte: endSeq,
        },
      },
      data: {
        ...(statusExecucao && { statusExecucao }),
        ...(statusPagamento && { statusPagamento }),
        ...(statusPagamento === 'PAGO' ? { dataPagamento: new Date() } : {}),
        ...(dataPlanejada && { dataPlanejada: new Date(dataPlanejada) }),
        ...(dataExecucao && { dataExecucao: new Date(dataExecucao) }),
        ...(reportNumber && { reportNumber }),
        ...(reportPdfUrl && { reportPdfUrl }),
        ...(observacoes && { observacoes }),
        ...(tecnicoId && { tecnicoId }),
        ...(statusExecucao === 'CONCLUIDO' || statusExecucao === 'APROVADO'
          ? { statusFaturamento: 'LIBERADO' }
          : {}),
      },
    });

    // Se o statusPagamento foi alterado, sincronizar com as Notas Fiscais Parciais e a OS Mãe
    if (statusPagamento) {
      const now = new Date();
      const allItems = await prisma.testExecutionItem.findMany({
        where: { requestId },
        select: { id: true, partialInvoiceId: true, statusPagamento: true },
      });

      if (statusPagamento === 'PAGO') {
        // 1. Sincronizar PartialInvoices cujos itens associados estão 100% pagos
        const partialInvoiceIds = Array.from(
          new Set(allItems.map((i) => i.partialInvoiceId).filter(Boolean))
        ) as string[];

        for (const pId of partialInvoiceIds) {
          const itemsForInvoice = allItems.filter((i) => i.partialInvoiceId === pId);
          const allInvoiceItemsPaid = itemsForInvoice.length > 0 && itemsForInvoice.every((i) => i.statusPagamento === 'PAGO');
          if (allInvoiceItemsPaid) {
            await prisma.partialInvoice.update({
              where: { id: pId },
              data: {
                statusPagamento: 'PAGO',
                dataPagamento: now,
              },
            });
          }
        }

        // 2. Se todos os itens da OS estão pagos, atualizar paymentConfirmedAt da OS
        const allReqItemsPaid = allItems.length > 0 && allItems.every((i) => i.statusPagamento === 'PAGO');
        if (allReqItemsPaid) {
          await prisma.testRequest.update({
            where: { id: requestId },
            data: {
              paymentConfirmedAt: now,
            },
          });
        }
      } else {
        // Se foi revertido para PENDENTE, reverter a PartialInvoice associada
        const targetPartialId = targetItem.partialInvoiceId;
        if (targetPartialId) {
          await prisma.partialInvoice.update({
            where: { id: targetPartialId },
            data: {
              statusPagamento: 'PENDENTE',
              dataPagamento: null,
            },
          });
        }
      }
    }

    const updatedItem = await prisma.testExecutionItem.findUnique({
      where: { id: targetItem.id },
    });

    // Se foi agendada uma data planejada ou solicitado agendamento
    if (dataPlanejada || statusExecucao === 'AGENDADO' || statusExecucao === 'EM_EXECUCAO') {
      await prisma.testRequest.update({
        where: { id: requestId },
        data: {
          status: 'AGUARDANDO_AGENDAMENTO',
          ...(dataPlanejada ? { desiredDate: new Date(dataPlanejada) } : {}),
          ...(observacoes ? { observations: observacoes } : {})
        }
      });
    }

    // Atualiza status global da OS Mãe com base nos saldos
    await updateOsStatusBasedOnBalance(requestId);

    const balance = await calculateOsBalance(requestId);

    return NextResponse.json({
      success: true,
      item: updatedItem,
      balance,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar item de execução:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
