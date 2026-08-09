import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const survey = await prisma.satisfactionSurvey.findUnique({
            where: { requestId: id },
            include: {
                request: {
                    select: {
                        id: true,
                        type: true,
                        reportNumber: true,
                        workName: true,
                    }
                }
            }
        })

        if (!survey) {
            return NextResponse.json({ error: 'Pesquisa não encontrada' }, { status: 404 })
        }

        return NextResponse.json(survey)
    } catch (error) {
        console.error('Erro ao buscar pesquisa:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { 
            ratingSpeed, 
            ratingComm, 
            ratingTime, 
            ratingQuality, 
            ratingDoc, 
            ratingSystem, 
            justificationSpeed,
            justificationComm,
            justificationTime,
            justificationQuality,
            justificationDoc,
            justificationSystem, 
            feedback 
        } = body

        if (!ratingSpeed || !ratingComm || !ratingTime || !ratingQuality || !ratingDoc || !ratingSystem) {
            return NextResponse.json({ error: 'Todas as notas são obrigatórias' }, { status: 400 })
        }

        // Usar transação para garantir que ambos os registros sejam atualizados
        const result = await prisma.$transaction(async (tx) => {
            const updatedSurvey = await tx.satisfactionSurvey.update({
                where: { requestId: id },
                data: {
                    ratingSpeed: parseInt(ratingSpeed),
                    ratingComm: parseInt(ratingComm),
                    ratingTime: parseInt(ratingTime),
                    ratingQuality: parseInt(ratingQuality),
                    ratingDoc: parseInt(ratingDoc),
                    ratingSystem: parseInt(ratingSystem), 
                    justificationSpeed,
                    justificationComm,
                    justificationTime,
                    justificationQuality,
                    justificationDoc,
                    justificationSystem, 
                    feedback,
                    status: 'COMPLETED'
                }
            })

            // Verificar se todos os ensaios contratados já foram concluídos/entregues antes de mover a OS para FINALIZADO
            const reqData = await tx.testRequest.findUnique({
                where: { id },
                include: { executionItems: true }
            })

            const qtdContratada = Math.max(reqData?.qtdContratada || 1, reqData?.executionItems.length || 1);
            const qtdEntregue = (reqData?.executionItems || []).filter(
                i => i.statusEntrega === 'ENVIADO_AO_CLIENTE' || i.statusExecucao === 'CONCLUIDO' || i.statusExecucao === 'APROVADO'
            ).length;

            const todosEnsaiosEntregues = qtdEntregue >= qtdContratada;

            if (todosEnsaiosEntregues) {
                await tx.testRequest.update({
                    where: { id },
                    data: {
                        status: 'FINALIZADO',
                        step: 10
                    }
                })

                await tx.testRequestHistory.create({
                    data: {
                        requestId: id,
                        changedBy: 'Cliente (Pesquisa Respondida)',
                        oldStatus: reqData?.status || 'PESQUISA_PENDENTE',
                        newStatus: 'FINALIZADO',
                    }
                })
            }

            return updatedSurvey
        })

        return NextResponse.json({ success: true, survey: result })
    } catch (error) {
        console.error('Erro ao salvar pesquisa:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
