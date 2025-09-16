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
  // 1) Get upcoming/dated tournaments (new schema: no matches, just tournaments)
  const tournaments = await prisma.tournament.findMany({
    orderBy: [{ startAt: "asc" }],
    take: 100,
  });

  // 2) Group tournaments by calendar date (UTC)
  function groupByDateNew(rows: typeof tournaments) {
    const map = new Map<string, typeof tournaments>();
    for (const t of rows) {
      if (!t.startAt) continue;
      const iso = t.startAt.toISOString();
      const dateKey = iso.slice(0, 10); // YYYY-MM-DD
      const list = map.get(dateKey) ?? [];
      list.push(t);
      map.set(dateKey, list);
    }
    return map;
  }
  const groups = groupByDateNew(tournaments);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Schedule</h1>

      {tournaments.length === 0 && (
        <div className="rounded-md border border-zinc-700 bg-black/40 p-4">
          <p className="opacity-80">
            No tournaments found yet. Add tournaments in Supabase with a{" "}
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
              {list.map((t) => {
                const iso = t.startAt ? t.startAt.toISOString() : null;
                return (
                  <div key={t.id} className="grid grid-cols-[1fr_auto] gap-3 p-3">
                    <div className="min-w-0">
                      <div className="truncate text-base font-medium">
                        {t.name}
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm">
                      {iso ? (
                        <time dateTime={iso}>{new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
                      ) : <span className="opacity-60">TBD</span>}
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