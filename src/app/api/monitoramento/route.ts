import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST - Registrar um novo clique
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { path, selector, elementTag, elementText, x, y, viewWidth } = body

        if (!path) {
            return NextResponse.json({ error: "Caminho é obrigatório" }, { status: 400 })
        }

        const click = await prisma.clickLog.create({
            data: {
                path,
                selector,
                elementTag,
                elementText,
                x: x ? parseFloat(x) : null,
                y: y ? parseFloat(y) : null,
                viewWidth: viewWidth ? parseInt(viewWidth) : null,
            }
        })

        return NextResponse.json(click)
    } catch (error) {
        console.error("Erro ao registrar clique:", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}

// GET - Buscar dados de monitoramento
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const days = parseInt(searchParams.get("days") || "7")
        
        const dateLimit = new Date()
        dateLimit.setDate(dateLimit.getDate() - days)

        // Buscar todos os cliques no período
        const clicks = await prisma.clickLog.findMany({
            where: {
                createdAt: { gte: dateLimit }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Agrupar por seletor/texto para o "termômetro"
        const stats = await prisma.clickLog.groupBy({
            by: ['path', 'elementText', 'elementTag', 'selector'],
            _count: {
                _all: true
            },
            where: {
                createdAt: { gte: dateLimit },
                elementText: { not: null }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 50
        })

        // Agrupar por path para o termômetro de páginas
        const pathStats = await prisma.clickLog.groupBy({
            by: ['path'],
            _count: {
                _all: true
            },
            where: {
                createdAt: { gte: dateLimit }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        })

        return NextResponse.json({ clicks, stats, pathStats })
    } catch (error) {
        console.error("Erro ao buscar monitoramento:", error)
        return NextResponse.json({ error: "Erro interno" }, { status: 500 })
    }
}
