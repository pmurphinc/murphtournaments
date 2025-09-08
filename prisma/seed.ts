import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function main() {
  // Hosts / Users
  const [jacob, megatron, trav, murph] = await Promise.all([
    prisma.user.upsert({ where: { discordId: "jacob#host" },    update: {}, create: { discordId: "jacob#host",    displayName: "Jacob" } }),
    prisma.user.upsert({ where: { discordId: "megatron#host" }, update: {}, create: { discordId: "megatron#host", displayName: "Megatron" } }),
    prisma.user.upsert({ where: { discordId: "trav#host" },     update: {}, create: { discordId: "trav#host",     displayName: "Trav" } }),
    prisma.user.upsert({ where: { discordId: "murph#host" },    update: {}, create: { discordId: "murph#host",    displayName: "Murph" } }),
  ]);

  // Tournament
  const t = await prisma.tournament.create({
    data: {
      title: "September Showdown",
      startsAt: new Date(),
      status: "ANNOUNCED",
      format: "DE-BO1",
      notes: "Seed data",
    },
  });

  // Teams (global)
  const teamDog = await prisma.team.create({
    data: { name: "Team Dog", slug: slugify("Team Dog"), owner: { connect: { id: murph.id } } },
  });
  const teamFAFO = await prisma.team.create({
    data: { name: "Team FAFO", slug: slugify("Team FAFO"), owner: { connect: { id: murph.id } } },
  });

  // Tournament Entries (per-event snapshot + roster)
  const entryDog = await prisma.tournamentEntry.create({
    data: {
      tournamentId: t.id,
      teamId: teamDog.id,
      displayName: "Team Dog",
      captainUserId: murph.id,
      members: {
        create: [
          { userId: murph.id,     embarkId: "embark-001", platform: "PC", region: "NA", role: "PLAYER" },
          { userId: jacob.id,     embarkId: "embark-002", platform: "PC", region: "NA", role: "PLAYER" },
          { userId: megatron.id,  embarkId: "embark-003", platform: "PC", region: "NA", role: "PLAYER" },
        ],
      },
    },
  });

  const entryFAFO = await prisma.tournamentEntry.create({
    data: {
      tournamentId: t.id,
      teamId: teamFAFO.id,
      displayName: "Team FAFO",
      captainUserId: trav.id,
      members: {
        create: [
          { userId: trav.id,      embarkId: "embark-101", platform: "PC", region: "NA", role: "PLAYER" },
          { userId: jacob.id,     embarkId: "embark-102", platform: "PC", region: "NA", role: "PLAYER" },
          { userId: megatron.id,  embarkId: "embark-103", platform: "PC", region: "NA", role: "PLAYER" },
        ],
      },
    },
  });

  // One match
  await prisma.match.create({
    data: {
      tournamentId: t.id,
      round: 1,
      bestOf: 1,
      status: "SCHEDULED",
      teamAEntryId: entryDog.id,
      teamBEntryId: entryFAFO.id,
    },
  });

  await prisma.match.create({
    data: {
      tournamentId: t.id,
      round: 2,
      bestOf: 1,
      status: "SCHEDULED",
      teamAEntryId: entryFAFO.id,
      teamBEntryId: entryDog.id,
    },
  });

  console.log("Seed complete:", { users: 4, tournamentTitle: t.title, tournamentId: t.id });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });