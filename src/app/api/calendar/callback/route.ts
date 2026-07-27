import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOAuth2Client } from '@/lib/googleCalendar'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
            return NextResponse.redirect(new URL('/sgq/agenda?error=google_auth_denied', request.url))
        }

        if (!code) {
            return NextResponse.redirect(new URL('/sgq/agenda?error=google_no_code', request.url))
        }

        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const oauth2Client = getOAuth2Client()
        const { tokens } = await oauth2Client.getToken(code)

        if (!tokens.access_token) {
            throw new Error('Não foi possível obter o token de acesso.')
        }

        // Salva os tokens no banco de dados
        // Nota: googleRefreshToken só é fornecido se pedirmos consentimento (que fazemos no getAuthUrl)
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                googleAccessToken: tokens.access_token,
                googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                ...(tokens.refresh_token && { googleRefreshToken: tokens.refresh_token })
            }
        })

        return NextResponse.redirect(new URL('/sgq/agenda?success=connected', request.url))
    } catch (err: any) {
        console.error('Erro no callback do Google OAuth:', err)
        return NextResponse.redirect(new URL(`/sgq/agenda?error=${encodeURIComponent(err.message || 'unknown_callback_error')}`, request.url))
    }
}
