import { prisma } from "@/lib/prisma";
export const revalidate = 30; 
import { StatusBanner } from "@/components/StatusBanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";

async function getData() {
  const [tournament] = await prisma.tournament.findMany({
    take: 1,
  });
  // Count all teams (no tournamentId field in Team)
  const teams = await prisma.team.count();
  // Placeholder for openQuestions and hours
  const openQuestions = 0;
  const hours = Array.from({ length: 24 }).map((_, i) => ({ name: `${i}:00`, signups: Math.floor(Math.random()*5), questions: Math.floor(Math.random()*3) }));
  return { tournament, teams, openQuestions, hours };
}

export default async function DashboardPage() {
  const data = await getData();
  // Map tournament fields for StatusBanner if tournament exists
  const sb = data.tournament
    ? {
  name: data.tournament.name, // use name as name
        status: data.tournament.status as any, // cast to TournyStatus
  startAt: data.tournament.startAt ?? null, // use startAt
        checkInOpensAt: null,
      }
    : null;
  return (
    <div className="space-y-6">
      <StatusBanner tournament={sb} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-glow"><CardHeader><CardTitle>Teams Signed Up</CardTitle></CardHeader><CardContent className="text-4xl">{data.teams}</CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Announcements</CardTitle></CardHeader><CardContent><ul className="space-y-2">
          <li className="text-sm font-semibold text-yellow-300">0e0f This website is a work in progress. Features and data may change at any time.</li>
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