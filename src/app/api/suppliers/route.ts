import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(suppliers)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar fornecedores' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const data = await request.json()
        const supplier = await prisma.supplier.create({
            data: {
                name: data.name,
                qualified: data.qualified ?? true,
                score: data.score ? parseFloat(data.score) : null,
                active: data.active ?? true,
            }
        })
        return NextResponse.json(supplier, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar fornecedor' }, { status: 500 })
    }
}
