import { google } from 'googleapis'
import prisma from '@/lib/prisma'

/**
 * Retorna o cliente OAuth2 do Google configurado.
 */
export function getOAuth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/callback`

    if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configurados no ambiente.')
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

/**
 * Gera a URL de autenticação do Google solicitando acesso offline e escopos da Agenda.
 */
export function getAuthUrl() {
    const oauth2Client = getOAuth2Client()
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // Garante que o refresh_token seja entregue
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    })
}

/**
 * Retorna uma instância autenticada da API Google Calendar v3 para o usuário.
 * Caso o token de acesso esteja expirado, atualiza-o automaticamente usando o refresh_token.
 */
export async function getGoogleCalendarClient(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            googleAccessToken: true,
            googleRefreshToken: true,
            googleTokenExpiry: true,
        }
    })

    if (!user || !user.googleAccessToken || !user.googleRefreshToken) {
        throw new Error('A agenda do Google não está conectada para este usuário.')
    }

    const oauth2Client = getOAuth2Client()
    
    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
        expiry_date: user.googleTokenExpiry ? new Date(user.googleTokenExpiry).getTime() : undefined
    })

    // Verifica se expira nos próximos 5 minutos
    const isExpired = user.googleTokenExpiry
        ? new Date(user.googleTokenExpiry).getTime() < Date.now() + 5 * 60 * 1000
        : true

    if (isExpired) {
        try {
            const { credentials } = await oauth2Client.refreshAccessToken()
            
            // Atualiza os novos tokens no banco de dados
            await prisma.user.update({
                where: { id: userId },
                data: {
                    googleAccessToken: credentials.access_token,
                    googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
                    ...(credentials.refresh_token && { googleRefreshToken: credentials.refresh_token })
                }
            })

            oauth2Client.setCredentials(credentials)
        } catch (error) {
            console.error('Erro ao renovar token de acesso do Google:', error)
            throw new Error('Sua conexão com o Google Agenda expirou. Por favor, reconecte-a.')
        }
    }

    return google.calendar({ version: 'v3', auth: oauth2Client })
}
