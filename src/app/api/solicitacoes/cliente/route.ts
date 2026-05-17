import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        // Para fins do mock do portal do cliente, filtramos por nome ou devolvemos tudo
        const { searchParams } = new URL(request.url)
        const clientName = searchParams.get('clientName') || 'CLAUDIO SCHERER'

        const requests = await prisma.testRequest.findMany({
            where: {
                clientName: clientName
            },
            include: {
                satisfactionSurvey: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(requests)
    } catch (error) {
        console.error('Erro ao buscar solicitações para cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { 
            type, 
            location, 
            contractorName, 
            constructionCompany, 
            workName, 
            address, 
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            proposalEmail, 
            reportEmail, 
            desiredDate, 
            observations, 
            clientName,
            quantidadeEnsaios,
            email,
            telefone 
        } = body

        if (!type || !location || !desiredDate || !quantidadeEnsaios) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
        }

        let parsedDate = desiredDate;
        let finalObservations = observations || "";
        if (desiredDate && desiredDate.includes(",")) {
            const dateParts = desiredDate.split(",").map((d: string) => d.trim());
            parsedDate = dateParts[0];
            finalObservations += `\n\nDatas desejadas: ${desiredDate}`;
        }

        const processEmails = (val: any) => {
            if (Array.isArray(val)) return val.filter(e => e && e.trim() !== "")
            if (typeof val === 'string') return val.split(',').map(e => e.trim()).filter(e => e !== "")
            return []
        }

        const newRequest = await prisma.testRequest.create({
            data: {
                type,
                location,
                contractorName,
                constructionCompany,
                workName,
                address,
                rua: rua || null,
                numero: numero || null,
                bairro: bairro || null,
                cidade: cidade || null,
                estado: estado || null,
                cep: cep || null,
                proposalEmail,
                reportEmail,
                emailsProposta: processEmails(proposalEmail),
                emailsRelatorio: processEmails(reportEmail),
                desiredDate: new Date(parsedDate),
                datasDesejadas: desiredDate,
                observations: finalObservations.trim(),
                clientName: clientName || 'CLAUDIO SCHERER',
                clientPhone: telefone || null,
                clientEmail: email || null,
                quantidadeEnsaios: quantidadeEnsaios || null,
                status: 'RECEBIDO',
                step: 2
            }
        })

        // Add history for initial creation
        await prisma.testRequestHistory.create({
            data: {
                requestId: newRequest.id,
                changedBy: clientName || 'Cliente',
                oldStatus: 'CRIADO',
                newStatus: 'RECEBIDO'
            }
        })

        return NextResponse.json({ success: true, request: newRequest })
    } catch (error) {
        console.error('Erro ao criar solicitação de cliente:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
