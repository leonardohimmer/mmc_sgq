import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function getLightweightRequests(whereCondition: any = {}) {
    const requests = await prisma.testRequest.findMany({
        where: whereCondition,
        select: {
            id: true,
            type: true,
            location: true,
            contractorName: true,
            constructionCompany: true,
            workName: true,
            address: true,
            rua: true,
            numero: true,
            bairro: true,
            cidade: true,
            estado: true,
            cep: true,
            proposalEmail: true,
            reportEmail: true,
            emailsProposta: true,
            emailsRelatorio: true,
            sharedEmails: true,
            desiredDate: true,
            datasDesejadas: true,
            quantidadeEnsaios: true,
            observations: true,
            appliedStandard: true,
            measuredData: true,
            result: true,
            technicalObservations: true,
            reportNumber: true,
            proposalCode: true,
            isSigned: true,
            invoiceNumber: true,
            invoiceDate: true,
            paymentConfirmedAt: true,
            paymentConfirmedBy: true,
            clientPaymentConfirmed: true,
            clientPaymentConfirmedAt: true,
            status: true,
            step: true,
            clientName: true,
            clientPhone: true,
            clientEmail: true,
            assignedToId: true,
            performedAt: true,
            createdAt: true,
            updatedAt: true,
            qtdContratada: true,
            valorUnitario: true,
            valorTotal: true,
            assignedTo: {
                select: {
                    name: true,
                    email: true
                }
            },
            executionItems: {
                orderBy: { numeroSequencial: 'asc' },
                select: {
                    id: true,
                    requestId: true,
                    numeroSequencial: true,
                    tecnicoId: true,
                    dataPlanejada: true,
                    dataExecucao: true,
                    statusExecucao: true,
                    statusFaturamento: true,
                    statusEntrega: true,
                    statusPagamento: true,
                    dataPagamento: true,
                    reportNumber: true,
                    dataEnvioRelatorio: true,
                    observacoes: true,
                    partialInvoiceId: true,
                    createdAt: true,
                    updatedAt: true,
                    partialInvoice: {
                        select: {
                            id: true,
                            requestId: true,
                            numeroNf: true,
                            qtdFaturada: true,
                            valorNota: true,
                            dataEmissao: true,
                            statusPagamento: true,
                            dataPagamento: true,
                            observacoes: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            },
            partialInvoices: {
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    requestId: true,
                    numeroNf: true,
                    qtdFaturada: true,
                    valorNota: true,
                    dataEmissao: true,
                    statusPagamento: true,
                    dataPagamento: true,
                    observacoes: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            satisfactionSurvey: true
        },
        orderBy: { createdAt: 'desc' }
    });

    if (requests.length === 0) return [];

    const requestIds = requests.map(r => r.id);

    const pdfFlags: any[] = await prisma.$queryRaw`
        SELECT 
            id,
            (CASE WHEN "reportPdfUrl" IS NOT NULL AND "reportPdfUrl" != '' THEN true ELSE false END) AS "hasReportPdf",
            (CASE WHEN "proposalPdfUrl" IS NOT NULL AND "proposalPdfUrl" != '' THEN true ELSE false END) AS "hasProposalPdf",
            (CASE WHEN "invoicePdfUrl" IS NOT NULL AND "invoicePdfUrl" != '' THEN true ELSE false END) AS "hasInvoicePdf",
            (CASE WHEN "acceptanceProofUrl" IS NOT NULL AND "acceptanceProofUrl" != '' THEN true ELSE false END) AS "hasAcceptanceProof"
        FROM "TestRequest"
        WHERE id IN (${Prisma.join(requestIds)})
    `;

    const pdfFlagsMap = new Map(pdfFlags.map(f => [f.id, f]));

    const itemPdfFlags: any[] = await prisma.$queryRaw`
        SELECT 
            id,
            (CASE WHEN "reportPdfUrl" IS NOT NULL AND "reportPdfUrl" != '' THEN true ELSE false END) AS "hasReportPdf"
        FROM "TestExecutionItem"
        WHERE "requestId" IN (${Prisma.join(requestIds)})
    `;
    const itemPdfFlagsMap = new Map(itemPdfFlags.map(f => [f.id, f.hasReportPdf]));

    const invoicePdfFlags: any[] = await prisma.$queryRaw`
        SELECT 
            id,
            (CASE WHEN "notaPdfUrl" IS NOT NULL AND "notaPdfUrl" != '' THEN true ELSE false END) AS "hasInvoicePdf"
        FROM "PartialInvoice"
        WHERE "requestId" IN (${Prisma.join(requestIds)})
    `;
    const invoicePdfFlagsMap = new Map(invoicePdfFlags.map(f => [f.id, f.hasInvoicePdf]));

    return requests.map((req: any) => {
        const flags = pdfFlagsMap.get(req.id) || {};
        const hasReportPdf = Boolean(flags.hasReportPdf);
        const hasProposalPdf = Boolean(flags.hasProposalPdf);
        const hasInvoicePdf = Boolean(flags.hasInvoicePdf);

        const isElaborandoOuPosterior = ['ELABORANDO_RELATORIO', 'AGUARDANDO_APROVACAO', 'COBRANCA', 'PAGAMENTO', 'PESQUISA_PENDENTE', 'FINALIZADO'].includes(req.status);
        const qtdContratada = Math.max(req.qtdContratada || 1, req.executionItems.length || 1);
        const qtdExecutadaCalc = req.executionItems.filter((i: any) => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO' || Boolean(itemPdfFlagsMap.get(i.id))).length;
        const batchCount = req.quantidadeEnsaios ? (parseInt(String(req.quantidadeEnsaios)) || 1) : 1;
        const qtdExecutada = Math.max(qtdExecutadaCalc, isElaborandoOuPosterior ? Math.min(qtdContratada, Math.max(1, batchCount)) : 0);
        const qtdEntregue = req.executionItems.filter((i: any) => i.statusEntrega === 'ENVIADO_AO_CLIENTE').length;
        const qtdFaturada = req.partialInvoices.reduce((acc: number, inv: any) => acc + inv.qtdFaturada, 0);
        const qtdPagosCalc = req.executionItems.filter((i: any) => i.statusPagamento === 'PAGO').length;
        const legacyPaid = Boolean(req.paymentConfirmedAt) ? (qtdFaturada > 0 ? qtdFaturada : qtdContratada) : 0;
        const qtdPagos = Math.min(qtdContratada, Math.max(qtdPagosCalc, legacyPaid));

        return {
            ...req,
            executionItems: req.executionItems.map((item: any) => ({
                ...item,
                reportPdfUrl: itemPdfFlagsMap.get(item.id) ? `/api/solicitacoes/${req.id}/pdf?type=report&itemId=${item.id}` : null
            })),
            partialInvoices: req.partialInvoices.map((inv: any) => ({
                ...inv,
                notaPdfUrl: invoicePdfFlagsMap.get(inv.id) ? `/api/solicitacoes/${req.id}/pdf?type=invoice&invoiceId=${inv.id}` : null
            })),
            qtdContratada,
            qtdExecutada,
            qtdEntregue,
            qtdPendenteExecucao: Math.max(0, qtdContratada - qtdExecutada),
            qtdPendenteEntrega: Math.max(0, qtdContratada - qtdEntregue),
            qtdFaturada,
            qtdPendenteFaturamento: Math.max(0, qtdExecutada - qtdFaturada),
            qtdPagos,
            qtdPendentePagamento: Math.max(0, qtdContratada - qtdPagos),
            podeFinalizarPagamento: qtdPagos >= qtdContratada,
            porcentagemConcluida: Math.min(100, Math.round((qtdEntregue / qtdContratada) * 100)),
            reportPdfUrl: hasReportPdf ? `/api/solicitacoes/${req.id}/pdf?type=report` : null,
            proposalPdfUrl: hasProposalPdf ? `/api/solicitacoes/${req.id}/pdf?type=proposal` : null,
            invoicePdfUrl: hasInvoicePdf ? `/api/solicitacoes/${req.id}/pdf?type=invoice` : null,
        };
    });
}
