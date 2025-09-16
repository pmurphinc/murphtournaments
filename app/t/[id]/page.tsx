import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DataTable } from "@/components/DataTable";

export default async function TournamentHome({ params }: { params: { id: string } }) {
  const t = await prisma.tournament.findUnique({
    where: { id: params.id },
  });
  if (!t) return <div>Not found</div>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t.name}</h1>
      <div className="flex gap-4 text-sm">
        <Link className="hover:text-cyber-neon" href={`/t/${t.id}/teams`}>Teams</Link>
      </div>
      <div className="mt-4 text-zinc-400">Tournament status: {t.status}</div>
      <div className="mt-2 text-zinc-400">Start: {t.startAt ? new Date(t.startAt).toLocaleString() : "TBD"}</div>
    </div>
  );
}
