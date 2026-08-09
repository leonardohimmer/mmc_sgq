import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateOsBalance, formatOsCode, updateOsStatusBasedOnBalance } from '@/lib/os-balance-service';
import { sendReportWithSurveyEmail } from '@/lib/mail';

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

    // Garantir que a Pesquisa de Satisfação exista para esta solicitação e esteja ativa para o feedback do cliente
    await prisma.satisfactionSurvey.upsert({
      where: { requestId },
      update: { status: 'PENDING' },
      create: {
        requestId,
        status: 'PENDING',
      },
    });

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

    // Enviar e-mail ao cliente com o relatório e o link para a pesquisa de satisfação dos ensaios já realizados
    const requestData = await prisma.testRequest.findUnique({
      where: { id: requestId },
      select: {
        clientEmail: true,
        clientName: true,
        type: true,
        qtdContratada: true,
        createdAt: true,
        clientPaymentConfirmedAt: true,
        paymentConfirmedAt: true,
      },
    });

    if (requestData && requestData.clientEmail) {
      const osCode = formatOsCode(requestData, updatedItem.numeroSequencial);
      sendReportWithSurveyEmail({
        to: requestData.clientEmail,
        name: requestData.clientName || 'Cliente',
        requestId,
        type: requestData.type,
        itemNumber: updatedItem.numeroSequencial,
        totalItems: Math.max(requestData.qtdContratada || 1, balance.qtdContratada),
        osCode,
        reportPdfUrl: updatedItem.reportPdfUrl || reportPdfUrl,
      }).catch((err) => console.error('Erro assíncrono ao enviar e-mail com relatório e pesquisa:', err));
    }

    return NextResponse.json({
      success: true,
      message: `Relatório do Ensaio ${updatedItem.numeroSequencial} de ${balance.qtdContratada} registrado e enviado ao cliente junto com a Pesquisa de Satisfação.`,
      item: updatedItem,
      balance,
      osStatus: newOsStatus,
    });
  } catch (error: any) {
    console.error('Erro ao enviar relatório parcial:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
