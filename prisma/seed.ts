import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const hosts = await Promise.all([
    prisma.user.upsert({ where: { discordId: "jacob#host" }, update: {}, create: { discordId: "jacob#host", email: "jacob@example.com", role: "STAFF" } }),
    prisma.user.upsert({ where: { discordId: "megatron#host" }, update: {}, create: { discordId: "megatron#host", email: "megatron@example.com", role: "STAFF" } }),
    prisma.user.upsert({ where: { discordId: "trav#host" }, update: {}, create: { discordId: "trav#host", email: "trav@example.com", role: "STAFF" } }),
    prisma.user.upsert({ where: { discordId: "murph#host" }, update: {}, create: { discordId: "murph#host", email: "murph@example.com", role: "ADMIN" } })
  ]);
  const t = await prisma.tournament.upsert({
    where: { slug: "september-showdown" },
    update: {},
    create: {
      name: "September Showdown",
      slug: "september-showdown",
      status: "REGISTRATION",
      startsAt: new Date(Date.now() + 1000*60*60*24),
      checkInOpensAt: new Date(Date.now() + 1000*60*60*23),
      rosterLockAt: new Date(Date.now() + 1000*60*60*22),
      rules: "Be nice. Follow THE FINALS tournament rules.",
      maxTeams: 16
    }
  });
  const cap = hosts[3];
  await prisma.team.create({
    data: {
      name: "Team Dog",
      tournamentId: t.id,
      captainId: cap.id,
      approved: true,
      members: {
        create: [
          { displayName: "nuufle", embarkId: "embark-001" },
          { displayName: "junlym", embarkId: "embark-002" },
          { displayName: "bongo", embarkId: "embark-003" },
          { displayName: "spare", embarkId: "embark-004", isSub: true }
        ]
      }
    }
  });
  await prisma.team.create({
    data: {
      name: "FAFO",
      tournamentId: t.id,
      captainId: cap.id,
      approved: false,
      members: { create: [
        { displayName: "mojoflojo", embarkId: "embark-101" },
        { displayName: "jon", embarkId: "embark-102" },
        { displayName: "blazing", embarkId: "embark-103" }
      ] }
    }
  });
  await prisma.match.createMany({ data: [
    { tournamentId: t.id, round: 1, bestOf: 1, status: "PENDING" },
    { tournamentId: t.id, round: 1, bestOf: 1, status: "PENDING" },
    { tournamentId: t.id, round: 2, bestOf: 1, status: "PENDING" }
  ]});
  await prisma.question.create({
    data: { authorId: cap.id, tournamentId: t.id, title: "Is BO1 for finals?", body: "Are we doing single BO1 for the final round like the $100k Major?", tags: ["Format","Rules"] }
  });
  console.log("Seed complete:", { hosts: hosts.length, tournament: t.slug });
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());