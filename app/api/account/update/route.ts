import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { discordId, embarkId, region, timezone, platform } = await req.json();
    if (!discordId) {
      return NextResponse.json({ error: "Missing discordId" }, { status: 400 });
    }
    // Convert empty strings to null for optional fields
    const safeData = {
      embarkId: embarkId === "" ? null : embarkId,
      region: region === "" ? null : region,
      timezone: timezone === "" ? null : timezone,
      platform: platform === "" ? null : platform,
    };
    await prisma.user.update({
      where: { discordId },
      data: safeData,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
