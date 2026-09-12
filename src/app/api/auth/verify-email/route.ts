import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.json({ error: "Token de verificação não informado." }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        })

        if (!user) {
            return NextResponse.json({ error: "Link de verificação inválido ou já utilizado." }, { status: 400 })
        }

        if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
            return NextResponse.json({ 
                error: "Este link de confirmação expirou. Solicite um novo link de confirmação.",
                expired: true,
                email: user.email 
            }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null,
            }
        })

        return NextResponse.json({ 
            success: true, 
            message: "E-mail confirmado com sucesso! Sua conta foi ativada." 
        })
    } catch (error: any) {
        console.error("Erro ao verificar e-mail:", error)
        return NextResponse.json({ error: "Erro interno do servidor ao verificar e-mail." }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { token } = body

        if (!token) {
            return NextResponse.json({ error: "Token de verificação não informado." }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        })

        if (!user) {
            return NextResponse.json({ error: "Link de verificação inválido ou já utilizado." }, { status: 400 })
        }

        if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
            return NextResponse.json({ 
                error: "Este link de confirmação expirou. Solicite um novo link de confirmação.",
                expired: true,
                email: user.email 
            }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null,
            }
        })

        return NextResponse.json({ 
            success: true, 
            message: "E-mail confirmado com sucesso! Sua conta foi ativada." 
        })
    } catch (error: any) {
        console.error("Erro ao verificar e-mail:", error)
        return NextResponse.json({ error: "Erro interno do servidor ao verificar e-mail." }, { status: 500 })
    }
}
