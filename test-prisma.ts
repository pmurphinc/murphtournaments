import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const result = await prisma.tournament.findMany();
  console.log(result);
}

test();