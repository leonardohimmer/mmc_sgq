import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Public: Fetch all site content sections
export async function GET() {
    try {
        const sections = await prisma.siteContent.findMany()
        const result: Record<string, unknown> = {}
        for (const s of sections) {
            result[s.section] = s.data
        }
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar conteúdo do site' }, { status: 500 })
    }
}

// PUT - Protected: Update a specific section (DESENVOLVEDOR only)
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { section, data } = await request.json()

        if (!section || !data) {
            return NextResponse.json({ error: 'Seção e dados são obrigatórios' }, { status: 400 })
        }

        const validSections = ['history', 'stats', 'team', 'testimonials', 'clients']
        if (!validSections.includes(section)) {
            return NextResponse.json({ error: 'Seção inválida' }, { status: 400 })
        }

        const updated = await prisma.siteContent.upsert({
            where: { section },
            update: { data },
            create: { section, data },
        })

        // Invalida o cache da página Sobre para refletir as mudanças
        revalidatePath('/sobre')
        revalidatePath('/api/site-content')

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar conteúdo do site' }, { status: 500 })
    }
}
