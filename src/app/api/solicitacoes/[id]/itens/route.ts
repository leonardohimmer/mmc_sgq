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

    const updatedItem = await prisma.testExecutionItem.findUnique({
      where: { id: targetItem.id },
    });

    // Se foi agendada uma data planejada ou solicitado agendamento
    if (dataPlanejada || statusExecucao === 'AGENDADO' || statusExecucao === 'EM_EXECUCAO') {
      const currentReq = await prisma.testRequest.findUnique({ where: { id: requestId }, select: { status: true } });
      if (currentReq && currentReq.status !== 'FINALIZADO') {
        await prisma.testRequest.update({
          where: { id: requestId },
          data: {
            status: 'AGUARDANDO_AGENDAMENTO',
            ...(dataPlanejada ? { desiredDate: new Date(dataPlanejada) } : {}),
            ...(observacoes ? { observations: observacoes } : {})
          }
        });
      }
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
