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
    const allowedRoles = ["ADMIN", "DIRETOR", "QUALIDADE", "RESPONSÁVEL TÉCNICO", "DESENVOLVEDOR"]
    const userRoles = (session?.user?.role || "").split(",").map(r => r.trim())
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role))

    if (!session?.user || !isAuthorized) {
        return NextResponse.json({ 
            error: `Acesso negado. Seu perfil (${session?.user?.role || 'N/D'}) não tem permissão para criar equipamentos.` 
        }, { status: 403 })
    }

    try {
        const data = await req.json()
        const equipment = await prisma.equipment.create({
            data: {
                code: data.code,
                name: data.name,
                manufacturer: data.manufacturer,
                model: data.model,
                serialNumber: data.serialNumber,
                range: data.range,
                testType: data.testType,
                location: data.location,
                lab: data.lab,
                certificateNumber: data.certificateNumber,
                serviceType: data.serviceType,
                calibrationValue: Array.isArray(data.calibrationValue) 
                    ? data.calibrationValue.map((v: any) => parseFloat(v)).filter((v: any) => !isNaN(v))
                    : (data.calibrationValue ? [parseFloat(data.calibrationValue)] : []),
                status: data.status || "ATIVO",
                acceptance: data.acceptance || "Aprovado",
                lastCalibrationDate: data.lastCalibrationDate ? new Date(data.lastCalibrationDate) : null,
                nextCalibrationDate: data.nextCalibrationDate ? new Date(data.nextCalibrationDate) : null,
                calibrationInterval: data.calibrationInterval ? parseInt(data.calibrationInterval) : null,
                notes: data.notes,
                monitoringData: data.monitoringData || null,
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
