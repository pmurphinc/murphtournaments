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
        name: data.tournament.name,
        status: data.tournament.status as "DRAFT" | "REGISTRATION" | "LOCKED" | "CHECKIN" | "LIVE" | "FINISHED" | "ARCHIVED",
        startsAt: data.tournament.startAt ?? null,
      }
    : null;
    return (
      <div className="space-y-6">
        <div className="w-full text-center py-3">
          <span className="font-bold text-yellow-300 text-lg">This website is a work in progress. Features and data may change at any time.</span>
        </div>
        <StatusBanner tournament={sb} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-glow"><CardHeader><CardTitle>Teams Signed Up</CardTitle></CardHeader><CardContent className="text-4xl">{data.teams}</CardContent></Card>
        </div>
      </div>
    );
}