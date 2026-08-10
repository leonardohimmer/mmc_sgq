import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Busca solicitações com itens de execução e notas fiscais parciais
        const requests = await prisma.testRequest.findMany({
            include: {
                assignedTo: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                executionItems: {
                    orderBy: { numeroSequencial: 'asc' },
                },
                partialInvoices: {
                    orderBy: { createdAt: 'desc' },
                },
                satisfactionSurvey: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        const formattedRequests = requests.map(req => {
            const hasReportPdf = Boolean(req.reportPdfUrl && req.reportPdfUrl.trim() !== "");
            const hasProposalPdf = Boolean(req.proposalPdfUrl && req.proposalPdfUrl.trim() !== "");
            const hasInvoicePdf = Boolean(req.invoicePdfUrl && req.invoicePdfUrl.trim() !== "");

            const qtdContratada = Math.max(req.qtdContratada || 1, req.executionItems.length || 1);
            const qtdExecutada = req.executionItems.filter(i => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO').length;
            const qtdEntregue = req.executionItems.filter(i => i.statusEntrega === 'ENVIADO_AO_CLIENTE').length;
            const qtdFaturada = req.partialInvoices.reduce((acc, inv) => acc + inv.qtdFaturada, 0);
            const qtdPagosCalc = req.executionItems.filter(i => i.statusPagamento === 'PAGO').length;
            const legacyPaid = Boolean(req.paymentConfirmedAt) ? (qtdFaturada > 0 ? qtdFaturada : qtdContratada) : 0;
            const qtdPagos = Math.min(qtdContratada, Math.max(qtdPagosCalc, legacyPaid));

            return {
                ...req,
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
        })

        return NextResponse.json(formattedRequests)
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
