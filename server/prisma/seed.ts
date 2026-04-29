import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      id: "1",
      email: "demo@example.com",
      name: "Demo User",
      googleId: null,
    },
  });

  console.log("Demo user created/updated:", demoUser);

  // Create sample categories
  const categories = [
    { name: "Housing", userId: demoUser.id },
    { name: "Food", userId: demoUser.id },
    { name: "Transport", userId: demoUser.id },
    { name: "Utilities", userId: demoUser.id },
    { name: "Coffee", userId: demoUser.id },
    { name: "Entertainment", userId: demoUser.id },
    { name: "Salary", userId: demoUser.id },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: `${demoUser.id}-${cat.name}` },
      update: {},
      create: {
        id: `${demoUser.id}-${cat.name}`,
        ...cat,
      },
    });
  }

  console.log("Categories created");

  // Create sample transactions
  const sampleTransactions = [
    {
      amount: 1200,
      description: "Monthly rent",
      type: "EXPENSE",
      categoryId: `${demoUser.id}-Housing`,
      userId: demoUser.id,
    },
    {
      amount: 150,
      description: "Groceries",
      type: "EXPENSE",
      categoryId: `${demoUser.id}-Food`,
      userId: demoUser.id,
    },
    {
      amount: 50,
      description: "Gas",
      type: "EXPENSE",
      categoryId: `${demoUser.id}-Transport`,
      userId: demoUser.id,
    },
    {
      amount: 3000,
      description: "Monthly salary",
      type: "INCOME",
      categoryId: `${demoUser.id}-Salary`,
      userId: demoUser.id,
    },
  ];

  for (const trans of sampleTransactions) {
    await prisma.transaction.create({
      data: {
        ...trans,
        id: `${demoUser.id}-${Date.now()}-${Math.random()}`,
      },
    });
  }

  console.log("Sample transactions created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
