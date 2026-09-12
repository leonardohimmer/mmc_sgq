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
        const type = searchParams.get('type') // 'report', 'proposal', 'invoice', 'acceptance_proof', 'proof'
        const itemId = searchParams.get('itemId')
        const invoiceId = searchParams.get('invoiceId')

        if (!type || !['report', 'proposal', 'invoice', 'acceptance_proof', 'proof'].includes(type)) {
            return new Response('Tipo de arquivo inválido', { status: 400 })
        }

        let fileUrl: string | null = null
        let docNumber: string | null = null

        if (type === 'report') {
            // 1. Tenta buscar no item específico se itemId foi fornecido
            if (itemId) {
                const item = await prisma.testExecutionItem.findFirst({
                    where: { id: itemId, requestId: id },
                    select: { reportPdfUrl: true, reportNumber: true }
                })
                if (item?.reportPdfUrl) {
                    fileUrl = item.reportPdfUrl
                    docNumber = item.reportNumber
                }
            }

            // 2. Se não achou no item, busca no TestRequest principal
            if (!fileUrl) {
                const req = await prisma.testRequest.findUnique({
                    where: { id },
                    select: { reportPdfUrl: true, reportNumber: true }
                })
                if (req?.reportPdfUrl) {
                    fileUrl = req.reportPdfUrl
                    docNumber = req.reportNumber
                }
            }

            // 3. Fallback: se ainda não achou, busca no primeiro item com PDF
            if (!fileUrl) {
                const firstItem = await prisma.testExecutionItem.findFirst({
                    where: { requestId: id, reportPdfUrl: { not: null } },
                    select: { reportPdfUrl: true, reportNumber: true }
                })
                if (firstItem?.reportPdfUrl) {
                    fileUrl = firstItem.reportPdfUrl
                    docNumber = firstItem.reportNumber
                }
            }
        } else if (type === 'invoice') {
            // 1. Tenta buscar na PartialInvoice se invoiceId foi fornecido
            if (invoiceId) {
                const inv = await prisma.partialInvoice.findFirst({
                    where: { id: invoiceId, requestId: id },
                    select: { notaPdfUrl: true, numeroNf: true }
                })
                if (inv?.notaPdfUrl) {
                    fileUrl = inv.notaPdfUrl
                    docNumber = inv.numeroNf
                }
            }

            // 2. Se não achou na PartialInvoice, busca no TestRequest principal
            if (!fileUrl) {
                const req = await prisma.testRequest.findUnique({
                    where: { id },
                    select: { invoicePdfUrl: true, invoiceNumber: true }
                })
                if (req?.invoicePdfUrl) {
                    fileUrl = req.invoicePdfUrl
                    docNumber = req.invoiceNumber
                }
            }

            // 3. Fallback: se ainda não achou, busca na primeira PartialInvoice com PDF
            if (!fileUrl) {
                const firstInv = await prisma.partialInvoice.findFirst({
                    where: { requestId: id, notaPdfUrl: { not: null } },
                    select: { notaPdfUrl: true, numeroNf: true }
                })
                if (firstInv?.notaPdfUrl) {
                    fileUrl = firstInv.notaPdfUrl
                    docNumber = firstInv.numeroNf
                }
            }
        } else if (type === 'proposal') {
            const req = await prisma.testRequest.findUnique({
                where: { id },
                select: { proposalPdfUrl: true, proposalCode: true }
            })
            fileUrl = req?.proposalPdfUrl || null
            docNumber = req?.proposalCode || null
        } else {
            // acceptance_proof ou proof
            const req = await prisma.testRequest.findUnique({
                where: { id },
                select: { acceptanceProofUrl: true }
            })
            fileUrl = req?.acceptanceProofUrl || null
        }

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
                        ? `Relatorio-${docNumber || id}.pdf`
                        : type === 'proposal' 
                            ? `Proposta-${docNumber || id}.pdf`
                            : `Nota-Fiscal-${docNumber || id}.pdf`

                return new Response(fileBuffer, {
                    headers: {
                        'Content-Type': contentType,
                        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
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
