import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const SUPPLIER_META_KEY = 'supplier_metadata_sgq'

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role === 'CLIENTE') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const data = await request.json()
        const params = await context.params
        const supplier = await prisma.supplier.update({
            where: { id: params.id },
            data: {
                name: data.name,
                qualified: data.qualified,
                score: data.score !== undefined && data.score !== "" && data.score !== null ? parseFloat(String(data.score)) : null,
                active: data.active,
            }
        })

        let category = data.category && String(data.category).trim() ? String(data.category).trim() : undefined

        try {
            const metaRecord = await prisma.siteContent.findUnique({
                where: { section: SUPPLIER_META_KEY }
            })
            const currentMeta: Record<string, any> =
                metaRecord && metaRecord.data && typeof metaRecord.data === 'object' && !Array.isArray(metaRecord.data)
                    ? { ...(metaRecord.data as Record<string, any>) }
                    : {}

            if (category) {
                currentMeta[params.id] = {
                    ...(currentMeta[params.id] || {}),
                    category
                }
                await prisma.siteContent.upsert({
                    where: { section: SUPPLIER_META_KEY },
                    update: { data: currentMeta },
                    create: { section: SUPPLIER_META_KEY, data: currentMeta }
                })
            } else {
                category = currentMeta[params.id]?.category || 'Calibração'
            }
        } catch (metaErr) {
            console.warn('Não foi possível atualizar metadados de categoria do fornecedor:', metaErr)
        }

        return NextResponse.json({ ...supplier, category: category || 'Calibração' })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar fornecedor' }, { status: 500 })
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role === 'CLIENTE') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const params = await context.params
        await prisma.supplier.delete({
            where: { id: params.id }
        })

        try {
            const metaRecord = await prisma.siteContent.findUnique({
                where: { section: SUPPLIER_META_KEY }
            })
            if (metaRecord && metaRecord.data && typeof metaRecord.data === 'object' && !Array.isArray(metaRecord.data)) {
                const currentMeta = { ...(metaRecord.data as Record<string, any>) }
                if (currentMeta[params.id]) {
                    delete currentMeta[params.id]
                    await prisma.siteContent.update({
                        where: { section: SUPPLIER_META_KEY },
                        data: { data: currentMeta }
                    })
                }
            }
        } catch {
            // ignore cleanup errors
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao deletar fornecedor' }, { status: 500 })
    }
}
