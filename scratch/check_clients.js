const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const clients = await prisma.siteContent.findUnique({
        where: { section: 'clients' }
    });
    if (clients && clients.data && clients.data.items) {
        console.log("CLIENTS:");
        clients.data.items.forEach(c => {
            console.log(`Name: "${c.name}", HasLogo: ${!!c.logoUrl}, Link: "${c.link || ''}"`);
        });
    } else {
        console.log("No clients found in db");
    }
}

main().finally(() => prisma.$disconnect());
