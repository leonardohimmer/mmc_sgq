import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token e senha são obrigatórios" }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date()
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            }
        })

        return NextResponse.json({ message: "Senha redefinida com sucesso!" })
    } catch (error) {
        console.error("Erro no reset-password:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
