import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const doc = await prisma.document.findUnique({
            where: { code: "PESQUISA_SATISFACAO_TEMPLATE" }
        })

        return NextResponse.json({ template: doc })
    } catch (error) {
        console.error("Erro ao buscar template de pesquisa", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    
    // allow admins and techs
    if (!session?.user) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    try {
        const data = await req.json()
        const { content, title } = data

        const doc = await prisma.document.upsert({
            where: { code: "PESQUISA_SATISFACAO_TEMPLATE" },
            update: {
                content,
                title,
                updatedAt: new Date()
            },
            create: {
                code: "PESQUISA_SATISFACAO_TEMPLATE",
                title: title || "Template de Pesquisa de Satisfação",
                content,
                status: "PUBLISHED"
            }
        })

        return NextResponse.json({ success: true, template: doc })
    } catch (error: any) {
        console.error("Erro ao salvar template:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
