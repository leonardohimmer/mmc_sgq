const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== ÚLTIMOS ORÇAMENTOS ===");
  const orcamentos = await prisma.orcamento.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(orcamentos, null, 2));

  console.log("\n=== ÚLTIMOS USUÁRIOS ===");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  console.log(JSON.stringify(users, null, 2));

  console.log("\n=== ÚLTIMOS LOGS DE AUDITORIA ===");
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(auditLogs, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
