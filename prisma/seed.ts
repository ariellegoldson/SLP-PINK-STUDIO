import { PrismaClient } from '@prisma/client';
import { GOAL_BANK } from './goal_bank';

const prisma = new PrismaClient();

async function main() {
  for (const [areaName, goals] of Object.entries(GOAL_BANK)) {
    await prisma.targetArea.create({
      data: {
        name: areaName,
        goals: {
          create: goals.map((description) => ({ description })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    console.log('Seeding completed');
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
