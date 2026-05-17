import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, proposalCode, proposalPdfUrl, user } = body;

        if (!requestId || !proposalCode) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id: requestId },
            data: {
                proposalCode,
                proposalPdfUrl,
                status: "AGUARDANDO_ACEITE",
                step: 2,
            }
        });

        await prisma.testRequestHistory.create({
            data: {
                requestId: updatedRequest.id,
                changedBy: user || "Sistema",
                oldStatus: "RECEBIDO",
                newStatus: "AGUARDANDO_ACEITE"
            }
        });

        return NextResponse.json({ success: true, updatedRequest });
    } catch (error) {
        console.error("Erro ao enviar proposta:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
