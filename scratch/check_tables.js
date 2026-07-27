const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRaw`
    SELECT table_name, 
           (xpath('/row/c/text()', xmlparse(document query_to_xml(format('select count(*) as c from %I', table_name), false, true, ''))))[1]::text::int AS row_count
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY row_count DESC;
  `;
  console.log("=== TABELAS E SEUS REGISTROS ===");
  console.log(JSON.stringify(tables, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
