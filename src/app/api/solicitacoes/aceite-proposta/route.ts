import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, clientName, user, changedBy, acceptanceProofUrl, acceptanceChannel, acceptanceNotes } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Dados incompletos: ID da solicitação é obrigatório." }, { status: 400 });
        }

        const existing = await prisma.testRequest.findUnique({
            where: { id: requestId }
        });

        if (!existing) {
            return NextResponse.json({ error: "Solicitação não encontrada." }, { status: 404 });
        }

        const session = await getServerSession(authOptions);
        if (session && session.user?.role === "CLIENTE") {
            const userEmail = (session.user.email || '').toLowerCase().trim();
            const userName = (session.user.name || '').toLowerCase().trim();
            const ownerEmail = (existing.clientEmail || '').toLowerCase().trim();
            const ownerName = (existing.clientName || '').toLowerCase().trim();

            const isOwner = (userEmail && ownerEmail && userEmail === ownerEmail) ||
                            (userName && ownerName && userName === ownerName);

            if (!isOwner) {
                return NextResponse.json(
                    { error: "Usuários com acesso compartilhado têm permissão apenas para visualização e download de arquivos." },
                    { status: 403 }
                );
            }
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
