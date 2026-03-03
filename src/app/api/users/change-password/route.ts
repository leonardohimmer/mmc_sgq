import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        const isCorrectPassword = await bcrypt.compare(currentPassword, user.password)

        if (!isCorrectPassword) {
            return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedNewPassword },
        })

        return NextResponse.json({ success: true, message: 'Senha atualizada com sucesso' })
    } catch (error) {
        console.error('Error changing password:', error)
        return NextResponse.json({ error: 'Erro interno ao alterar senha' }, { status: 500 })
    }
}
