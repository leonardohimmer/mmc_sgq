import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/mail"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ error: "Informe seu e-mail." }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        if (!user) {
            // Por segurança, retorna mensagem genérica para não vazar se o e-mail existe
            return NextResponse.json({ 
                success: true, 
                message: "Se o e-mail informado estiver cadastrado, enviamos um novo link de confirmação." 
            })
        }

        if (user.emailVerified) {
            return NextResponse.json({ 
                success: true, 
                alreadyVerified: true,
                message: "Seu e-mail já foi confirmado anteriormente. Você já pode fazer login." 
            })
        }

        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationTokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpires
            }
        })

        try {
            await sendVerificationEmail(user.email, user.name, verificationToken)
        } catch (mailError) {
            console.error("Erro ao reenviar e-mail de confirmação:", mailError)
        }

        return NextResponse.json({ 
            success: true, 
            message: "Novo link de confirmação enviado para seu e-mail. Verifique sua caixa de entrada e spam." 
        })
    } catch (error: any) {
        console.error("Erro ao reenviar verificação:", error)
        return NextResponse.json({ error: "Erro interno ao processar reenvio de confirmação." }, { status: 500 })
    }
}
