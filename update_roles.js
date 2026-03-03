const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Atualizando roles dos usuários...');
        const updatedUsersRoleDev = await prisma.user.updateMany({
            where: { role: 'CONTROLADOR' },
            data: { role: 'DESENVOLVEDOR' }
        });
        console.log(`Usuários atualizados para DESENVOLVEDOR: ${updatedUsersRoleDev.count}`);

        const updatedUsersRoleAuditor = await prisma.user.updateMany({
            where: { role: 'AUDITOR INTERNO' },
            data: { role: 'AUDITOR' }
        });
        console.log(`Usuários atualizados para AUDITOR: ${updatedUsersRoleAuditor.count}`);

        console.log('Atualizando nomes dos perfis...');
        const updatedProfileDev = await prisma.profile.updateMany({
            where: { name: 'CONTROLADOR' },
            data: { name: 'DESENVOLVEDOR' }
        });
        console.log(`Perfis atualizados para DESENVOLVEDOR: ${updatedProfileDev.count}`);

        const updatedProfileAuditor = await prisma.profile.updateMany({
            where: { name: 'AUDITOR INTERNO' },
            data: { name: 'AUDITOR' }
        });
        console.log(`Perfis atualizados para AUDITOR: ${updatedProfileAuditor.count}`);

        console.log('Migração de nomenclatura concluída com sucesso!');
    } catch (error) {
        console.error('Erro na migração:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
