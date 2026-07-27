const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- BUSCANDO PROPOSTAS NO BANCO DE DADOS ---");
    const requests = await prisma.testRequest.findMany({
        select: {
            id: true,
            type: true,
            clientName: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            proposalCode: true
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Total de solicitações/propostas encontradas: ${requests.length}`);
    console.log(JSON.stringify(requests, null, 2));

    const awaitingAcceptance = requests.filter(r => r.status === 'AGUARDANDO_ACEITE');
    console.log(`Propostas aguardando aceite para limpar: ${awaitingAcceptance.length}`);

    if (awaitingAcceptance.length > 0) {
        const idsToDelete = awaitingAcceptance.map(r => r.id);
        
        // 1. Deletar históricos associados
        await prisma.testRequestHistory.deleteMany({
            where: { requestId: { in: idsToDelete } }
        });

        // 2. Deletar pesquisas de satisfação associadas
        await prisma.satisfactionSurvey.deleteMany({
            where: { requestId: { in: idsToDelete } }
        });

        // 3. Deletar solicitações
        const deleted = await prisma.testRequest.deleteMany({
            where: { id: { in: idsToDelete } }
        });

        console.log(`✅ Sucesso! Deletadas ${deleted.count} propostas antigas em status 'AGUARDANDO_ACEITE'.`);
    } else {
        console.log("Nenhuma proposta com status 'AGUARDANDO_ACEITE' para remover.");
    }
}

main()
    .catch(err => {
        console.error("Erro ao limpar propostas:", err);
    })
    .finally(() => prisma.$disconnect());
