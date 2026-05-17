import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import crypto from "crypto"
import { sendResetPasswordEmail } from "@/lib/mail"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            // Por segurança, não informamos que o e-mail não existe, mas retornamos sucesso
            return NextResponse.json({ message: "Se o e-mail estiver cadastrado, você receberá um link de recuperação." })
        }

        // Gerar token único
        const token = crypto.randomBytes(32).toString("hex")
        const expires = new Date(Date.now() + 3600000) // 1 hora de validade

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpires: expires
            }
        })

        const emailSent = await sendResetPasswordEmail(user.email, user.name, token)

        if (!emailSent.success) {
             return NextResponse.json({ error: "Erro ao enviar e-mail de recuperação" }, { status: 500 })
        }

        return NextResponse.json({ message: "Se o e-mail estiver cadastrado, você receberá um link de recuperação." })
    } catch (error) {
        console.error("Erro no forgot-password:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
