import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateOsBalance, updateOsStatusBasedOnBalance } from '@/lib/os-balance-service';

// POST /api/solicitacoes/[id]/enviar-relatorio-parcial
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await context.params;
    const body = await req.json();

    const { itemId, numeroSequencial, reportPdfUrl, reportNumber, observations } = body;

    let item = null;
    if (itemId) {
      item = await prisma.testExecutionItem.findUnique({ where: { id: itemId } });
    } else if (numeroSequencial) {
      item = await prisma.testExecutionItem.findUnique({
        where: {
          requestId_numeroSequencial: {
            requestId,
            numeroSequencial: Number(numeroSequencial),
          },
        },
      });
    }

    if (!item) {
      return NextResponse.json({ error: 'Item de execução de ensaio não encontrado.' }, { status: 404 });
    }

    // Atualiza o item de ensaio individual
    const updatedItem = await prisma.testExecutionItem.update({
      where: { id: item.id },
      data: {
        statusExecucao: 'CONCLUIDO',
        statusEntrega: 'ENVIADO_AO_CLIENTE',
        statusFaturamento: item.statusFaturamento === 'FATURADO' ? 'FATURADO' : 'LIBERADO',
        dataEnvioRelatorio: new Date(),
        dataExecucao: item.dataExecucao || new Date(),
        ...(reportPdfUrl && { reportPdfUrl }),
        ...(reportNumber && { reportNumber }),
        ...(observations && { observacoes: observations }),
      },
    });

    // Se for o último laudo ou tiver reportPdfUrl principal, salva como o mais recente na OS Mãe
    if (reportPdfUrl) {
      await prisma.testRequest.update({
        where: { id: requestId },
        data: {
          reportPdfUrl,
          reportNumber: reportNumber || item.reportNumber,
        },
      });
    }

    // Registra histórico de alteração
    await prisma.testRequestHistory.create({
      data: {
        requestId,
        changedBy: 'Sistema SGQ',
        oldStatus: item.statusEntrega,
        newStatus: `RELATORIO_ENVIADO_ENSAIO_${updatedItem.numeroSequencial}`,
      },
    });

    // Recalcula saldos e atualiza status da OS Mãe (FINALIZADO se todos forem entregues)
    const newOsStatus = await updateOsStatusBasedOnBalance(requestId);
    const balance = await calculateOsBalance(requestId);

    return NextResponse.json({
      success: true,
      message: `Relatório do Ensaio ${updatedItem.numeroSequencial} de ${balance.qtdContratada} registrado e enviado ao cliente.`,
      item: updatedItem,
      balance,
      osStatus: newOsStatus,
    });
  } catch (error: any) {
    console.error('Erro ao enviar relatório parcial:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
