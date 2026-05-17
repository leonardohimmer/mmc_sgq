import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, company, whatsapp } = body

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'CLIENTE',
                company: company || null,
                whatsapp: whatsapp || null,
            }
        })

        const { password: _, ...safeUser } = user
        return NextResponse.json({ success: true, user: safeUser }, { status: 201 })
    } catch (error) {
        console.error('Error registering client:', error)
        return NextResponse.json({ error: 'Erro ao registrar cliente. Tente novamente ou entre em contato.' }, { status: 500 })
    }
}
