const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== ÚLTIMOS 10 USUÁRIOS CRIADOS ===");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  users.forEach(u => {
    console.log(`Nome: ${u.name}, Email: ${u.email}, Role: ${u.role}, Criado: ${u.createdAt}`);
  });

  console.log("\n=== ÚLTIMOS 10 ORÇAMENTOS ===");
  const orcamentos = await prisma.orcamento.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  orcamentos.forEach(o => {
    console.log(`Nome: ${o.nomeContratante || o.nomeCompleto}, Email: ${o.email}, Status: ${o.status}, Criado: ${o.createdAt}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
