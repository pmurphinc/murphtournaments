import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DataTable } from "@/components/DataTable";

export default async function TournamentHome({ params }: { params: { slug: string } }) {
  const t = await prisma.tournament.findUnique({ where: { slug: params.slug }, include: { teams: true, matches: true } });
  if (!t) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t.name}</h1>
      <div className="flex gap-4 text-sm">
        <Link className="hover:text-cyber-neon" href={`/t/${t.slug}/bracket`}>Bracket</Link>
        <Link className="hover:text-cyber-neon" href={`/t/${t.slug}/teams`}>Teams</Link>
      </div>
      <section>
        <h2 className="text-xl mb-2">Matches</h2>
        <DataTable>
          <thead>
            <tr className="text-left">
              <th className="p-2">Match</th><th className="p-2">Round</th><th className="p-2">BestOf</th><th className="p-2">Host</th><th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {t.matches.map(m => (
              <tr key={m.id} className="border-t border-zinc-800">
                <td className="p-2">{m.id.slice(0,6)}</td>
                <td className="p-2">{m.round}</td>
                <td className="p-2">BO{m.bestOf}</td>
                <td className="p-2">{m.hostId ?? "-"}</td>
                <td className="p-2">{m.status}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}