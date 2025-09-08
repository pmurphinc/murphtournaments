// app/admin/matches/[id]/page.tsx
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import AdminMatchForm from "@/components/Admin/AdminMatchForm";
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

  await prisma.tournamentEntry.update({
    where: { id },
    data: {
      tournamentId,
      teamAId,
      teamBId,
      round,
      bestOf,
      startAt: startAtIso ? new Date(startAtIso) : null,
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

  const [m, tournaments, teams] = await Promise.all([
    prisma.match.findUnique({
      where: { id: params.id },
      include: { tournament: { select: { id: true, name: true } } },
    }),
    prisma.tournament.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.team.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!m) return notFound();

  const initial = {
    id: m.id,
    tournamentId: m.tournamentId,
    teamAId: m.teamAId,
    teamBId: m.teamBId,
    round: m.round,
    bestOf: m.bestOf,
    startAtIso: m.startAt ? m.startAt.toISOString() : null,
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
