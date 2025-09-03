import { prisma } from "@/lib/prisma";
export default async function TeamsPage({ params }: { params: { slug: string } }) {
  const t = await prisma.tournament.findUnique({ where: { slug: params.slug }, include: { teams: { include: { members: true } } } });
  if (!t) return <div>Not found</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">{t.name} — Teams</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {t.teams.map(team => (
          <li key={team.id} className="border border-zinc-800 rounded p-3">
            <div className="font-semibold">{team.name} {team.approved ? "✅" : "⏳"}</div>
            <div className="text-xs opacity-70 mt-1">{team.members.map(m => m.displayName).join(", ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}