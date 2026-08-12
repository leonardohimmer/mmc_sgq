import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, clientName, user, changedBy, acceptanceProofUrl, acceptanceChannel, acceptanceNotes } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Dados incompletos: ID da solicitação é obrigatório." }, { status: 400 });
        }

        // Se for um aceite manual registrado por colaborador, o anexo de comprovante é obrigatório
        const isManual = Boolean(user || changedBy || acceptanceChannel || acceptanceProofUrl);
        if (isManual && !acceptanceProofUrl) {
            return NextResponse.json({ error: "O anexo de comprovante de aceite é obrigatório." }, { status: 400 });
        }

        const updateData: any = {
            status: "AGUARDANDO_AGENDAMENTO",
            step: 3,
        };

        if (acceptanceProofUrl) {
            updateData.acceptanceProofUrl = acceptanceProofUrl;
        }
        if (acceptanceChannel) {
            updateData.acceptanceChannel = acceptanceChannel;
        }
        if (acceptanceNotes) {
            updateData.acceptanceNotes = acceptanceNotes;
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id: requestId },
            data: updateData
        });

        const actor = changedBy || user || clientName || "Cliente";
        const channelText = acceptanceChannel ? ` via ${acceptanceChannel}` : "";

        await prisma.testRequestHistory.create({
            data: {
                requestId: updatedRequest.id,
                changedBy: actor,
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
