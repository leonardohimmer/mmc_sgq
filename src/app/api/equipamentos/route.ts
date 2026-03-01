import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Acesso negado" }, { status: 403 })

    // Auto-bloqueio de equipamentos vencidos
    const now = new Date()

    await prisma.equipment.updateMany({
        where: {
            status: "ATIVO",
            nextCalibrationDate: {
                lt: now
            }
        },
        data: {
            status: "VENCIDO"
        }
    })

    const equipamentos = await prisma.equipment.findMany({
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(equipamentos)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    const allowedRoles = ["ADMIN", "DIREÇÃO", "QUALIDADE", "RESPONSÁVEL TÉCNICO"]

    if (!session?.user || !allowedRoles.includes(session.user.role)) {
        return NextResponse.json({ error: "Acesso negado. Perfil sem permissão para criar equipamentos." }, { status: 403 })
    }

    try {
        const data = await req.json()
        const equipment = await prisma.equipment.create({
            data: {
                code: data.code,
                name: data.name,
                manufacturer: data.manufacturer,
                status: data.status || "ATIVO",
                lastCalibrationDate: data.lastCalibrationDate ? new Date(data.lastCalibrationDate) : null,
                nextCalibrationDate: data.nextCalibrationDate ? new Date(data.nextCalibrationDate) : null,
                calibrationInterval: data.calibrationInterval ? parseInt(data.calibrationInterval) : null,
            }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "CREATE",
                entity: "Equipment",
                entityId: equipment.id,
                details: JSON.stringify({ code: equipment.code, name: equipment.name })
            }
        })

        return NextResponse.json(equipment)
    } catch (e: any) {
        return NextResponse.json({ error: "Erro ao criar equipamento: " + e.message }, { status: 400 })
    }
}
