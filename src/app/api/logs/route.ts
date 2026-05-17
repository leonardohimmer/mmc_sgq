import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)
    const allowedRoles = ["ADMIN", "DIRETOR", "QUALIDADE"]

    if (!session?.user || (!allowedRoles.includes(session.user.role) && session.user.role !== "DESENVOLVEDOR")) {
        return NextResponse.json({ error: "Acesso negado. Apenas Diretor e Qualidade podem ver logs." }, { status: 403 })
    }

    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, role: true }
            }
        },
        take: 100 // Limite de 100 logs recentes para performance
    })

    return NextResponse.json(logs)
}
