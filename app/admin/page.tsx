import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  await requireRole("STAFF");
  const t = await prisma.tournament.findMany({ include: { teams: true } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Admin</h1>
      <div className="flex gap-3">
        <Link className="underline hover:text-cyber-neon" href="/api/export/teams">Export Teams CSV</Link>
      </div>
      <div className="space-y-2">
        {t.map(x => (
          <div key={x.id} className="border border-zinc-800 rounded p-3">
            <div className="font-semibold">{x.name}</div>
            <div className="text-xs opacity-70">Status: {x.status} • Teams: {x.teams.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}