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
        const type = searchParams.get('type') // 'report', 'proposal', 'invoice', 'acceptance_proof'

        if (!type || !['report', 'proposal', 'invoice', 'acceptance_proof', 'proof'].includes(type)) {
            return new Response('Tipo de arquivo inválido', { status: 400 })
        }

        // Busca apenas o campo específico do banco
        const fieldName = (type === 'acceptance_proof' || type === 'proof') 
            ? 'acceptanceProofUrl' 
            : type === 'report' 
                ? 'reportPdfUrl' 
                : type === 'proposal' 
                    ? 'proposalPdfUrl' 
                    : 'invoicePdfUrl'

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

        const fileUrl = (req as any)[fieldName]
        if (!fileUrl) {
            return new Response('Arquivo não encontrado', { status: 404 })
        }

        // Se for um DataURL Base64 (ex: data:application/pdf;base64,... ou data:image/png;base64,...)
        if (fileUrl.startsWith('data:')) {
            const commaIndex = fileUrl.indexOf(',')
            if (commaIndex !== -1) {
                const header = fileUrl.substring(0, commaIndex)
                const contentTypeMatch = header.match(/data:(.*?);base64/)
                const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/pdf'
                const ext = contentType.includes('png') ? 'png' : contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'pdf'

                const base64Data = fileUrl.substring(commaIndex + 1)
                const fileBuffer = Buffer.from(base64Data, 'base64')
                
                const filename = (type === 'acceptance_proof' || type === 'proof')
                    ? `Comprovante-Aceite-${id}.${ext}`
                    : type === 'report' 
                        ? `Relatorio-${req.reportNumber || id}.pdf`
                        : type === 'proposal' 
                            ? `Proposta-${id}.pdf`
                            : `Fatura-${id}.pdf`

                return new Response(fileBuffer, {
                    headers: {
                        'Content-Type': contentType,
                        'Content-Disposition': `inline; filename="${filename}"`,
                    }
                })
            }
        }

        // Se for uma URL externa direta
        return NextResponse.redirect(new URL(fileUrl, request.url))
    } catch (error) {
        console.error('Erro ao buscar PDF:', error)
        return new Response('Erro interno do servidor', { status: 500 })
    }
}
