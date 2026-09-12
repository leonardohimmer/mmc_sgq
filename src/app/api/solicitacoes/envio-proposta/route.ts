import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendProposalEmail } from "@/lib/mail";
import { formatOsCode } from "@/lib/os-balance-service";

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

        // Coletar e-mails para envio da proposta comercial
        const recipientList: string[] = [];
        if (updatedRequest.emailsProposta && Array.isArray(updatedRequest.emailsProposta)) {
            recipientList.push(...updatedRequest.emailsProposta);
        }
        if (updatedRequest.proposalEmail) {
            recipientList.push(updatedRequest.proposalEmail);
        }
        if (updatedRequest.clientEmail) {
            recipientList.push(updatedRequest.clientEmail);
        }

        let emailResult = { success: false };
        if (recipientList.length > 0) {
            try {
                const osCode = formatOsCode(updatedRequest);
                emailResult = await sendProposalEmail({
                    to: recipientList,
                    name: updatedRequest.clientName || "Cliente",
                    requestId: updatedRequest.id,
                    osCode,
                    proposalCode,
                    type: updatedRequest.type,
                    workName: updatedRequest.workName,
                    location: updatedRequest.location,
                    quantidadeEnsaios: updatedRequest.quantidadeEnsaios,
                    proposalPdfUrl: proposalPdfUrl || updatedRequest.proposalPdfUrl
                });

                if (emailResult.success) {
                    await prisma.testRequestHistory.create({
                        data: {
                            requestId: updatedRequest.id,
                            changedBy: "Sistema de E-mails",
                            oldStatus: "AGUARDANDO_ACEITE",
                            newStatus: "PROPOSTA_ENVIADA_POR_EMAIL"
                        }
                    });
                }
            } catch (mailError) {
                console.error("Falha ao enviar e-mail de proposta:", mailError);
            }
        }

        return NextResponse.json({ 
            success: true, 
            updatedRequest,
            emailSent: emailResult.success,
            recipients: recipientList
        });
    } catch (error) {
        console.error("Erro ao enviar proposta:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
