import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, user } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id: requestId },
            data: {
                status: "EM_EXECUCAO",
                step: 4,
            }
        });

        await prisma.testRequestHistory.create({
            data: {
                requestId: updatedRequest.id,
                changedBy: user || "Sistema",
                oldStatus: "AGUARDANDO_AGENDAMENTO",
                newStatus: "EM_EXECUCAO"
            }
        });

        return NextResponse.json({ success: true, updatedRequest });
    } catch (error) {
        console.error("Erro ao avançar para execução:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
