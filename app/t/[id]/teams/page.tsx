import { prisma } from "@/lib/prisma";

export default async function TeamsPage({ params }: { params: { id: string } }) {
  const t = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: { teams: true },
  });
  if (!t) return <div>Not found</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">{t.name} — Teams</h1>
      {t.teams.length === 0 ? (
        <div className="italic text-zinc-500">No teams registered.</div>
      ) : (
        t.teams.map((team) => (
          <div key={team.id} className="rounded-lg border p-3">
            <div className="font-semibold">{team.name}</div>
          </div>
        ))
      )}
    </div>
  );
}
