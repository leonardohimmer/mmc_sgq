import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        // Para fins do mock do portal do cliente, filtramos por nome ou devolvemos tudo
        const { searchParams } = new URL(request.url)
        const clientName = searchParams.get('clientName') || 'CLAUDIO SCHERER'

        const requests = await prisma.testRequest.findMany({
            where: {
                // clientName // se quisesse filtrar rigorosamente pelo nome exato
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(requests)
    } catch (error) {
        console.error('Erro ao buscar solicitações para cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { type, location, contractorName, constructionCompany, workName, address, proposalEmail, reportEmail, desiredDate, observations, clientName } = body

        if (!type || !location || !desiredDate) {
            return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
        }

        const newRequest = await prisma.testRequest.create({
            data: {
                type,
                location,
                contractorName,
                constructionCompany,
                workName,
                address,
                proposalEmail,
                reportEmail,
                desiredDate: new Date(desiredDate),
                observations,
                clientName: clientName || 'CLAUDIO SCHERER',
                status: 'RECEBIDO'
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
