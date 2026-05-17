import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST - Receber novo orçamento do site público (sem autenticação)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { 
            nomeCompleto, 
            nomeContratante,
            nomeConstrutora,
            nomeObra,
            email, 
            telefone, 
            rua,
            numero,
            bairro,
            cidade,
            estado, 
            cep,
            enderecoCompleto,
            emailsProposta,
            emailProposta,
            emailsRelatorio,
            tipoEnsaio,
            servicoDesejado, 
            quantidadeEnsaios,
            datasDesejadas,
            mensagem,
            observacoes
        } = body

        // Validação mínima - aceitando variações de nomes de campos
        const finalNome = nomeContratante || nomeCompleto
        const finalEmail = email || (typeof emailProposta === 'string' ? emailProposta.split(',')[0] : null)
        const finalTelefone = telefone

        if (!finalNome || !finalEmail || !finalTelefone || !quantidadeEnsaios) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
        }

        // Processar emails para garantir que sejam arrays
        const processEmails = (val: any) => {
            if (Array.isArray(val)) return val.filter(e => e && e.trim() !== "")
            if (typeof val === 'string') return val.split(',').map(e => e.trim()).filter(e => e !== "")
            return []
        }

        const orcamento = await prisma.orcamento.create({
            data: {
                nomeCompleto: finalNome || "Cliente do Site",
                nomeContratante: nomeContratante || finalNome || null,
                nomeConstrutora: nomeConstrutora || null,
                nomeObra: nomeObra || null,
                email: finalEmail || "nao-informado@mmclab.com.br",
                telefone: finalTelefone || "Não informado",
                rua: rua || null,
                numero: numero || null,
                bairro: bairro || null,
                cidade: cidade || null,
                estado: estado || null,
                cep: cep || null,
                enderecoCompleto: enderecoCompleto || null,
                emailsProposta: processEmails(emailsProposta || emailProposta),
                emailsRelatorio: processEmails(emailsRelatorio),
                servicoDesejado: tipoEnsaio || servicoDesejado || null,
                quantidadeEnsaios: quantidadeEnsaios || null,
                datasDesejadas: datasDesejadas || null,
                mensagem: observacoes || mensagem || null,
                status: "NOVO",
            },
        })

        console.log("Orçamento criado com sucesso:", orcamento.id)
        return NextResponse.json({ success: true, id: orcamento.id }, { status: 201 })
    } catch (error: any) {
        console.error("Erro ao salvar orçamento:", error)
        return NextResponse.json({ 
            error: "Erro interno do servidor", 
            details: error.message 
        }, { status: 500 })
    }
}

// GET - Listar orçamentos (apenas para colaboradores autenticados)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const skip = (page - 1) * limit

        const where = status ? { status } : {}

        const [orcamentos, total] = await Promise.all([
            prisma.orcamento.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.orcamento.count({ where }),
        ])

        return NextResponse.json({ orcamentos, total, page, pages: Math.ceil(total / limit) })
    } catch (error) {
        console.error("Erro ao listar orçamentos:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
