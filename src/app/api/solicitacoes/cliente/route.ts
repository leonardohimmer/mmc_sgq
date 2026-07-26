import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        // Para fins do mock do portal do cliente, filtramos por nome ou devolvemos tudo
        const { searchParams } = new URL(request.url)
        const clientName = searchParams.get('clientName') || 'CLAUDIO SCHERER'
        const clientEmail = (searchParams.get('clientEmail') || searchParams.get('userEmail') || '').trim().toLowerCase()

        const whereCondition: any = clientEmail
            ? {
                OR: [
                    { clientName: clientName },
                    { clientEmail: clientEmail },
                    { sharedEmails: { has: clientEmail } }
                ]
            }
            : {
                clientName: clientName
            }

        // Busca solicitações do cliente omitindo os campos pesados de PDFs
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
                satisfactionSurvey: true
            },
            orderBy: { createdAt: 'desc' }
        })

        // Checagem rápida de presença dos PDFs sem carregar as strings inteiras em memória
        const requestsWithReportPdf = await prisma.testRequest.findMany({
            where: {
                ...whereCondition,
                AND: [
                    { reportPdfUrl: { not: null } },
                    { reportPdfUrl: { not: "" } }
                ]
            },
            select: { id: true }
        })

        const requestsWithProposalPdf = await prisma.testRequest.findMany({
            where: {
                ...whereCondition,
                AND: [
                    { proposalPdfUrl: { not: null } },
                    { proposalPdfUrl: { not: "" } }
                ]
            },
            select: { id: true }
        })

        const requestsWithInvoicePdf = await prisma.testRequest.findMany({
            where: {
                ...whereCondition,
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
        console.error('Erro ao buscar solicitações para cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { 
            type, 
            location, 
            contractorName, 
            constructionCompany, 
            workName, 
            address, 
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            proposalEmail, 
            reportEmail, 
            desiredDate, 
            observations, 
            clientName,
            quantidadeEnsaios,
            email,
            telefone 
        } = body

        if (!type || !location || !desiredDate || !quantidadeEnsaios) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
        }

        let parsedDate = desiredDate;
        let finalObservations = observations || "";
        if (desiredDate && desiredDate.includes(",")) {
            const dateParts = desiredDate.split(",").map((d: string) => d.trim());
            parsedDate = dateParts[0];
            finalObservations += `\n\nDatas desejadas: ${desiredDate}`;
        }

        const processEmails = (val: any) => {
            if (Array.isArray(val)) return val.filter(e => e && e.trim() !== "")
            if (typeof val === 'string') return val.split(',').map(e => e.trim()).filter(e => e !== "")
            return []
        }

        const newRequest = await prisma.testRequest.create({
            data: {
                type,
                location,
                contractorName,
                constructionCompany,
                workName,
                address,
                rua: rua || null,
                numero: numero || null,
                bairro: bairro || null,
                cidade: cidade || null,
                estado: estado || null,
                cep: cep || null,
                proposalEmail,
                reportEmail,
                emailsProposta: processEmails(proposalEmail),
                emailsRelatorio: processEmails(reportEmail),
                desiredDate: new Date(parsedDate),
                datasDesejadas: desiredDate,
                observations: finalObservations.trim(),
                clientName: clientName || 'CLAUDIO SCHERER',
                clientPhone: telefone || null,
                clientEmail: email || null,
                quantidadeEnsaios: quantidadeEnsaios || null,
                status: 'RECEBIDO',
                step: 2
            }
        })

        // Add history for initial creation
        await prisma.testRequestHistory.create({
            data: {
                requestId: newRequest.id,
                changedBy: clientName || 'Cliente',
                oldStatus: 'CRIADO',
                newStatus: 'RECEBIDO'
            }
        })

        return NextResponse.json({ success: true, request: newRequest })
    } catch (error) {
        console.error('Erro ao criar solicitação de cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
