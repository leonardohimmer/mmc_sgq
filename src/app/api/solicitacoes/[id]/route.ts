import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendFinalizedEmail } from '@/lib/mail'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { 
            status, 
            assignedToId, 
            appliedStandard, 
            measuredData, 
            result, 
            technicalObservations, 
            reportNumber, 
            reportPdfUrl, 
            isSigned, 
            step, 
            performedAt, 
            invoiceNumber, 
            invoicePdfUrl, 
            invoiceDate, 
            paymentConfirmedAt, 
            paymentConfirmedBy,
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
            emailsProposta,
            emailsRelatorio,
            datasDesejadas,
            observations,
            clientPhone,
            clientEmail,
            quantidadeEnsaios
        } = body

        // Verify if request exists
        const existingRequest = await prisma.testRequest.findUnique({
            where: { id }
        })

        if (!existingRequest) {
            return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
        }

        // Store the name of the user making the change
        const changedBy = session.user.name || session.user.email || 'Sistema'

        // Prepare the update payload
        const updateData: any = {}
        if (status) {
            // Log detalhado para auditoria de mudança de status
            if (status !== existingRequest.status) {
                console.log(`[AUDITORIA] Mudança de status solicitada: ${existingRequest.status} -> ${status} | Por: ${changedBy} | ID: ${id}`);
            }

            // Bloqueio de transição manual para AGUARDANDO_ACEITE sem proposta
            if (status === 'AGUARDANDO_ACEITE' && !body.proposalPdfUrl && !existingRequest.proposalPdfUrl) {
                console.warn(`[BLOQUEIO] Tentativa de mudar para AGUARDANDO_ACEITE sem proposta anexada. Usuário: ${changedBy}`);
                return NextResponse.json({ 
                    error: 'O status AGUARDANDO_ACEITE só pode ser definido através do módulo de Envio de Proposta (com PDF anexado).' 
                }, { status: 400 });
            }
            updateData.status = status
        }
        if (assignedToId !== undefined) updateData.assignedToId = assignedToId === "" ? null : assignedToId
        if (appliedStandard !== undefined) updateData.appliedStandard = appliedStandard
        if (measuredData !== undefined) updateData.measuredData = measuredData
        if (result !== undefined) updateData.result = result
        if (technicalObservations !== undefined) updateData.technicalObservations = technicalObservations
        if (reportNumber !== undefined) updateData.reportNumber = reportNumber
        if (reportPdfUrl !== undefined) updateData.reportPdfUrl = reportPdfUrl
        if (isSigned !== undefined) updateData.isSigned = isSigned
        if (step !== undefined) updateData.step = step
        if (performedAt !== undefined) updateData.performedAt = performedAt ? new Date(performedAt) : null
        if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber
        if (invoicePdfUrl !== undefined) updateData.invoicePdfUrl = invoicePdfUrl
        if (invoiceDate !== undefined) updateData.invoiceDate = invoiceDate ? new Date(invoiceDate) : null
        if (paymentConfirmedAt !== undefined) updateData.paymentConfirmedAt = paymentConfirmedAt ? new Date(paymentConfirmedAt) : null
        if (paymentConfirmedBy !== undefined) updateData.paymentConfirmedBy = paymentConfirmedBy

        // Campos básicos da solicitação
        if (type !== undefined) updateData.type = type
        if (location !== undefined) updateData.location = location
        if (contractorName !== undefined) updateData.contractorName = contractorName
        if (constructionCompany !== undefined) updateData.constructionCompany = constructionCompany
        if (workName !== undefined) updateData.workName = workName
        if (address !== undefined) updateData.address = address
        if (rua !== undefined) updateData.rua = rua
        if (numero !== undefined) updateData.numero = numero
        if (bairro !== undefined) updateData.bairro = bairro
        if (cidade !== undefined) updateData.cidade = cidade
        if (estado !== undefined) updateData.estado = estado
        if (cep !== undefined) updateData.cep = cep
        if (proposalEmail !== undefined) updateData.proposalEmail = proposalEmail
        if (reportEmail !== undefined) updateData.reportEmail = reportEmail
        if (emailsProposta !== undefined) updateData.emailsProposta = emailsProposta
        if (emailsRelatorio !== undefined) updateData.emailsRelatorio = emailsRelatorio
        if (datasDesejadas !== undefined) updateData.datasDesejadas = datasDesejadas
        if (observations !== undefined) updateData.observations = observations
        if (clientPhone !== undefined) updateData.clientPhone = clientPhone
        if (clientEmail !== undefined) updateData.clientEmail = clientEmail
        if (quantidadeEnsaios !== undefined) updateData.quantidadeEnsaios = quantidadeEnsaios

        // Lógica de Sincronização Bidirecional Status <-> Passo
        const stepToStatusMap: Record<number, string> = {
            1: 'RECEBIDO',
            2: 'AGUARDANDO_ACEITE',
            3: 'AGUARDANDO_AGENDAMENTO',
            4: 'EM_EXECUCAO',
            5: 'ELABORANDO_RELATORIO',
            6: 'AGUARDANDO_APROVACAO',
            7: 'COBRANCA',
            8: 'PAGAMENTO',
            9: 'PESQUISA_PENDENTE',
            10: 'FINALIZADO'
        };

        const statusToStepMap: Record<string, number> = {
            'RECEBIDO': 1,
            'AGUARDANDO_ACEITE': 2,
            'AGUARDANDO_AGENDAMENTO': 3,
            'EM_EXECUCAO': 4,
            'ELABORANDO_RELATORIO': 5,
            'AGUARDANDO_APROVACAO': 6,
            'COBRANCA': 7,
            'PAGAMENTO': 8,
            'PESQUISA_PENDENTE': 9,
            'PESQUISA_REGISTRO': 9,
            'FINALIZADO': 10
        };

        let finalStatus = status;
        let finalStep = step;

        if (finalStatus && finalStep === undefined) {
            finalStep = statusToStepMap[finalStatus];
        } else if (finalStep !== undefined && !finalStatus) {
            finalStatus = stepToStatusMap[finalStep];
        }

        if (finalStatus) {
            // Log detalhado para auditoria de mudança de status
            if (finalStatus !== existingRequest.status) {
                console.log(`[AUDITORIA] Mudança de status solicitada: ${existingRequest.status} -> ${finalStatus} | Por: ${changedBy} | ID: ${id}`);
            }

            // Bloqueio de transição manual para AGUARDANDO_ACEITE sem proposta
            if (finalStatus === 'AGUARDANDO_ACEITE' && !body.proposalPdfUrl && !existingRequest.proposalPdfUrl) {
                console.warn(`[BLOQUEIO] Tentativa de mudar para AGUARDANDO_ACEITE sem proposta anexada. Usuário: ${changedBy}`);
                return NextResponse.json({ 
                    error: 'O status AGUARDANDO_ACEITE só pode ser definido através do módulo de Envio de Proposta (com PDF anexado).' 
                }, { status: 400 });
            }
            updateData.status = finalStatus;
        }

        if (finalStep !== undefined) {
            updateData.step = finalStep;
        }

        // Automação: Enviar e-mail e criar pesquisa ao mover para PESQUISA_PENDENTE ou FINALIZADO
        const currentStatusValue = finalStatus || existingRequest.status;
        const isSettingFinalized = currentStatusValue === 'FINALIZADO' && existingRequest.status !== 'FINALIZADO';
        
        const isSettingPesquisa = (currentStatusValue === 'PESQUISA_PENDENTE' || currentStatusValue === 'PESQUISA_REGISTRO') && 
            existingRequest.status !== 'PESQUISA_PENDENTE' && existingRequest.status !== 'PESQUISA_REGISTRO';

        const transactionOps: any[] = [
            prisma.testRequest.update({
                where: { id },
                data: updateData,
                include: {
                    assignedTo: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.testRequestHistory.create({
                data: {
                    requestId: id,
                    changedBy,
                    oldStatus: existingRequest.status,
                    newStatus: updateData.status || status || existingRequest.status,
                    assignedToId: assignedToId !== undefined ? (assignedToId === "" ? null : assignedToId) : existingRequest.assignedToId
                }
            })
        ]

        // Criar pesquisa de satisfação se estiver finalizando ou movendo para pesquisa
        if (isSettingPesquisa || isSettingFinalized) {
            transactionOps.push(
                prisma.satisfactionSurvey.upsert({
                    where: { requestId: id },
                    update: {},
                    create: {
                        requestId: id,
                        status: 'PENDING'
                    }
                })
            )
        }

        const results = await prisma.$transaction(transactionOps)
        
        const updatedRequest = results[0]
        const historyRecord = results[1]

        // Enviar e-mail de finalização se o status mudar para FINALIZADO ou PESQUISA_PENDENTE
        if ((isSettingFinalized || isSettingPesquisa) && updatedRequest.clientEmail) {
            await sendFinalizedEmail(
                updatedRequest.clientEmail,
                updatedRequest.clientName,
                updatedRequest.id,
                updatedRequest.type
            )
        }

        return NextResponse.json({ success: true, request: updatedRequest, history: historyRecord })

    } catch (error) {
        console.error('Erro ao atualizar solicitação:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { id } = await params

        const history = await prisma.testRequestHistory.findMany({
            where: { requestId: id },
            orderBy: { createdAt: 'desc' },
            include: {
                request: {
                    select: { clientName: true, type: true }
                }
            }
        })

        return NextResponse.json(history)

    } catch (error) {
        console.error('Erro ao buscar histórico:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
