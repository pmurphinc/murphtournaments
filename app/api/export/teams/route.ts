import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  await requireRole("STAFF");
  const teams = await prisma.team.findMany({ include: { members: true, tournament: true, captain: true } });
  const header = "Tournament,Team,Approved,CaptainDiscord,Member,EmbarkId,IsSub\n";
  const rows = teams.flatMap(t =>
    t.members.map(m =>
      [t.tournament.name, t.name, t.approved ? "yes" : "no", t.captain.discordId, m.displayName, m.embarkId, m.isSub ? "yes" : "no"]
        .map(s => `"${String(s ?? "").replace(/"/g, '""')}"`).join(",")
    )
  );
  const csv = header + rows.join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=\"teams.csv\"" } });
}