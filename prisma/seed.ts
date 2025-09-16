import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function main() {
  // Hosts / Users
  // Create users (example, update as needed for new schema)
  const jacob = await prisma.user.create({ data: { discordId: "jacob#host" } });
  const megatron = await prisma.user.create({ data: { discordId: "megatron#host" } });
  const trav = await prisma.user.create({ data: { discordId: "trav#host" } });
  const murph = await prisma.user.create({ data: { discordId: "murph#host" } });

  // Tournament
  const t = await prisma.tournament.create({
    data: {
      name: "September Showdown",
      startAt: new Date(),
      status: "REG_OPEN",
    },
  });

  // Teams (global)
  const teamDog = await prisma.team.create({
    data: { name: "Team Dog", leaderId: murph.id, tournamentId: t.id },
  });
  const teamFAFO = await prisma.team.create({
    data: { name: "Team FAFO", leaderId: murph.id, tournamentId: t.id },
  });



  console.log("Seed complete:", { users: 4, tournamentName: t.name, tournamentId: t.id });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });