// app/admin/matches/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import AdminMatchForm from "@/components/admin/AdminMatchForm";
import LocalTime from "@/components/LocalTime";
import Link from "next/link";

// ----- Create server action -----
async function createMatch(formData: FormData): Promise<void> {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");

  const tournamentId = String(formData.get("tournamentId") || "");
  const teamAId = String(formData.get("teamAId") || "");
  const teamBId = String(formData.get("teamBId") || "");
  const round = parseInt(String(formData.get("round") || "1"), 10);
  const bestOf = parseInt(String(formData.get("bestOf") || "1"), 10);
  const startAtIso = String(formData.get("startAtIso") || "");

  if (!tournamentId || !teamAId || !teamBId || !startAtIso) {
    throw new Error("Missing required fields");
  }

  await prisma.match.create({
    data: {
      tournamentId,
      teamAId,
      teamBId,
      round,
      bestOf,
      startAt: new Date(startAtIso),
    },
  });

  revalidatePath("/schedule");
  revalidatePath("/admin/matches");
}

export default async function AdminMatchesPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl">Admin: Matches</h1>
        <p>Please sign in to manage matches.</p>
      </div>
    );
  }

  const [tournaments, teams, matches] = await Promise.all([
    prisma.tournament.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.team.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.match.findMany({
      orderBy: { startAt: "desc" },
      include: {
        tournament: { select: { name: true } },
        teamA: { select: { name: true } },
        teamB: { select: { name: true } },
      },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl mb-2">Admin: Create Match</h1>
        <AdminMatchForm
          mode="create"
          tournaments={tournaments}
          teams={teams}
          action={createMatch}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl">Recent Matches</h2>
        <div className="overflow-hidden rounded-lg border border-zinc-800 divide-y divide-zinc-800">
          {matches.map((m) => (
            <div key={m.id} className="grid grid-cols-[1fr_auto_auto] gap-3 p-3">
              <div className="min-w-0">
                <div className="text-sm opacity-80">
                  {m.tournament?.name ?? "Tournament"} • Round {m.round} • BO{m.bestOf}
                </div>
                <div className="truncate">
                  <span className="font-medium">{m.teamA?.name ?? "TBD"}</span>
                  <span className="opacity-70"> vs </span>
                  <span className="font-medium">{m.teamB?.name ?? "TBD"}</span>
                </div>
              </div>
              <div className="text-right whitespace-nowrap">
                {m.startAt ? <LocalTime iso={m.startAt.toISOString()} /> : "TBD"}
              </div>
              <div className="text-right">
                <Link
                  href={`/admin/matches/${m.id}`}
                  className="text-cyber-neon underline underline-offset-4"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
          {matches.length === 0 && <div className="p-3 opacity-70">No matches yet.</div>}
        </div>
      </div>
    </div>
  );
}