import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return new Response('Não autorizado', { status: 401 })
        }

        const { id } = await params
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // 'report', 'proposal', 'invoice'

        if (!type || !['report', 'proposal', 'invoice'].includes(type)) {
            return new Response('Tipo de PDF inválido', { status: 400 })
        }

        // Busca apenas o campo específico do PDF do banco
        const fieldName = type === 'report' ? 'reportPdfUrl' : type === 'proposal' ? 'proposalPdfUrl' : 'invoicePdfUrl'
        const req = await prisma.testRequest.findUnique({
            where: { id },
            select: {
                [fieldName]: true,
                reportNumber: true
            }
        })

        if (!req) {
            return new Response('Solicitação não encontrada', { status: 404 })
        }

        const pdfUrl = (req as any)[fieldName]
        if (!pdfUrl) {
            return new Response('PDF não encontrado', { status: 404 })
        }

        // Se for um DataURL Base64 (começa com data:application/pdf;base64,)
        if (pdfUrl.startsWith('data:')) {
            const commaIndex = pdfUrl.indexOf(',')
            if (commaIndex !== -1) {
                const base64Data = pdfUrl.substring(commaIndex + 1)
                const pdfBuffer = Buffer.from(base64Data, 'base64')
                
                const filename = type === 'report' 
                    ? `Relatorio-${req.reportNumber || id}.pdf`
                    : type === 'proposal' 
                        ? `Proposta-${id}.pdf`
                        : `Fatura-${id}.pdf`

                return new Response(pdfBuffer, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `inline; filename="${filename}"`,
                    }
                })
            }
        }

        // Se for uma URL externa direta
        return NextResponse.redirect(new URL(pdfUrl, request.url))
    } catch (error) {
        console.error('Erro ao buscar PDF:', error)
        return new Response('Erro interno do servidor', { status: 500 })
    }
}
