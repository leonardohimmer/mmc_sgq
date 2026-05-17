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
            orcamentosCount,
            propostasCount,
            agendamentoCount,
            execucaoCount,
            elaboracaoCount,
            envioRelatorioCount,
            cobrancaCount,
            pagamentoCount,
            pesquisaCount,
            finalizadoCount
        ] = await Promise.all([
            prisma.profile.findMany({
                where: { name: { in: roles } },
                select: { permissions: true }
            }),
            prisma.orcamento.count({ where: { status: { in: ['NOVO', 'VISUALIZADO', 'EM_CONTATO'] } } }).then(count => 
                prisma.testRequest.count({ where: { status: 'RECEBIDO' } }).then(reqCount => count + reqCount)
            ),
            prisma.testRequest.count({ where: { status: 'AGUARDANDO_ACEITE' } }),
            prisma.testRequest.count({ where: { status: 'AGUARDANDO_AGENDAMENTO' } }),
            prisma.testRequest.count({ where: { status: 'EM_EXECUCAO' } }),
            prisma.testRequest.count({ where: { status: 'ELABORANDO_RELATORIO' } }),
            prisma.testRequest.count({ where: { status: 'AGUARDANDO_APROVACAO' } }),
            prisma.testRequest.count({ where: { status: 'COBRANCA' } }),
            prisma.testRequest.count({ where: { status: 'PAGAMENTO' } }),
            prisma.testRequest.count({ where: { status: 'PESQUISA_PENDENTE' } }),
            prisma.testRequest.count({ where: { status: 'FINALIZADO' } })
        ])

        const permissions = Array.from(new Set([
            ...profiles.flatMap(p => p.permissions), 
            ...(user.permissions || [])
        ]))

        const counts = {
            orcamentos: orcamentosCount,
            propostas: propostasCount,
            agendamento: agendamentoCount,
            execucao: execucaoCount,
            elaboracao: elaboracaoCount,
            envioRelatorio: envioRelatorioCount,
            cobranca: cobrancaCount,
            pagamento: pagamentoCount,
            pesquisa: pesquisaCount,
            finalizado: finalizadoCount
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
