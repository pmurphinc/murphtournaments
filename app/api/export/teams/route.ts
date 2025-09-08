import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  await requireRole("STAFF");
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      entries: {
        include: {
          team: true,
          captain: { select: { discordId: true } },
          members: {
            include: {
              user: { select: { displayName: true } },
            },
          },
        },
      },
    },
  });

  function csvEscape(val: unknown): string {
    const s = String(val ?? "");
    return `"${s.replace(/"/g, '""')}"`;
  }

  const header = [
    "tournamentTitle",
    "teamDisplay",
    "captainDiscordId",
    "memberDisplayName",
    "embarkId",
    "platform",
    "region",
    "role"
  ];

  const lines: string[] = [header.map(csvEscape).join(",")];

  for (const t of tournaments) {
    for (const e of t.entries) {
      const teamDisplay = e.displayName ?? e.team.name;
      const captainDiscordId = e.captain?.discordId ?? "";
      for (const m of e.members) {
        lines.push([
          t.title,
          teamDisplay,
          captainDiscordId,
          m.user?.displayName ?? "",
          m.embarkId ?? "",
          m.platform ?? "",
          m.region ?? "",
          m.role
        ].map(csvEscape).join(","));
      }
    }
  }

  const csv = lines.join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=teams_export.csv",
      "Cache-Control": "no-store"
    }
  });
}