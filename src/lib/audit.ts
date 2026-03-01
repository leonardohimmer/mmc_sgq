import prisma from "@/lib/prisma"

export async function logAction(userId: string, action: string, entity: string, entityId: string, details: any, ipAddress?: string) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                details: JSON.stringify(details),
                ipAddress: ipAddress || "0.0.0.0",
            },
        })
    } catch (error) {
        console.error("Erro ao registrar log de auditoria:", error)
    }
}
