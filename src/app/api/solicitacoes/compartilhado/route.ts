import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyShareToken } from "@/lib/share-token";
import { formatOsCode } from "@/lib/os-balance-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token de acesso rápido não informado." },
                { status: 400 }
            );
        }

        const payload = verifyShareToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Link de acesso inválido ou expirado. Solicite ao proprietário do ensaio o reenvio do compartilhamento." },
                { status: 401 }
            );
        }

        const { requestId, email } = payload;

        const testReq = await prisma.testRequest.findUnique({
            where: { id: requestId },
            include: {
                executionItems: {
                    orderBy: { numeroSequencial: "asc" }
                },
                partialInvoices: {
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        if (!testReq) {
            return NextResponse.json(
                { error: "Processo de ensaio não encontrado ou removido." },
                { status: 404 }
            );
        }

        // Verifica se o e-mail ainda está autorizado na lista de compartilhamento
        const isAuthorized = testReq.sharedEmails
            .map(e => e.trim().toLowerCase())
            .includes(email.trim().toLowerCase());

        if (!isAuthorized) {
            return NextResponse.json(
                { error: "A autorização de acesso para este e-mail foi revogada pelo proprietário do processo." },
                { status: 403 }
            );
        }

        const osCode = formatOsCode(testReq);
        const shortId = testReq.id.split("-")[0].toUpperCase();

        // Monta o payload estritamente seguro de leitura (Read-Only)
        const sanitizedProcess = {
            id: shortId,
            rawId: testReq.id,
            osCode,
            titulo: testReq.type,
            tipo: testReq.type,
            status: testReq.status,
            step: testReq.step,
            data: new Date(testReq.createdAt).toLocaleDateString("pt-BR"),
            createdAt: testReq.createdAt,
            desiredDate: testReq.desiredDate,
            datasDesejadas: testReq.datasDesejadas,
            quantidadeEnsaios: testReq.quantidadeEnsaios,
            qtdContratada: testReq.qtdContratada || 1,
            obra: testReq.workName || testReq.location || testReq.contractorName || "Obra não especificada",
            contractorName: testReq.contractorName,
            constructionCompany: testReq.constructionCompany,
            workName: testReq.workName,
            location: testReq.location,
            address: testReq.address,
            rua: testReq.rua,
            numero: testReq.numero,
            bairro: testReq.bairro,
            cidade: testReq.cidade,
            estado: testReq.estado,
            cep: testReq.cep,
            observations: testReq.observations,
            technicalObservations: testReq.technicalObservations,
            // Documentos para visualização e download
            proposalPdfUrl: testReq.proposalPdfUrl,
            reportPdfUrl: testReq.reportPdfUrl,
            reportNumber: testReq.reportNumber,
            invoicePdfUrl: testReq.invoicePdfUrl,
            invoiceNumber: testReq.invoiceNumber,
            clientPaymentConfirmed: testReq.clientPaymentConfirmed,
            // Itens de execução e relatórios parciais
            executionItems: (testReq.executionItems || []).map((item: any) => ({
                id: item.id,
                itemNumber: item.numeroSequencial,
                tipoEnsaio: testReq.type,
                statusExecucao: item.statusExecucao,
                statusEntrega: item.statusEntrega,
                dataExecucao: item.dataExecucao,
                reportPdfUrl: item.reportPdfUrl,
                numeroRelatorio: item.reportNumber,
            })),
            // Notas fiscais para download
            partialInvoices: (testReq.partialInvoices || []).map((inv: any) => ({
                id: inv.id,
                numeroNf: inv.numeroNf,
                dataEmissao: inv.dataEmissao,
                valorNota: inv.valorNota,
                qtdFaturada: inv.qtdFaturada,
                statusPagamento: inv.statusPagamento,
                notaPdfUrl: inv.notaPdfUrl
            })),
            // Metadados do compartilhamento
            sharedWithEmail: email,
            ownerName: testReq.clientName || "Cliente MMC Lab",
            isSharedView: true
        };

        return NextResponse.json({
            success: true,
            process: sanitizedProcess
        });
    } catch (error) {
        console.error("Erro ao buscar processo compartilhado por token:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor ao carregar dados do processo." },
            { status: 500 }
        );
    }
}
