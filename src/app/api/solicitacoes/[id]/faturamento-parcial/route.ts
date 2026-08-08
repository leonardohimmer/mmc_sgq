import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateOsBalance } from '@/lib/os-balance-service';

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

    // Atualizar também na OS Mãe a última NF
    await prisma.testRequest.update({
      where: { id: requestId },
      data: {
        invoiceNumber: numeroNf,
        ...(notaPdfUrl && { invoicePdfUrl: notaPdfUrl }),
        invoiceDate: new Date(),
      },
    });

    const balance = await calculateOsBalance(requestId);

    return NextResponse.json({
      success: true,
      message: `Nota Fiscal Parcial nº ${numeroNf} emitida com sucesso para ${qtdFaturada} ensaio(s).`,
      partialInvoice,
      balance,
    });
  } catch (error: any) {
    console.error('Erro ao emitir faturamento parcial:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
