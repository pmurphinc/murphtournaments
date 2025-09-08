import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  await requireRole("STAFF");
  const t = await prisma.tournament.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      entries: { include: { team: true } },
      // matches: true, // leave commented unless used by UI
    },
  });
  const tournaments = t.map(tt => ({
    ...tt,
    teams: tt.entries.map(e => e.team),
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Admin</h1>
      <div className="flex gap-3">
        <Link className="underline hover:text-cyber-neon" href="/api/export/teams">Export Teams CSV</Link>
      </div>
      <div className="space-y-4">
        {tournaments.map(tt => (
          <div key={tt.id} className="rounded-lg border border-zinc-800 p-4">
            <div className="mb-2 text-lg font-semibold">{tt.title ?? tt.name}</div>
            <ul className="text-sm text-zinc-300">
              {tt.teams.length === 0 ? (
                <li className="italic text-zinc-500">No registered teams</li>
              ) : (
                tt.teams.map(team => <li key={team.id}>{team.name}</li>)
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}