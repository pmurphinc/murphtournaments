import { prisma } from '@/lib/prisma';
export const revalidate = 30; 
import { StatusBanner } from "@/components/StatusBanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";

async function getData() {
  const [tournament] = await prisma.tournament.findMany({
    orderBy: { startsAt: "desc" },
    take: 1,
    include: { entries: true },
  });
  const teams = tournament ? tournament.entries.length : 0;
  const openQuestions = 0;
  const upcomingMatches = tournament
    ? await prisma.match.count({
        where: { tournamentId: tournament.id, status: { in: ["SCHEDULED", "LIVE"] } },
      })
    : 0;
  const hours = Array.from({ length: 24 }).map((_, i) => ({ name: f`${i}:00`, signups: Math.floor(Math.random()*5), questions: Math.floor(Math.random()*3) }));
  return { tournament, teams, openQuestions, upcomingMatches, hours };
}
function f(strings: TemplateStringsArray, v: any){return String(v)} // tiny helper for template use above

export default async function DashboardPage() {
  const data = await getData();
  const sb = data.tournament
    ? { name: data.tournament.title, status: data.tournament.status as any, startsAt: data.tournament.startsAt, checkInOpensAt: null }
    : null;
  return (
    <div className="space-y-6">
      <StatusBanner tournament={sb} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-glow"><CardHeader><CardTitle>Teams Signed Up</CardTitle></CardHeader><CardContent className="text-4xl">{data.teams}</CardContent></Card>
        <Card className="shadow-glow"><CardHeader><CardTitle>Upcoming Matches/Lobbies</CardTitle></CardHeader><CardContent className="text-4xl">{data.upcomingMatches}</CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Announcements</CardTitle></CardHeader><CardContent><ul className="space-y-2">
          <li className="text-sm font-semibold text-yellow-300">⚠️ This website is a work in progress. Features and data may change at any time.</li>
        </ul></CardContent></Card>
      </div>
      <div className="mt-8">
        <a
          href="/registration"
          className="inline-block px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow hover:bg-cyan-700 transition"
        >
          Team Registration
        </a>
      </div>
    </div>
  );
}