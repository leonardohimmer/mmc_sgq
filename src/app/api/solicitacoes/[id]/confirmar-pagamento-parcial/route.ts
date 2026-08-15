import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateOsBalance } from "@/lib/os-balance-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { partialInvoiceId, itemIds, action } = body;

    const existingRequest = await prisma.testRequest.findUnique({
      where: { id },
      include: { executionItems: true, partialInvoices: true },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Solicitação não encontrada." },
        { status: 404 }
      );
    }

    const now = new Date();
    const changedBy = session.user.name || session.user.email || "Financeiro";

    // Ação: Confirmar Pagamento de Nota Fiscal Parcial
    if (partialInvoiceId) {
      await prisma.partialInvoice.update({
        where: { id: partialInvoiceId },
        data: {
          statusPagamento: "PAGO",
          dataPagamento: now,
        },
      });

      // Atualizar todos os itens associados a esta Nota Fiscal Parcial
      await prisma.testExecutionItem.updateMany({
        where: { partialInvoiceId },
        data: {
          statusPagamento: "PAGO",
          dataPagamento: now,
        },
      });
    } else if (Array.isArray(itemIds) && itemIds.length > 0) {
      // Ação: Confirmar Pagamento de Itens de Execução Específicos
      await prisma.testExecutionItem.updateMany({
        where: { id: { in: itemIds } },
        data: {
          statusPagamento: "PAGO",
          dataPagamento: now,
        },
      });

      const itemsUpdated = await prisma.testExecutionItem.findMany({
        where: { id: { in: itemIds } },
        select: { partialInvoiceId: true }
      });
      const invoiceIds = Array.from(new Set(itemsUpdated.map(i => i.partialInvoiceId).filter(Boolean)));
      for (const invId of invoiceIds) {
        if (invId) {
          await prisma.partialInvoice.update({
            where: { id: invId },
            data: {
              statusPagamento: "PAGO",
              dataPagamento: now,
            }
          });
        }
      }
    }

    // Ação: Finalizar Processo e Mover para Histórico
    let isFinalized = false;
    if (action === "FINALIZAR_PROCESSO") {
      // Marcar todos os itens como PAGO se ainda houver pendentes
      await prisma.testExecutionItem.updateMany({
        where: { requestId: id },
        data: {
          statusPagamento: "PAGO",
          dataPagamento: now,
        },
      });

      await prisma.partialInvoice.updateMany({
        where: { requestId: id },
        data: {
          statusPagamento: "PAGO",
          dataPagamento: now,
        },
      });

      await prisma.testRequest.update({
        where: { id },
        data: {
          status: "FINALIZADO",
          step: 10,
          paymentConfirmedAt: existingRequest.paymentConfirmedAt || now,
          paymentConfirmedBy: existingRequest.paymentConfirmedBy || changedBy,
        },
      });

      // Garantir criação da Pesquisa de Satisfação vinculada no histórico
      await prisma.satisfactionSurvey.upsert({
        where: { requestId: id },
        update: { status: "REVIEWED" },
        create: {
          requestId: id,
          status: "REVIEWED",
          ratingQuality: 5,
        },
      });

      await prisma.testRequestHistory.create({
        data: {
          requestId: id,
          changedBy,
          oldStatus: existingRequest.status,
          newStatus: "FINALIZADO",
        },
      });

      isFinalized = true;
    }

    // Atualizar o status da OS com base no saldo e pesquisa de satisfação
    const { updateOsStatusBasedOnBalance } = await import("@/lib/os-balance-service");
    const updatedStatus = await updateOsStatusBasedOnBalance(id);
    const balance = await calculateOsBalance(id);
    isFinalized = updatedStatus === "FINALIZADO";

    return NextResponse.json({
      success: true,
      balance,
      isFinalized,
      message: isFinalized
        ? "Pagamento total confirmado! O processo foi finalizado e enviado ao Histórico de Processos."
        : updatedStatus === "PESQUISA_PENDENTE"
        ? "Pagamento total confirmado! O processo avançou para a Pesquisa de Satisfação."
        : "Pagamento parcial registrado com sucesso.",
    });
  } catch (error: any) {
    console.error("Erro ao confirmar pagamento parcial:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar pagamento." },
      { status: 500 }
    );
  }
}
