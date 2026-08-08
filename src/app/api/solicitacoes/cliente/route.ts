import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ensureExecutionItemsCreated } from '@/lib/os-balance-service'

export async function GET(request: Request) {
    try {
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

        const requests = await prisma.testRequest.findMany({
            where: whereCondition,
            include: {
                executionItems: {
                    orderBy: { numeroSequencial: 'asc' },
                    include: {
                        partialInvoice: true
                    }
                },
                partialInvoices: {
                    orderBy: { createdAt: 'desc' }
                },
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

        const formattedRequests = await Promise.all(requests.map(async req => {
            let items = req.executionItems;
            if (items.length === 0) {
                items = await ensureExecutionItemsCreated(req.id, req.quantidadeEnsaios);
            }

            const qtdContratada = Math.max(req.qtdContratada || 1, items.length);
            const qtdExecutada = items.filter(i => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO').length;
            const qtdEntregue = items.filter(i => i.statusEntrega === 'ENVIADO_AO_CLIENTE').length;
            const qtdFaturada = req.partialInvoices.reduce((acc, inv) => acc + inv.qtdFaturada, 0);

            return {
                ...req,
                executionItems: items,
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

        // Gerar automaticamente os N itens de execução para a OS
        await ensureExecutionItemsCreated(newRequest.id, quantidadeEnsaios);

        // Registrar histórico inicial
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
