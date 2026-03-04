import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const data = await request.json()
        const params = await context.params
        const supplier = await prisma.supplier.update({
            where: { id: params.id },
            data: {
                name: data.name,
                qualified: data.qualified,
                score: data.score ? parseFloat(data.score) : null,
                active: data.active,
            }
        })
        return NextResponse.json(supplier)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar fornecedor' }, { status: 500 })
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const params = await context.params
        await prisma.supplier.delete({
            where: { id: params.id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao deletar fornecedor' }, { status: 500 })
    }
}
