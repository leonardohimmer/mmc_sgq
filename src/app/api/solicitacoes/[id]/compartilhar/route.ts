import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
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
        const { sharedEmails } = body

        if (!Array.isArray(sharedEmails)) {
            return NextResponse.json({ error: 'Formato inválido para e-mails compartilhados' }, { status: 400 })
        }

        // Clean & validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const cleanedEmails: string[] = Array.from(
            new Set(
                sharedEmails
                    .map((e: any) => (typeof e === 'string' ? e.trim().toLowerCase() : ''))
                    .filter((e: string) => e !== '' && emailRegex.test(e))
            )
        )

        const existing = await prisma.testRequest.findUnique({
            where: { id }
        })

        if (!existing) {
            return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 })
        }

        const updated = await prisma.testRequest.update({
            where: { id },
            data: {
                sharedEmails: cleanedEmails
            }
        })

        // Log history entry
        const changedBy = session.user.name || session.user.email || 'Cliente'
        await prisma.testRequestHistory.create({
            data: {
                requestId: id,
                changedBy: `${changedBy} (Compartilhamento: ${cleanedEmails.length} e-mail(s))`,
                oldStatus: existing.status,
                newStatus: existing.status
            }
        })

        return NextResponse.json({
            success: true,
            sharedEmails: updated.sharedEmails
        })
    } catch (error) {
        console.error('Erro ao atualizar e-mails compartilhados:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
