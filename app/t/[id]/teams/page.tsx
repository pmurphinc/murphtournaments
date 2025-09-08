import { prisma } from "@/lib/prisma";
export default async function TeamsPage({ params }: { params: { id: string } }) {
  const t = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      entries: { include: { team: { include: { members: true } } } },
    },
  });
  if (!t) return <div>Not found</div>;
  const teams = t.entries.map(e => e.team);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">{t.title} — Teams</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {teams.map(team => (
          <li key={team.id} className="border border-zinc-800 rounded p-3">
            <div className="font-semibold">{team.name} {team.approved ? "✅" : "⏳"}</div>
            <div className="text-xs opacity-70 mt-1">{team.members.map(m => m.displayName).join(", ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
