import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const hosts = await Promise.all([
    prisma.user.upsert({ where: { discordId: "jacob#host" }, update: {}, create: { discordId: "jacob#host" } }),
    prisma.user.upsert({ where: { discordId: "megatron#host" }, update: {}, create: { discordId: "megatron#host" } }),
    prisma.user.upsert({ where: { discordId: "trav#host" }, update: {}, create: { discordId: "trav#host" } }),
    prisma.user.upsert({ where: { discordId: "murph#host" }, update: {}, create: { discordId: "murph#host" } })
  ]);
  const t = await prisma.tournament.create({
    data: {
      title: "September Showdown",
      status: "REGISTRATION",
      startsAt: new Date(Date.now() + 1000*60*60*24),
      rules: "Be nice. Follow THE FINALS tournament rules.",
      maxTeams: 16
    }
  });
  const cap = hosts[3];
  const teamDog = await prisma.team.create({
    data: {
      name: "Team Dog",
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
  const teamFAFO = await prisma.team.create({
    data: {
      name: "FAFO",
      members: { create: [
        { displayName: "mojoflojo", embarkId: "embark-101" },
        { displayName: "jon", embarkId: "embark-102" },
        { displayName: "blazing", embarkId: "embark-103" }
      ] }
    }
  });
  const entryDog = await prisma.tournamentEntry.create({
    data: {
      tournamentId: t.id,
      teamId: teamDog.id,
      displayName: teamDog.name,
      members: { connect: teamDog.members.map(m => ({ id: m.id })) }
    }
  });
  const entryFAFO = await prisma.tournamentEntry.create({
    data: {
      tournamentId: t.id,
      teamId: teamFAFO.id,
      displayName: teamFAFO.name,
      members: { connect: teamFAFO.members.map(m => ({ id: m.id })) }
    }
  });
  await prisma.match.createMany({ data: [
    { tournamentId: t.id, teamAEntryId: entryDog.id, teamBEntryId: entryFAFO.id, round: 1, bestOf: 1, status: "SCHEDULED", scheduledAt: new Date(Date.now() + 1000*60*60*25) },
    { tournamentId: t.id, teamAEntryId: entryFAFO.id, teamBEntryId: entryDog.id, round: 2, bestOf: 1, status: "SCHEDULED", scheduledAt: new Date(Date.now() + 1000*60*60*26) }
  ]});
  console.log("Seed complete:", { hosts: hosts.length, tournament: t.slug });
}
main().catch(e => { console.error(e); }).finally(() => prisma.$disconnect());