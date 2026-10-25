import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const SECTION_KEY = 'supplier_evaluations_f35'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const record = await prisma.siteContent.findUnique({
            where: { section: SECTION_KEY }
        })

        const evaluations = record && Array.isArray(record.data) ? record.data : []
        return NextResponse.json({ evaluations })
    } catch (error: any) {
        console.error('Erro ao buscar avaliações de fornecedores:', error)
        return NextResponse.json({ evaluations: [], error: 'Erro ao buscar avaliações' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role === 'CLIENTE') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const payload = await request.json()

        const record = await prisma.siteContent.findUnique({
            where: { section: SECTION_KEY }
        })

        const currentList: any[] = record && Array.isArray(record.data) ? [...(record.data as any[])] : []

        const evaluationId = payload.id || `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        const newEvaluation = {
            ...payload,
            id: evaluationId,
            updatedAt: new Date().toISOString(),
            createdAt: payload.createdAt || new Date().toISOString(),
        }

        const existingIndex = currentList.findIndex((item) => item.id === evaluationId)
        if (existingIndex >= 0) {
            currentList[existingIndex] = newEvaluation
        } else {
            currentList.unshift(newEvaluation)
        }

        await prisma.siteContent.upsert({
            where: { section: SECTION_KEY },
            update: { data: currentList },
            create: { section: SECTION_KEY, data: currentList },
        })

        // Sincroniza nota e status de qualificação no cadastro do Fornecedor (Supplier)
        if (payload.supplierId) {
            const percentage = Number(payload.percentage ?? 0)
            // Nota na escala 0 a 10 para manter compatibilidade com a tabela Supplier (ex: 92.5% -> 9.25)
            const scoreOutOf10 = Number((percentage / 10).toFixed(2))
            // Classes A, B e C (com restrição) ou A e B (>= 60% qualificado/condicional, < 60% reprovado Classe D)
            const isQualified = percentage >= 60

            try {
                await prisma.supplier.update({
                    where: { id: payload.supplierId },
                    data: {
                        score: scoreOutOf10,
                        qualified: isQualified,
                    }
                })
            } catch (err) {
                console.warn('Não foi possível atualizar tabela Supplier diretamente:', err)
            }
        }

        return NextResponse.json({ evaluation: newEvaluation, evaluations: currentList }, { status: 201 })
    } catch (error: any) {
        console.error('Erro ao salvar avaliação de fornecedor:', error)
        return NextResponse.json({ error: 'Erro ao salvar avaliação', details: error?.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role === 'CLIENTE') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: 'ID da avaliação é obrigatório' }, { status: 400 })
        }

        const record = await prisma.siteContent.findUnique({
            where: { section: SECTION_KEY }
        })

        const currentList: any[] = record && Array.isArray(record.data) ? [...(record.data as any[])] : []
        const filteredList = currentList.filter((item) => item.id !== id)

        await prisma.siteContent.upsert({
            where: { section: SECTION_KEY },
            update: { data: filteredList },
            create: { section: SECTION_KEY, data: filteredList },
        })

        return NextResponse.json({ success: true, evaluations: filteredList })
    } catch (error: any) {
        console.error('Erro ao excluir avaliação:', error)
        return NextResponse.json({ error: 'Erro ao excluir avaliação' }, { status: 500 })
    }
}
