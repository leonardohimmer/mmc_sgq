import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

        const formattedRequests = await Promise.all(requests.map(async req => {
            const hasReportPdf = Boolean(req.reportPdfUrl && req.reportPdfUrl.trim() !== "");
            const hasProposalPdf = Boolean(req.proposalPdfUrl && req.proposalPdfUrl.trim() !== "");
            const hasInvoicePdf = Boolean(req.invoicePdfUrl && req.invoicePdfUrl.trim() !== "");

            let items = req.executionItems;
            if (items.length === 0) {
                items = await ensureExecutionItemsCreated(req.id, req.quantidadeEnsaios);
            }

            const isElaborandoOuPosterior = ['ELABORANDO_RELATORIO', 'AGUARDANDO_APROVACAO', 'COBRANCA', 'PAGAMENTO', 'PESQUISA_PENDENTE', 'FINALIZADO'].includes(req.status);
            const qtdContratada = Math.max(req.qtdContratada || 1, items.length);
            const qtdExecutadaCalc = items.filter(i => i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO' || Boolean(i.reportPdfUrl)).length;
            const batchCount = req.quantidadeEnsaios ? (parseInt(String(req.quantidadeEnsaios)) || 1) : 1;
            const qtdExecutada = Math.max(qtdExecutadaCalc, isElaborandoOuPosterior ? Math.min(qtdContratada, Math.max(1, batchCount)) : 0);
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
                reportPdfUrl: hasReportPdf ? `/api/solicitacoes/${req.id}/pdf?type=report` : null,
                proposalPdfUrl: hasProposalPdf ? `/api/solicitacoes/${req.id}/pdf?type=proposal` : null,
                invoicePdfUrl: hasInvoicePdf ? `/api/solicitacoes/${req.id}/pdf?type=invoice` : null,
            };
        }))

        return NextResponse.json(formattedRequests)
    } catch (error) {
        console.error('Erro ao buscar solicitações para cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

function safeParseDate(input?: any): Date {
    if (!input) return new Date();
    if (input instanceof Date && !isNaN(input.getTime())) return input;
    
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return new Date();

        const firstPart = trimmed.split(',')[0].trim();

        const directDate = new Date(firstPart);
        if (!isNaN(directDate.getTime())) return directDate;

        const brMatch = firstPart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (brMatch) {
            const day = parseInt(brMatch[1], 10);
            const month = parseInt(brMatch[2], 10) - 1;
            const year = parseInt(brMatch[3], 10);
            const brDate = new Date(year, month, day);
            if (!isNaN(brDate.getTime())) return brDate;
        }
    }

    return new Date();
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
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
        } = body;

        const finalType = type || "Ensaio de Engenharia";
        const finalLocation = location || workName || address || "Localização a definir";
        const finalQtdEnsaios = quantidadeEnsaios || "1 ensaio";
        const finalDesiredDateStr = desiredDate || new Date().toISOString();
        const dateObj = safeParseDate(finalDesiredDateStr);

        let finalObservations = observations || "";
        if (desiredDate && typeof desiredDate === 'string' && desiredDate.includes(",")) {
            finalObservations += `\n\nDatas desejadas: ${desiredDate}`;
        }

        const processEmails = (val: any) => {
            if (Array.isArray(val)) return val.filter(e => e && typeof e === 'string' && e.trim() !== "");
            if (typeof val === 'string') return val.split(',').map(e => e.trim()).filter(e => e !== "");
            return [];
        };

        const finalClientName = clientName || session?.user?.name || contractorName || 'Cliente';
        const finalClientEmail = email || session?.user?.email || null;

        const newRequest = await prisma.testRequest.create({
            data: {
                type: finalType,
                location: finalLocation,
                contractorName: contractorName || null,
                constructionCompany: constructionCompany || null,
                workName: workName || null,
                address: address || null,
                rua: rua || null,
                numero: numero || null,
                bairro: bairro || null,
                cidade: cidade || null,
                estado: estado || null,
                cep: cep || null,
                proposalEmail: proposalEmail || null,
                reportEmail: reportEmail || null,
                emailsProposta: processEmails(proposalEmail),
                emailsRelatorio: processEmails(reportEmail),
                desiredDate: dateObj,
                datasDesejadas: typeof desiredDate === 'string' ? desiredDate : dateObj.toISOString(),
                observations: finalObservations.trim(),
                clientName: finalClientName,
                clientPhone: telefone || null,
                clientEmail: finalClientEmail,
                quantidadeEnsaios: finalQtdEnsaios,
                status: 'RECEBIDO',
                step: 1
            }
        });

        // Gerar automaticamente os N itens de execução para a OS
        await ensureExecutionItemsCreated(newRequest.id, finalQtdEnsaios);

        // Registrar histórico inicial
        await prisma.testRequestHistory.create({
            data: {
                requestId: newRequest.id,
                changedBy: finalClientName,
                oldStatus: 'CRIADO',
                newStatus: 'RECEBIDO'
            }
        });

        return NextResponse.json({ success: true, request: newRequest });
    } catch (error: any) {
        console.error('Erro ao criar solicitação de cliente:', error);
        return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
    }
}
