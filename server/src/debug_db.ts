import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users.map(u => ({ id: u.id, email: u.email })));
  
  const categories = await prisma.category.findMany();
  console.log('Total Categories:', categories.length);
  console.log('Categories:', categories);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
