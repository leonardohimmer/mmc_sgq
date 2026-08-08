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
            },
            orderBy: { createdAt: 'desc' }
        })

        // Checagem rápida de presença dos PDFs sem carregar as strings inteiras em memória
        const requestsWithReportPdf = await prisma.testRequest.findMany({
            where: {
                AND: [
                    { reportPdfUrl: { not: null } },
                    { reportPdfUrl: { not: "" } }
                ]
            },
            select: { id: true }
        })

        const requestsWithProposalPdf = await prisma.testRequest.findMany({
            where: {
                AND: [
                    { proposalPdfUrl: { not: null } },
                    { proposalPdfUrl: { not: "" } }
                ]
            },
            select: { id: true }
        })

        const requestsWithInvoicePdf = await prisma.testRequest.findMany({
            where: {
                AND: [
                    { invoicePdfUrl: { not: null } },
                    { invoicePdfUrl: { not: "" } }
                ]
            },
            select: { id: true }
        })

        const reportSet = new Set(requestsWithReportPdf.map(r => r.id))
        const proposalSet = new Set(requestsWithProposalPdf.map(r => r.id))
        const invoiceSet = new Set(requestsWithInvoicePdf.map(r => r.id))

        const formattedRequests = requests.map(req => {
            const qtdContratada = Math.max(req.qtdContratada || 1, req.executionItems.length || 1);
            const qtdExecutada = req.executionItems.filter(i => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO').length;
            const qtdEntregue = req.executionItems.filter(i => i.statusEntrega === 'ENVIADO_AO_CLIENTE').length;
            const qtdFaturada = req.partialInvoices.reduce((acc, inv) => acc + inv.qtdFaturada, 0);

            return {
                ...req,
                qtdContratada,
                qtdExecutada,
                qtdEntregue,
                qtdPendenteExecucao: Math.max(0, qtdContratada - qtdExecutada),
                qtdPendenteEntrega: Math.max(0, qtdContratada - qtdEntregue),
                qtdFaturada,
                qtdPendenteFaturamento: Math.max(0, qtdExecutada - qtdFaturada),
                porcentagemConcluida: Math.min(100, Math.round((qtdEntregue / qtdContratada) * 100)),
                reportPdfUrl: reportSet.has(req.id) ? `/api/solicitacoes/${req.id}/pdf?type=report` : null,
                proposalPdfUrl: proposalSet.has(req.id) ? `/api/solicitacoes/${req.id}/pdf?type=proposal` : null,
                invoicePdfUrl: invoiceSet.has(req.id) ? `/api/solicitacoes/${req.id}/pdf?type=invoice` : null,
            };
        })

        return NextResponse.json(formattedRequests)
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
