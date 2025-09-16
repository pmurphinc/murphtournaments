import { prisma } from "@/lib/prisma";
export default async function TeamsPage({ params }: { params: { id: string } }) {
  const t = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      entries: {
        include: {
          team: true,
          members: { include: { user: { select: { displayName: true } } } },
        },
      },
    },
  });
  if (!t) return <div>Not found</div>;
  const entries = t.entries;
  return (
    <div className="space-y-4">
  <h1 className="text-2xl">{t.name} — Teams</h1>
      {entries.map((e) => (
        <div key={e.id} className="rounded-lg border p-3">
          <div className="font-semibold">
            {e.displayName ?? e.team.name}
          </div>
          <div className="text-xs opacity-70 mt-1">
            {e.members.map(m => m.user?.displayName ?? m.embarkId).join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
