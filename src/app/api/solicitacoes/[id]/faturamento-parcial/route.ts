import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateOsBalance, formatOsCode } from '@/lib/os-balance-service';
import { sendInvoiceEmail, normalizeRecipients } from '@/lib/mail';

// POST /api/solicitacoes/[id]/faturamento-parcial
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: requestId } = await context.params;
    const body = await req.json();

    const { numeroNf, itemIds, valorNota, notaPdfUrl, observacoes } = body;

    if (!numeroNf || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { error: 'Número da NF e lista de itens de ensaio são obrigatórios.' },
        { status: 400 }
      );
    }

    // Buscar a OS e os itens selecionados
    const request = await prisma.testRequest.findUnique({
      where: { id: requestId },
      select: { valorUnitario: true, valorTotal: true, qtdContratada: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'OS Mãe não encontrada.' }, { status: 404 });
    }

    const items = await prisma.testExecutionItem.findMany({
      where: {
        id: { in: itemIds },
        requestId,
      },
    });

    if (items.length !== itemIds.length) {
      return NextResponse.json(
        { error: 'Alguns itens selecionados não foram encontrados nesta OS.' },
        { status: 404 }
      );
    }

    const qtdFaturada = items.length;
    const valorCalculado =
      valorNota ||
      (request.valorUnitario
        ? request.valorUnitario * qtdFaturada
        : request.valorTotal
        ? (request.valorTotal / (request.qtdContratada || 1)) * qtdFaturada
        : 0);

    // Criar o registro de Nota Fiscal Parcial
    const partialInvoice = await prisma.partialInvoice.create({
      data: {
        requestId,
        numeroNf,
        qtdFaturada,
        valorNota: valorCalculado,
        notaPdfUrl: notaPdfUrl || null,
        observacoes: observacoes || null,
      },
    });

    // Atualizar os itens de execução para FATURADO e vincular a NF
    await prisma.testExecutionItem.updateMany({
      where: {
        id: { in: itemIds },
      },
      data: {
        statusFaturamento: 'FATURADO',
        partialInvoiceId: partialInvoice.id,
      },
    });

    // Atualizar também na OS Mãe a última NF e resetar a confirmação de pagamento do cliente para alertar a nova NF
    await prisma.testRequest.update({
      where: { id: requestId },
      data: {
        invoiceNumber: numeroNf,
        ...(notaPdfUrl && { invoicePdfUrl: notaPdfUrl }),
        invoiceDate: new Date(),
        clientPaymentConfirmed: false,
        clientPaymentConfirmedAt: null,
      },
    });

    const balance = await calculateOsBalance(requestId);

    // Disparar envio de e-mail com a Nota Fiscal para o cliente
    const requestDetails = await prisma.testRequest.findUnique({
      where: { id: requestId },
      select: {
        clientEmail: true,
        proposalEmail: true,
        reportEmail: true,
        emailsProposta: true,
        emailsRelatorio: true,
        sharedEmails: true,
        clientName: true,
        type: true,
        createdAt: true,
      },
    });

    let emailSent = false;
    let emailSimulated = false;
    let recipientList: string[] = [];

    if (requestDetails) {
      recipientList = normalizeRecipients([
        ...(requestDetails.emailsProposta || []),
        ...(requestDetails.emailsRelatorio || []),
        ...(requestDetails.sharedEmails || []),
        requestDetails.proposalEmail,
        requestDetails.reportEmail,
        requestDetails.clientEmail,
      ]);

      if (recipientList.length > 0) {
        const osCode = formatOsCode(requestDetails);
        try {
          const mailRes = await sendInvoiceEmail({
            to: recipientList,
            name: requestDetails.clientName || 'Cliente',
            requestId,
            osCode,
            invoiceNumber: numeroNf,
            valorNota: valorCalculado,
            qtdFaturada,
            type: requestDetails.type,
            invoicePdfUrl: notaPdfUrl || null,
            observacoes: observacoes || null,
          });
          emailSent = !!mailRes?.success;
          emailSimulated = !!mailRes?.simulated;
        } catch (err) {
          console.error('Erro ao enviar e-mail com nota fiscal:', err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Nota Fiscal Parcial nº ${numeroNf} emitida com sucesso para ${qtdFaturada} ensaio(s).`,
      partialInvoice,
      balance,
      emailSent,
      emailSimulated,
      recipients: recipientList,
    });
  } catch (error: any) {
    console.error('Erro ao emitir faturamento parcial:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
