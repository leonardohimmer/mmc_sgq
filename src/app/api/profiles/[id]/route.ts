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
        if (!session?.user || session.user.role !== 'DESENVOLVEDOR') {
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

        // Propagar as novas permissões para todos os usuários que possuem este perfil
        const allUsers = await prisma.user.findMany({
            select: { id: true, role: true }
        })

        // Buscar todos os perfis atualizados para recalcular permissões corretamente
        const allProfiles = await prisma.profile.findMany()
        const profileMap = new Map(allProfiles.map(p => [p.name, p.permissions]))

        const usersToUpdate = allUsers.filter(user => {
            const userRoles = (user.role || '').split(',').map(r => r.trim()).filter(r => r)
            return userRoles.includes(updatedProfile.name)
        })

        // Atualizar cada usuário com as permissões combinadas de todos os seus perfis
        for (const user of usersToUpdate) {
            const userRoles = (user.role || '').split(',').map(r => r.trim()).filter(r => r)
            const combinedPermissions = new Set<string>()
            
            for (const roleName of userRoles) {
                const rolePerms = profileMap.get(roleName) || []
                rolePerms.forEach(p => combinedPermissions.add(p))
            }

            await prisma.user.update({
                where: { id: user.id },
                data: { permissions: Array.from(combinedPermissions) }
            })
        }

        return NextResponse.json({ 
            ...updatedProfile, 
            usersUpdated: usersToUpdate.length 
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
    }
}
