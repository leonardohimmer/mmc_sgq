import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET - Public: Fetch site content sections (supports ?section=...)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const section = searchParams.get('section')

        if (section) {
            const validSections = ['history', 'stats', 'team', 'testimonials', 'clients', 'ensaio_fotos']
            if (!validSections.includes(section)) {
                return NextResponse.json({ error: 'Seção inválida' }, { status: 400 })
            }

            const record = await prisma.siteContent.findUnique({
                where: { section }
            })
            return NextResponse.json({ [section]: record ? record.data : null })
        }

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

// PUT - Protected: Update a specific section (Collaborators only)
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role === 'CLIENTE') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const { section, data } = await request.json()

        if (!section || !data) {
            return NextResponse.json({ error: 'Seção e dados são obrigatórios' }, { status: 400 })
        }

        const validSections = ['history', 'stats', 'team', 'testimonials', 'clients', 'ensaio_fotos']
        if (!validSections.includes(section)) {
            return NextResponse.json({ error: 'Seção inválida' }, { status: 400 })
        }

        let dataToSave = data
        if (section === 'ensaio_fotos' && data && typeof data === 'object' && 'assayId' in data && 'photos' in data) {
            // Buscar o registro existente para mesclar as fotos
            const currentRecord = await prisma.siteContent.findUnique({
                where: { section }
            })
            const currentData = currentRecord && currentRecord.data && typeof currentRecord.data === 'object'
                ? { ...(currentRecord.data as Record<string, any>) }
                : {}
            
            const payload = data as { assayId: string; photos: string[] }
            currentData[payload.assayId] = payload.photos
            dataToSave = currentData
        }

        const updated = await prisma.siteContent.upsert({
            where: { section },
            update: { data: dataToSave },
            create: { section, data: dataToSave },
        })

        // Invalida o cache de todo o site para refletir as mudanças imediatamente
        revalidatePath('/', 'layout')

        return NextResponse.json(updated)
    } catch (error: any) {
        console.error("PUT Error:", error)
        return NextResponse.json({ 
            error: 'Erro ao atualizar conteúdo do site', 
            details: error?.message || String(error) 
        }, { status: 500 })
    }
}
