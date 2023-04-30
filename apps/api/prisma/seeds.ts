import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        username: "user1",
        password: "password1",
        account: {
          create: {
            balance: 1,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: "user2",
        password: "password2",
        account: {
          create: {
            balance: 500,
          },
        },
      },
    }),
  ]);

  // Cria uma transação entre as duas contas
  const transaction = await prisma.transaction.create({
    data: {
      debitedAccountId: user1.accountId,
      creditedAccountId: user2.accountId,
      value: 500,
    },
  });

  console.log(`Seed data created:
    Transaction: ${transaction.value} transferred from account ${transaction.debitedAccountId} to account ${transaction.creditedAccountId}
    `);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
