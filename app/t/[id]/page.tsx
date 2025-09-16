import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DataTable } from "@/components/DataTable";

export default async function TournamentHome({ params }: { params: { id: string } }) {
  const t = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      entries: { include: { team: true } },
      matches: {
        include: {
          teamA: { include: { team: true } },
          teamB: { include: { team: true } },
          winner: { include: { team: true } },
        },
        orderBy: [{ round: "asc" }, { createdAt: "asc" }],
      },
    },
  });
  if (!t) return <div>Not found</div>;
  const teams = t.entries.map(e => e.team);

  return (
    <div className="space-y-6">
  <h1 className="text-2xl">{t.name}</h1>
      <div className="flex gap-4 text-sm">
        <Link className="hover:text-cyber-neon" href={`/t/${t.id}/bracket`}>Bracket</Link>
        <Link className="hover:text-cyber-neon" href={`/t/${t.id}/teams`}>Teams</Link>
      </div>
      <section>
        <DataTable>
          <thead>
            <tr className="text-left">
              <th className="p-2">Match</th>
              <th className="p-2">Round</th>
              <th className="p-2">BestOf</th>
              <th className="p-2">Status</th>
              <th className="p-2">Started</th>
            </tr>
          </thead>
          <tbody>
            {t.matches.map(m => (
              <tr key={m.id} className="border-t border-zinc-800">
                <td className="p-2">{m.id.slice(0,6)}</td>
                <td className="p-2">{m.round}</td>
                <td className="p-2">BO{m.bestOf}</td>
                <td className="p-2">{m.status}</td>
                <td className="p-2">{m.startedAt ? new Date(m.startedAt).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}
