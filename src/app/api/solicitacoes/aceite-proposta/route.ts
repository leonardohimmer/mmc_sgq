import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, clientName } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id: requestId },
            data: {
                status: "AGUARDANDO_AGENDAMENTO",
                step: 3,
            }
        });

        await prisma.testRequestHistory.create({
            data: {
                requestId: updatedRequest.id,
                changedBy: clientName || "Cliente",
                oldStatus: "AGUARDANDO_ACEITE",
                newStatus: "AGUARDANDO_AGENDAMENTO"
            }
        });

        return NextResponse.json({ success: true, updatedRequest });
    } catch (error) {
        console.error("Erro ao aceitar proposta:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
