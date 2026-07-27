const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== ÚLTIMOS ORÇAMENTOS ===");
  const orcamentos = await prisma.orcamento.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  orcamentos.forEach(o => {
    console.log(`ID: ${o.id}`);
    console.log(`Nome: ${o.nomeContratante || o.nomeCompleto}`);
    console.log(`Email: ${o.email}`);
    console.log(`Telefone: ${o.telefone}`);
    console.log(`Status: ${o.status}`);
    console.log(`Criado em: ${o.createdAt}`);
    console.log("------------------------");
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
