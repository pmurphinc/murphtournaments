// app/admin/matches/[id]/page.tsx
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AdminMatchForm from "@/components/Admin/AdminMatchForm";
type Option = { id: string; name: string };
// ----- Update server action -----
async function updateMatch(formData: FormData): Promise<void> {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");

  const id = String(formData.get("id") || "");
  const tournamentId = String(formData.get("tournamentId") || "");
  const teamAId = String(formData.get("teamAId") || "");
  const teamBId = String(formData.get("teamBId") || "");
  const round = parseInt(String(formData.get("round") || "1"), 10);
  const bestOf = parseInt(String(formData.get("bestOf") || "1"), 10);
  const startAtIso = String(formData.get("startAtIso") || "");

  if (!id) throw new Error("Missing id");

  // Safety checks
  const [entryA, entryB] = await Promise.all([
    prisma.tournamentEntry.findUnique({ where: { id: teamAId }, select: { tournamentId: true } }),
    prisma.tournamentEntry.findUnique({ where: { id: teamBId }, select: { tournamentId: true } }),
  ]);
  if (!entryA || !entryB) throw new Error("Team entries not found");
  if (entryA.tournamentId !== tournamentId || entryB.tournamentId !== tournamentId) {
    throw new Error("Both entries must belong to the same tournament");
  }
  if (teamAId === teamBId) throw new Error("A team cannot play itself");

  await prisma.match.upsert({
    where: { id },
    create: {
      id, // keep route param as PK for convenience
      tournamentId,
      teamAEntryId: teamAId, // must be a TournamentEntry.id
      teamBEntryId: teamBId, // must be a TournamentEntry.id
      round,
      bestOf,
      status: "SCHEDULED",
  scheduledAt: startAtIso ? new Date(startAtIso) : null,
    },
    update: {
      tournamentId,
      teamAEntryId: teamAId,
      teamBEntryId: teamBId,
      round,
      bestOf,
  scheduledAt: startAtIso ? new Date(startAtIso) : null,
    },
  });

  revalidatePath("/schedule");
  revalidatePath("/admin/matches");
  redirect("/admin/matches");
}

export default async function EditMatchPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return <div className="space-y-2"><h1 className="text-2xl">Edit Match</h1><p>Please sign in.</p></div>;
  }

  const m = await prisma.match.findUnique({
    where: { id: params.id },
    include: { tournament: { select: { id: true, title: true } } },
  });
  if (!m) return notFound();

  const [rawTournaments, rawTeams] = await Promise.all([
    prisma.tournament.findMany({ select: { id: true, title: true }, orderBy: { startsAt: "desc" } }),
    prisma.tournamentEntry.findMany({
      where: { tournamentId: m.tournamentId },
      select: { id: true, displayName: true },
      orderBy: { seed: "asc" },
    }),
  ]);

  const tournaments: Option[] = rawTournaments.map(t => ({ id: t.id, name: t.title }));
  const teams: Option[] = rawTeams.map(e => ({ id: e.id, name: e.displayName }));

  const initial = {
    id: m.id,
    tournamentId: m.tournamentId,
    teamAId: m.teamAEntryId,
    teamBId: m.teamBEntryId,
    round: m.round,
    bestOf: m.bestOf,
    startAtIso: m.scheduledAt ? m.scheduledAt.toISOString() : null,
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Edit Match</h1>
      <AdminMatchForm
        mode="edit"
        tournaments={tournaments}
        teams={teams}
        initial={initial}
        action={updateMatch}
      />
    </div>
  );
}
