import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                role: true,
                permissions: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
        }

        const roles = (user.role || "").split(',').map(r => r.trim()).filter(Boolean)

        const [
            profiles,
            baseOrcamentosCount,
            testRequestCounts
        ] = await Promise.all([
            prisma.profile.findMany({
                where: { name: { in: roles } },
                select: { permissions: true }
            }),
            prisma.orcamento.count({ where: { status: { in: ['NOVO', 'VISUALIZADO', 'EM_CONTATO'] } } }),
            prisma.testRequest.groupBy({
                by: ['status'],
                _count: {
                    id: true
                }
            })
        ])

        const trStats = testRequestCounts.reduce((acc, curr) => {
            acc[curr.status] = curr._count.id;
            return acc;
        }, {} as Record<string, number>);

        const permissions = Array.from(new Set([
            ...profiles.flatMap(p => p.permissions), 
            ...(user.permissions || [])
        ]))

        const faturamentoCount = (trStats['COBRANCA'] || 0) + (trStats['PAGAMENTO'] || 0);

        const counts = {
            orcamentos: baseOrcamentosCount + (trStats['RECEBIDO'] || 0),
            propostas: (trStats['RECEBIDO'] || 0) + (trStats['AGUARDANDO_ACEITE'] || 0),
            agendamento: trStats['AGUARDANDO_AGENDAMENTO'] || 0,
            execucao: trStats['EM_EXECUCAO'] || 0,
            elaboracao: trStats['ELABORANDO_RELATORIO'] || 0,
            envioRelatorio: trStats['AGUARDANDO_APROVACAO'] || 0,
            faturamento: faturamentoCount,
            cobranca: trStats['COBRANCA'] || 0,
            pagamento: trStats['PAGAMENTO'] || 0,
            pesquisa: trStats['PESQUISA_PENDENTE'] || 0,
            finalizado: trStats['FINALIZADO'] || 0
        }

        return NextResponse.json({
            counts,
            permissions
        })
    } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
