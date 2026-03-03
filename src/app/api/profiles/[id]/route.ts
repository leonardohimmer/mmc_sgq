import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'CONTROLADOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const { permissions } = body

        if (!Array.isArray(permissions)) {
            return NextResponse.json({ error: 'Permissões inválidas' }, { status: 400 })
        }

        const updatedProfile = await prisma.profile.update({
            where: { id },
            data: {
                permissions
            }
        })

        return NextResponse.json(updatedProfile)
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
    }
}
