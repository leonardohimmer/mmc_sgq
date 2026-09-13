import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateShareToken } from '@/lib/share-token'
import { sendShareProcessEmail } from '@/lib/mail'
import { formatOsCode } from '@/lib/os-balance-service'

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

        // Apenas o criador (dono) ou ADMIN/TECNICO pode alterar e-mails compartilhados
        const userEmail = (session.user.email || '').toLowerCase().trim()
        const userName = (session.user.name || '').toLowerCase().trim()
        const ownerEmail = (existing.clientEmail || '').toLowerCase().trim()
        const ownerName = (existing.clientName || '').toLowerCase().trim()

        const isOwner = (userEmail && ownerEmail && userEmail === ownerEmail) ||
                        (userName && ownerName && userName === ownerName)

        if (!isOwner && session.user.role !== 'ADMIN' && session.user.role !== 'TECNICO') {
            return NextResponse.json(
                { error: 'Somente o criador da solicitação de ensaio pode compartilhar ou remover permissões.' },
                { status: 403 }
            )
        }

        // Identifica novos e-mails que acabaram de ser adicionados
        const previousEmails = (existing.sharedEmails || []).map((e: string) => e.trim().toLowerCase())
        const newlyAddedEmails = cleanedEmails.filter(e => !previousEmails.includes(e))

        const updated = await prisma.testRequest.update({
            where: { id },
            data: {
                sharedEmails: cleanedEmails
            }
        })

        const changedBy = session.user.name || session.user.email || 'Cliente'

        // Log history entry
        await prisma.testRequestHistory.create({
            data: {
                requestId: id,
                changedBy: `${changedBy} (Compartilhamento: ${cleanedEmails.length} e-mail(s) configurado(s))`,
                oldStatus: existing.status,
                newStatus: existing.status
            }
        })

        // Disparo de e-mails para novos destinatários com link de acesso rápido (Somente Visualização e Download)
        const baseUrl = (process.env.NEXTAUTH_URL || 'https://mmclab.vercel.app').replace('site-sgq-six.vercel.app', 'mmclab.vercel.app')
        const osCodeFormatted = formatOsCode(existing)

        let emailsSentCount = 0
        const emailResults: { email: string; success: boolean }[] = []

        for (const newEmail of newlyAddedEmails) {
            try {
                // Checa se o usuário já possui cadastro
                const registeredUser = await prisma.user.findUnique({
                    where: { email: newEmail }
                })
                const isNewUser = !registeredUser

                // Gera token criptográfico de acesso rápido
                const token = generateShareToken(id, newEmail)
                const accessUrl = `${baseUrl}/portal-cliente/compartilhado?token=${token}`

                const emailRes = await sendShareProcessEmail({
                    to: newEmail,
                    sharedByName: session.user.name || existing.clientName || 'O cliente solicitante',
                    processId: id,
                    osCode: osCodeFormatted,
                    processType: existing.type,
                    workName: existing.workName,
                    contractorName: existing.contractorName,
                    accessUrl,
                    isNewUser
                })

                if (emailRes.success) {
                    emailsSentCount++
                    emailResults.push({ email: newEmail, success: true })
                } else {
                    emailResults.push({ email: newEmail, success: false })
                }
            } catch (mailErr) {
                console.error(`Falha ao disparar e-mail de compartilhamento para ${newEmail}:`, mailErr)
                emailResults.push({ email: newEmail, success: false })
            }
        }

        if (newlyAddedEmails.length > 0) {
            await prisma.testRequestHistory.create({
                data: {
                    requestId: id,
                    changedBy: `${changedBy} (E-mail com acesso rápido enviado para: ${newlyAddedEmails.join(', ')})`,
                    oldStatus: existing.status,
                    newStatus: existing.status
                }
            })
        }

        return NextResponse.json({
            success: true,
            sharedEmails: updated.sharedEmails,
            newlyAddedEmails,
            emailsSentCount,
            emailResults
        })
    } catch (error) {
        console.error('Erro ao atualizar e-mails compartilhados:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

