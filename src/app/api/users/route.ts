import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'CONTROLADOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const users = await prisma.user.findMany({
            include: {
                profile: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        // Removes password for security
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user
            return safeUser
        })

        return NextResponse.json(safeUsers)
    } catch (error) {
        console.error('Error listing users:', error)
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== 'CONTROLADOR') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const body = await request.json()
        const { name, email, password, role, profileId } = body

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Find profile implicitly by role if profileId is not provided
        let targetProfileId = profileId
        if (!targetProfileId) {
            const profile = await prisma.profile.findUnique({ where: { name: role } })
            if (profile) {
                targetProfileId = profile.id
            }
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                profileId: targetProfileId
            }
        })

        const { password: _, ...safeUser } = user
        return NextResponse.json(safeUser, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
    }
}
