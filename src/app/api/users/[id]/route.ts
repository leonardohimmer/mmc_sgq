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
        if (!session?.user || (!session.user.role.includes('DESENVOLVEDOR') && !session.user.role.includes('DIRETOR'))) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const { name, email, role, profileId, password, company, whatsapp, birthDate, permissions } = body

        let targetProfileId = profileId
        if (role && !targetProfileId) {
            const firstRole = role.split(',')[0].trim()
            const profile = await prisma.profile.findUnique({ where: { name: firstRole } })
            if (profile) {
                targetProfileId = profile.id
            }
        }

        // Buscar todos os perfis para calcular as permissões combinadas
        const allProfiles = await prisma.profile.findMany()
        const profileMap = new Map(allProfiles.map(p => [p.name, p.permissions]))
        
        const userRoles = (role || '').split(',').map((r: string) => r.trim()).filter((r: string) => r)
        const combinedPermissions = new Set<string>()
        
        for (const roleName of userRoles) {
            const rolePerms = profileMap.get(roleName) || []
            rolePerms.forEach(p => combinedPermissions.add(p))
        }

        const updateData: any = {
            name,
            email,
            role,
            profileId: targetProfileId,
            company,
            whatsapp,
            birthDate: birthDate ? new Date(birthDate) : null,
            permissions: permissions || Array.from(combinedPermissions)
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
