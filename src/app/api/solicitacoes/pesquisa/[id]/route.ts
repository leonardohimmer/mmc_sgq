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
            justificationSpeed,
            justificationComm,
            justificationTime,
            justificationQuality,
            justificationDoc,
            feedback 
        } = body

        if (!ratingSpeed || !ratingComm || !ratingTime || !ratingQuality || !ratingDoc) {
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
                    justificationSpeed,
                    justificationComm,
                    justificationTime,
                    justificationQuality,
                    justificationDoc,
                    feedback,
                    status: 'COMPLETED'
                }
            })

            // Atualizar o status da solicitação para "FINALIZADO" (modelo antigo)
            await tx.testRequest.update({
                where: { id },
                data: {
                    status: 'FINALIZADO',
                    step: 10
                }
            })

            // Adicionar ao histórico
            await tx.testRequestHistory.create({
                data: {
                    requestId: id,
                    changedBy: 'Cliente (Pesquisa Respondida)',
                    oldStatus: 'PESQUISA_PENDENTE',
                    newStatus: 'FINALIZADO',
                }
            })

            return updatedSurvey
        })

        return NextResponse.json({ success: true, survey: result })
    } catch (error) {
        console.error('Erro ao salvar pesquisa:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
