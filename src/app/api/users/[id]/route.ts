import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const { name, email, role, profileId, password, company } = body

        let targetProfileId = profileId
        if (role && !targetProfileId) {
            const profile = await prisma.profile.findUnique({ where: { name: role } })
            if (profile) {
                targetProfileId = profile.id
            }
        }

        const updateData: any = {
            name,
            email,
            role,
            profileId: targetProfileId,
            company
        }

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                profile: true
            }
        })

        const { password: _, ...safeUser } = updatedUser
        return NextResponse.json(safeUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const { id } = await params

        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 })
    }
}
