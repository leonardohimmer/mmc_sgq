import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const SUPPLIER_META_KEY = 'supplier_metadata_sgq'
const EVAL_SECTION_KEY = 'supplier_evaluations_f35'

function inferDefaultCategory(name: string, evalCategories?: string[]): string {
    if (Array.isArray(evalCategories) && evalCategories.length > 0) {
        const mapped: string[] = []
        if (evalCategories.includes('CALIBRACAO')) mapped.push('Calibração')
        if (evalCategories.includes('PROVEDOR_EP')) mapped.push('Ensaio de Proficiência')
        if (evalCategories.includes('AUDITORIA')) mapped.push('Auditoria')
        if (mapped.length > 0 && mapped.length < 3) {
            return mapped.join(', ')
        }
    }
    const lower = (name || '').toLowerCase()
    if (lower.includes('auditor') || lower.includes('consult')) return 'Auditoria'
    if (lower.includes('ccb') || lower.includes('profici') || lower.includes('ep')) return 'Ensaio de Proficiência'
    return 'Calibração'
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const [suppliers, metaRecord, evalRecord] = await Promise.all([
            prisma.supplier.findMany({
                orderBy: { name: 'asc' }
            }),
            prisma.siteContent.findUnique({
                where: { section: SUPPLIER_META_KEY }
            }).catch(() => null),
            prisma.siteContent.findUnique({
                where: { section: EVAL_SECTION_KEY }
            }).catch(() => null)
        ])

        const metaMap: Record<string, { category?: string }> =
            metaRecord && metaRecord.data && typeof metaRecord.data === 'object' && !Array.isArray(metaRecord.data)
                ? (metaRecord.data as Record<string, { category?: string }>)
                : {}

        const evaluations: any[] =
            evalRecord && Array.isArray(evalRecord.data) ? (evalRecord.data as any[]) : []

        const enriched = suppliers.map(s => {
            const savedCategory = metaMap[s.id]?.category
            if (savedCategory) {
                return { ...s, category: savedCategory }
            }
            const latestEval = evaluations.find(ev => ev.supplierId === s.id)
            const inferred = inferDefaultCategory(s.name, latestEval?.activeCategories)
            return { ...s, category: inferred }
        })

        return NextResponse.json(enriched)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar fornecedores' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role === 'CLIENTE') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const data = await request.json()
        const supplier = await prisma.supplier.create({
            data: {
                name: data.name,
                qualified: data.qualified ?? true,
                score: data.score !== undefined && data.score !== "" && data.score !== null ? parseFloat(String(data.score)) : null,
                active: data.active ?? true,
            }
        })

        const category = data.category && String(data.category).trim() ? String(data.category).trim() : 'Calibração'

        try {
            const metaRecord = await prisma.siteContent.findUnique({
                where: { section: SUPPLIER_META_KEY }
            })
            const currentMeta: Record<string, any> =
                metaRecord && metaRecord.data && typeof metaRecord.data === 'object' && !Array.isArray(metaRecord.data)
                    ? { ...(metaRecord.data as Record<string, any>) }
                    : {}

            currentMeta[supplier.id] = {
                ...(currentMeta[supplier.id] || {}),
                category
            }

            await prisma.siteContent.upsert({
                where: { section: SUPPLIER_META_KEY },
                update: { data: currentMeta },
                create: { section: SUPPLIER_META_KEY, data: currentMeta }
            })
        } catch (metaErr) {
            console.warn('Não foi possível salvar metadados de categoria do fornecedor:', metaErr)
        }

        return NextResponse.json({ ...supplier, category }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar fornecedor' }, { status: 500 })
    }
}
