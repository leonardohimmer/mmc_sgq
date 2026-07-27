const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "leonardohv@edu.unisinos.br";
  console.log(`Searching for user with email: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email }
  });
  console.log("User:", JSON.stringify(user, null, 2));

  console.log(`\nSearching for budget with email: ${email}`);
  const orcamento = await prisma.orcamento.findFirst({
    where: { email }
  });
  console.log("Budget:", JSON.stringify(orcamento, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
