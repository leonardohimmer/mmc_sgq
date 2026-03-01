import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions)
    const allowedRoles = ["ADMIN", "DIREÇÃO", "QUALIDADE", "RESPONSÁVEL TÉCNICO", "TÉCNICO DE LABORATÓRIO"]

    if (!session?.user || !allowedRoles.includes(session.user.role)) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    try {
        const data = await req.json()

        let updateData: any = {}
        if (data.status) updateData.status = data.status
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
