import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  await requireRole("STAFF");
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startAt: "desc" },
    include: { teams: true },
  });

  function csvEscape(val: unknown): string {
    const s = String(val ?? "");
    return `"${s.replace(/"/g, '""')}"`;
  }

  const header = ["tournamentName", "teamName", "teamId"];
  const lines: string[] = [header.map(csvEscape).join(",")];

  for (const t of tournaments) {
    for (const team of t.teams) {
      lines.push([
        t.name,
        team.name,
        team.id
      ].map(csvEscape).join(","));
    }
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=teams.csv"
    },
  });
}
  });
}