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

        // Busca solicitações omitindo os campos pesados de PDFs
        const requests = await prisma.testRequest.findMany({
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
                assignedTo: {
                    select: {
                        name: true,
                        email: true
                    }
                }
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

        const formattedRequests = requests.map(req => ({
            ...req,
            reportPdfUrl: reportSet.has(req.id) ? `/api/solicitacoes/${req.id}/pdf?type=report` : null,
            proposalPdfUrl: proposalSet.has(req.id) ? `/api/solicitacoes/${req.id}/pdf?type=proposal` : null,
            invoicePdfUrl: invoiceSet.has(req.id) ? `/api/solicitacoes/${req.id}/pdf?type=invoice` : null,
        }))

        return NextResponse.json(formattedRequests)
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
