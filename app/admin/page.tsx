import { requireRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  await requireRole("STAFF");
  const tournaments = await prisma.tournament.findMany({
    orderBy: { name: "asc" },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Admin</h1>
      <div className="flex gap-3">
        <Link className="underline hover:text-cyber-neon" href="/api/export/teams">Export Teams CSV</Link>
      </div>
      <div className="space-y-4">
        {tournaments.map(tt => (
          <div key={tt.id} className="rounded-lg border border-zinc-800 p-4">
            <div className="mb-2 text-lg font-semibold">{tt.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}