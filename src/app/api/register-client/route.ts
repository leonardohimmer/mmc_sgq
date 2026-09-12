import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/mail'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, company, whatsapp } = body

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        if (password.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationTokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 horas

        const user = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: 'CLIENTE',
                company: company || null,
                whatsapp: whatsapp || null,
                emailVerified: false,
                verificationToken,
                verificationTokenExpires,
            }
        })

        // Enviar e-mail de verificação e boas-vindas
        try {
            await sendVerificationEmail(user.email, user.name, verificationToken)
        } catch (mailError) {
            console.error('Falha não fatal ao enviar e-mail de verificação:', mailError)
        }

        const { password: _, ...safeUser } = user
        return NextResponse.json({ 
            success: true, 
            user: safeUser,
            message: 'Conta criada com sucesso! Enviamos um e-mail com o link de confirmação para ativação do seu acesso.'
        }, { status: 201 })
    } catch (error) {
        console.error('Error registering client:', error)
        return NextResponse.json({ error: 'Erro ao registrar cliente. Tente novamente ou entre em contato.' }, { status: 500 })
    }
}
