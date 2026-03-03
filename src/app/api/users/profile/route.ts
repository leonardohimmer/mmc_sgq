import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        const { password, ...safeUser } = user
        return NextResponse.json(safeUser)
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        // Verifica se o usuário está autenticado
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { avatarUrl, emotion } = body

        // Atualiza o perfil do usuário logado
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                ...(avatarUrl !== undefined && { avatarUrl }),
                ...(emotion !== undefined && { emotion }),
            }
        })

        const { password, ...safeUser } = updatedUser

        return NextResponse.json(safeUser)
    } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
    }
}
