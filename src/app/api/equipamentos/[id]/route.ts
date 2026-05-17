import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)
    const allowedRoles = ["ADMIN", "DIRETOR", "QUALIDADE", "RESPONSÁVEL TÉCNICO", "TÉCNICO DE LABORATÓRIO", "DESENVOLVEDOR"]
    const userRoles = (session?.user?.role || "").split(",").map(r => r.trim())
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role))

    if (!session?.user || !isAuthorized) {
        return NextResponse.json({ error: `Acesso negado. Seu perfil (${session?.user?.role || 'N/D'}) não tem permissão para esta ação.` }, { status: 403 })
    }

    try {
        const data = await req.json()

        let updateData: any = {}
        const fields = [
            'code', 'name', 'manufacturer', 'model', 'serialNumber', 
            'range', 'testType', 'location', 'lab', 'certificateNumber', 
            'serviceType', 'acceptance', 'notes', 'status', 'monitoringData'
        ]

        fields.forEach(field => {
            if (data[field] !== undefined) updateData[field] = data[field]
        })

        if (data.calibrationValue !== undefined) {
            updateData.calibrationValue = Array.isArray(data.calibrationValue)
                ? data.calibrationValue.map((v: any) => parseFloat(v)).filter((v: any) => !isNaN(v))
                : (data.calibrationValue ? [parseFloat(data.calibrationValue)] : [])
        }
        if (data.calibrationInterval !== undefined) updateData.calibrationInterval = data.calibrationInterval ? parseInt(data.calibrationInterval) : null
        if (data.lastCalibrationDate) updateData.lastCalibrationDate = new Date(data.lastCalibrationDate)
        if (data.nextCalibrationDate) updateData.nextCalibrationDate = new Date(data.nextCalibrationDate)

        const equipment = await prisma.equipment.update({
            where: { id: params.id },
            data: updateData
        })

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "UPDATE",
                entity: "Equipment",
                entityId: equipment.id,
                details: JSON.stringify(updateData)
            }
        })

        return NextResponse.json(equipment)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)
    const allowedRoles = ["ADMIN", "DIRETOR", "QUALIDADE", "RESPONSÁVEL TÉCNICO", "DESENVOLVEDOR"]
    const userRoles = (session?.user?.role || "").split(",").map(r => r.trim())
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role))

    if (!session?.user || !isAuthorized) {
        return NextResponse.json({ error: `Acesso negado. Seu perfil (${session?.user?.role || 'N/D'}) não tem permissão para esta ação.` }, { status: 403 })
    }

    try {
        await prisma.equipment.delete({
            where: { id: params.id }
        })

        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                action: "DELETE",
                entity: "Equipment",
                entityId: params.id,
                details: "Equipamento removido do sistema"
            }
        })

        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}
