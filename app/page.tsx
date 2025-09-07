import { prisma } from "@/lib/prisma";
export const revalidate = 30; 
import { StatusBanner } from "@/components/StatusBanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";

async function getData() {
  const [tournament] = await prisma.tournament.findMany({ orderBy: { startsAt: "desc" }, take: 1 });
  const teams = tournament ? await prisma.team.count({ where: { tournamentId: tournament.id } }) : 0;
  const openQuestions = await prisma.question.count({ where: { status: "OPEN" } });
  const upcomingMatches = tournament ? await prisma.match.count({ where: { tournamentId: tournament.id, status: { in: ["PENDING", "READY"] } } }) : 0;
  const hours = Array.from({ length: 24 }).map((_, i) => ({ name: f`${i}:00`, signups: Math.floor(Math.random()*5), questions: Math.floor(Math.random()*3) }));
  return { tournament, teams, openQuestions, upcomingMatches, hours };
}
function f(strings: TemplateStringsArray, v: any){return String(v)} // tiny helper for template use above

export default async function DashboardPage() {
  const data = await getData();
  return (
    <div className="space-y-6">
      <StatusBanner tournament={data.tournament ?? null} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-glow"><CardHeader><CardTitle>Teams Signed Up</CardTitle></CardHeader><CardContent className="text-4xl">{data.teams}</CardContent></Card>
        <Card className="shadow-glow"><CardHeader><CardTitle>Open Questions</CardTitle></CardHeader><CardContent className="text-4xl">{data.openQuestions}</CardContent></Card>
        <Card className="shadow-glow"><CardHeader><CardTitle>Upcoming Matches/Lobbies</CardTitle></CardHeader><CardContent className="text-4xl">{data.upcomingMatches}</CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Announcements</CardTitle></CardHeader><CardContent><ul className="space-y-2">
          <li className="text-sm opacity-90">Check-ins open at 5:30 PM.</li>
          <li className="text-sm opacity-90">Hosts online: Jacob, Megatron, TRAV, Murph.</li>
        </ul></CardContent></Card>
        </div>
    </div>
  );
}