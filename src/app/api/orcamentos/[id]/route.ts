import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendWelcomeEmail } from "@/lib/mail"

// PATCH - Atualizar status de um orçamento
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const { status, skipFlow } = body

        const allowed = ["NOVO", "VISUALIZADO", "EM_CONTATO", "FINALIZADO"]
        if (!allowed.includes(status)) {
            return NextResponse.json({ error: "Status inválido" }, { status: 400 })
        }

        // Se o status for alterado para EM_CONTATO ou FINALIZADO, garantimos o acesso do cliente (se não for arquivamento)
        if (!skipFlow && (status === "EM_CONTATO" || status === "FINALIZADO")) {
            const orcamento = await prisma.orcamento.findUnique({
                where: { id }
            })

            if (orcamento && orcamento.email) {
                // 1. Criar ou obter usuário
                let user = await prisma.user.findUnique({
                    where: { email: orcamento.email }
                })

                if (!user) {
                    // Criar senha a partir do telefone (apenas números)
                    const rawPassword = orcamento.telefone ? orcamento.telefone.replace(/\D/g, "") : "123456"
                    const hashedPassword = await bcrypt.hash(rawPassword, 10)

                    user = await prisma.user.create({
                        data: {
                            name: orcamento.nomeCompleto || orcamento.nomeContratante || "Cliente",
                            email: orcamento.email,
                            password: hashedPassword,
                            role: "CLIENTE",
                            company: orcamento.nomeEmpresa || orcamento.nomeConstrutora,
                            whatsapp: orcamento.telefone,
                        }
                    })
                    console.log(`Usuário criado automaticamente para o cliente: ${orcamento.email}`)
                }

                // Enviar e-mail de boas-vindas APENAS quando mudar para FINALIZADO e não for arquivamento
                if (status === "FINALIZADO" && orcamento.status !== "FINALIZADO" && user) {
                    await sendWelcomeEmail(user.email, user.name, orcamento.telefone || "")
                }

                // 2. Criar Solicitação de Ensaio (TestRequest) se não existir para este orçamento
                // Usamos as observações para marcar que veio deste orçamento e evitar duplicidade
                const marker = `[Ref: ${id}]`
                const existingRequest = await prisma.testRequest.findFirst({
                    where: {
                        observations: {
                            contains: marker
                        }
                    }
                })

                if (!existingRequest) {
                    await prisma.testRequest.create({
                        data: {
                            type: orcamento.servicoDesejado || "Ensaio solicitado via site",
                            location: orcamento.nomeObra || orcamento.cidade || "Local não informado",
                            contractorName: orcamento.nomeContratante || orcamento.nomeCompleto,
                            constructionCompany: orcamento.nomeConstrutora || orcamento.nomeEmpresa,
                            workName: orcamento.nomeObra,
                            address: orcamento.enderecoCompleto,
                            rua: orcamento.rua,
                            numero: orcamento.numero,
                            bairro: orcamento.bairro,
                            cidade: orcamento.cidade,
                            estado: orcamento.estado,
                            cep: orcamento.cep,
                            emailsProposta: orcamento.emailsProposta,
                            emailsRelatorio: orcamento.emailsRelatorio,
                            datasDesejadas: orcamento.datasDesejadas,
                            desiredDate: new Date(), // Data padrão para evitar erro de campo obrigatório
                            quantidadeEnsaios: orcamento.quantidadeEnsaios,
                            observations: `${marker}\nSolicitação original: ${orcamento.mensagem || "Sem mensagem"}`,
                            status: "RECEBIDO",
                            step: 2,
                            clientName: user.name,
                            clientEmail: user.email,
                            clientPhone: orcamento.telefone,
                        }
                    })
                    console.log(`Solicitação de ensaio criada para o orçamento: ${id}`)
                }
            }
        }

        const orcamento = await prisma.orcamento.update({
            where: { id },
            data: { status },
        })


        return NextResponse.json(orcamento)
    } catch (error) {
        console.error("Erro ao atualizar orçamento:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}

// DELETE - Remover orçamento
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.orcamento.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Erro ao deletar orçamento:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
