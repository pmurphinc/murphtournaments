// app/schedule/page.tsx
export const revalidate = 60;          // refresh up to once per minute
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import LocalTime from "@/components/LocalTime";

type MatchRow = {
  id: string;
  startAt: Date | null;
  round: number;
  bestOf: number;
  teamAId: string | null;
  teamBId: string | null;
  tournament: { name: string };
};

function groupByDate(rows: MatchRow[]) {
  const map = new Map<string, MatchRow[]>();
  for (const m of rows) {
    if (!m.startAt) continue;
    const iso = m.startAt.toISOString();
    const dateKey = iso.slice(0, 10); // YYYY-MM-DD
    const list = map.get(dateKey) ?? [];
    list.push(m);
    map.set(dateKey, list);
  }
  return map;
}

export default async function SchedulePage() {
  // 1) Get upcoming/dated matches with full entry/team info
  const matches = await prisma.match.findMany({
    orderBy: [{ round: "asc" }, { createdAt: "asc" }],
    include: {
      tournament: { select: { title: true } },
      teamA: { include: { team: true } },
      teamB: { include: { team: true } },
      winner: { include: { team: true } },
    },
    take: 500,
  });

  // 2) Group matches by calendar date (UTC)
  function groupByDateNew(rows: typeof matches) {
    const map = new Map<string, typeof matches>();
    for (const m of rows) {
      if (!m.scheduledAt) continue;
      const iso = m.scheduledAt.toISOString();
      const dateKey = iso.slice(0, 10); // YYYY-MM-DD
      const list = map.get(dateKey) ?? [];
      list.push(m);
      map.set(dateKey, list);
    }
    return map;
  }
  const groups = groupByDateNew(matches);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Schedule</h1>

      {matches.length === 0 && (
        <div className="rounded-md border border-zinc-700 bg-black/40 p-4">
          <p className="opacity-80">
            No matches found yet. Add matches in Supabase with a{" "}
            <strong>startAt</strong> time and they’ll appear here shortly.
          </p>
        </div>
      )}

      {[...groups.entries()].map(([dateKey, list]) => {
        const header = new Date(dateKey + "T00:00:00Z").toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <section key={dateKey} className="space-y-3">
            <h2 className="text-lg font-semibold">{header}</h2>

            <div className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800">
              {list.map((m) => {
                const iso = m.startedAt ? m.startedAt.toISOString() : null;
                const nameA = m.teamA?.displayName ?? m.teamA?.team?.name ?? "TBD";
                const nameB = m.teamB?.displayName ?? m.teamB?.team?.name ?? "TBD";
                return (
                  <div key={m.id} className="grid grid-cols-[1fr_auto] gap-3 p-3 sm:grid-cols-[1fr_auto_auto]">
                    <div className="min-w-0">
                      <div className="truncate text-sm opacity-80">
                        {m.tournament?.title ?? "Untitled Tournament"} • Round {m.round} • BO{m.bestOf}
                      </div>
                      <div className="truncate text-base">
                        <span className="font-medium">{nameA}</span>
                        <span className="opacity-70"> vs </span>
                        <span className="font-medium">{nameB}</span>
                      </div>
                    </div>

                    <div className="whitespace-nowrap text-right text-sm sm:text-base">
                      {iso ? <LocalTime iso={iso} /> : <span className="opacity-60">TBD</span>}
                    </div>

                    {/* optional UTC helper */}
                    <div className="hidden text-right text-xs opacity-60 sm:block">
                      {iso ? (
                        <time dateTime={iso}>
                          {new Date(iso).toUTCString().replace(" GMT", "")} UTC
                        </time>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}