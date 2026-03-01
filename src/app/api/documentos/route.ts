import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { logAction } from "@/lib/audit"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    // Optionally log the read action for HIGH security compliance
    // await logAction(session.user.id, "READ", "Document", "ALL", { count: documents.length })

    return NextResponse.json(documents)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const allowedRoles = ["ADMIN", "DIREÇÃO", "RESPONSÁVEL TÉCNICO", "QUALIDADE"]

    if (!session?.user || !allowedRoles.includes(session.user.role)) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    try {
        const data = await req.json()
        const { title, code, content, status } = data

        const doc = await prisma.document.create({
            data: {
                title,
                code,
                content,
                status: status || "DRAFT",
                version: 1,
            }
        })

        await logAction(
            session.user.id,
            "CREATE",
            "Document",
            doc.id,
            { title: doc.title, code: doc.code, version: 1 }
        )

        return NextResponse.json(doc, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
