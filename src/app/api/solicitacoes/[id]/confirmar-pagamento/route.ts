import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        const existingRequest = await prisma.testRequest.findUnique({
            where: { id }
        })

        if (!existingRequest) {
            return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id },
            data: {
                clientPaymentConfirmed: true,
                clientPaymentConfirmedAt: new Date()
            }
        })

        // Registrar no histórico sem mudar o status (apenas para log interno)
        await prisma.testRequestHistory.create({
            data: {
                requestId: id,
                changedBy: existingRequest.clientName || 'Cliente',
                oldStatus: existingRequest.status,
                newStatus: existingRequest.status,
            }
        })

        return NextResponse.json({ success: true, request: updatedRequest })

    } catch (error) {
        console.error('Erro ao confirmar pagamento pelo cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
