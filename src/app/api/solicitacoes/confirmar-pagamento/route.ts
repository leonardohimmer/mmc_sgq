import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, clientName } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        // Busca a solicitação atual para obter o status atual
        const currentRequest = await prisma.testRequest.findUnique({
            where: { id: requestId }
        });

        if (!currentRequest) {
            return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id: requestId },
            data: {
                clientPaymentConfirmed: true,
                clientPaymentConfirmedAt: new Date(),
            }
        });

        await prisma.testRequestHistory.create({
            data: {
                requestId: updatedRequest.id,
                changedBy: clientName || "Cliente",
                oldStatus: currentRequest.status,
                newStatus: currentRequest.status,
                assignedToId: currentRequest.assignedToId
            }
        });

        return NextResponse.json({ success: true, updatedRequest });
    } catch (error) {
        console.error("Erro ao confirmar pagamento:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
