import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureExecutionItemsCreated } from "@/lib/os-balance-service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, user, qtdAExecutar } = body;

        if (!requestId) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const requestData = await prisma.testRequest.findUnique({
            where: { id: requestId },
            include: { executionItems: { orderBy: { numeroSequencial: 'asc' } } }
        });

        if (!requestData) {
            return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
        }

        // Garante que os itens de execução existam
        const items = await ensureExecutionItemsCreated(requestId, requestData.quantidadeEnsaios);

        // Filtra os itens pendentes que ainda não foram concluídos/entregues
        const pendingItems = items.filter(i => 
            i.statusExecucao !== 'CONCLUIDO' && 
            i.statusExecucao !== 'APROVADO' && 
            i.statusEntrega !== 'ENVIADO_AO_CLIENTE'
        );

        // Quantidade a colocar em execução nesta visita
        const targetQtd = qtdAExecutar ? Math.min(Math.max(1, parseInt(String(qtdAExecutar))), pendingItems.length) : pendingItems.length;

        // Os primeiros targetQtd itens pendentes ficam com statusExecucao = 'EM_EXECUCAO'
        const itemsToSetInExecution = pendingItems.slice(0, targetQtd);
        const itemIdsToSet = itemsToSetInExecution.map(i => i.id);

        if (itemIdsToSet.length > 0) {
            await prisma.testExecutionItem.updateMany({
                where: { id: { in: itemIdsToSet } },
                data: { statusExecucao: 'EM_EXECUCAO' }
            });
        }

        // Os demais itens pendentes (se houver) mantêm statusExecucao = 'PENDENTE'
        const itemIdsToKeepPending = pendingItems.filter(i => !itemIdsToSet.includes(i.id)).map(i => i.id);
        if (itemIdsToKeepPending.length > 0) {
            await prisma.testExecutionItem.updateMany({
                where: { id: { in: itemIdsToKeepPending } },
                data: { statusExecucao: 'PENDENTE' }
            });
        }

        const updatedRequest = await prisma.testRequest.update({
            where: { id: requestId },
            data: {
                status: "EM_EXECUCAO",
                step: 4,
            }
        });

        await prisma.testRequestHistory.create({
            data: {
                requestId: updatedRequest.id,
                changedBy: user || "Sistema",
                oldStatus: "AGUARDANDO_AGENDAMENTO",
                newStatus: "EM_EXECUCAO"
            }
        });

        return NextResponse.json({ success: true, updatedRequest });
    } catch (error) {
        console.error("Erro ao avançar para execução:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

