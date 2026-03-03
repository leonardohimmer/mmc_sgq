import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
        const { status, assignedToId, appliedStandard, measuredData, result, technicalObservations, reportNumber, reportPdfUrl, isSigned } = body

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
        if (status) updateData.status = status
        if (assignedToId !== undefined) updateData.assignedToId = assignedToId === "" ? null : assignedToId
        if (appliedStandard !== undefined) updateData.appliedStandard = appliedStandard
        if (measuredData !== undefined) updateData.measuredData = measuredData
        if (result !== undefined) updateData.result = result
        if (technicalObservations !== undefined) updateData.technicalObservations = technicalObservations
        if (reportNumber !== undefined) updateData.reportNumber = reportNumber
        if (reportPdfUrl !== undefined) updateData.reportPdfUrl = reportPdfUrl
        if (isSigned !== undefined) updateData.isSigned = isSigned

        // Execute transaction to update and record history simultaneously
        const [updatedRequest, historyRecord] = await prisma.$transaction([
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
                    newStatus: status || existingRequest.status,
                    assignedToId: assignedToId !== undefined ? (assignedToId === "" ? null : assignedToId) : existingRequest.assignedToId
                }
            })
        ])

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
