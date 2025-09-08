// app/signup/page.tsx
export const dynamic = "force-dynamic";

import TeamSignupForm from "@/components/signup/TeamSignupForm";
import "server-only";
import { headers } from "next/headers";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamSignupSchema } from "@/lib/validators";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// Helper to slugify team names
function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function handleSignup(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");
  const ownerId = session.user.id;

  const ip = getClientIp(headers());
  const rl = rateLimit(ip, "signup", 10, 60_000);
  if (!rl.ok) throw new Error("Rate limit exceeded");

  const raw = {
    tournamentId: formData.get("tournamentId") as string,
    teamName: formData.get("teamName") as string,
    captainDiscord: formData.get("captainDiscord") as string,
    embark1: formData.get("embark1") as string,
    embark2: formData.get("embark2") as string,
    embark3: formData.get("embark3") as string,
    embarkSub: (formData.get("embarkSub") as string) || undefined,
    platform: formData.get("platform") as "PC" | "Xbox" | "PlayStation",
    region: formData.get("region") as "NA" | "EU" | "APAC",
    agree: formData.get("agree") === "on",
    turnstileToken: (formData.get("cf-turnstile-response") as string) || undefined,
  };

  const parsed = teamSignupSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().formErrors.join("; "));
  }

  const ok = await verifyTurnstile(parsed.data.turnstileToken);
  if (!ok) throw new Error("Turnstile verification failed");

  // Captain = the signed-in Discord user
  const captainUser = await prisma.user.findUnique({
    where: { discordId: (session.user as any).discordId },
  });
  if (!captainUser) throw new Error("User not found");

  const teamSlug = slugify(parsed.data.teamName);
  const team = await prisma.team.upsert({
    where: { slug: teamSlug },
    update: {
      name: parsed.data.teamName,
    },
    create: {
      name: parsed.data.teamName,
      slug: teamSlug,
      owner: { connect: { id: ownerId } },
    },
  });

  // Create a TournamentEntry for this event (event-specific snapshot & roster)
  const entry = await prisma.tournamentEntry.create({
    data: {
      tournamentId: parsed.data.tournamentId,
      teamId: team.id,
      displayName: (parsed.data as any).teamDisplayName ?? team.name,
      captainUserId: ownerId,
      // members: { create: [...] } // add your EntryMembers here if this page handles roster
    },
  });

  const supa = createClient();
  await supa
    .channel(`realtime:tournament:${entry.tournamentId}:signups`)
    .send({ type: "broadcast", event: "signup", payload: { teamName: team.name } });

  // returning void satisfies Next.js form action typing
  return;
}

export async function signInWithDiscord() {
  "use server";
  await signIn("discord");
}

// ----- page -----
export default async function SignUpPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl">Team Sign-Up</h1>
        <p className="opacity-80">
          Please sign in with Discord to register a team. We link your Discord account to your team captain
          automatically so you don’t lose any info.
        </p>
        <form action={signInWithDiscord}>
          <Button type="submit">Sign in with Discord</Button>
        </form>
      </div>
    );
  }

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startsAt: "desc" },
  });

  const captainDiscordName =
    ((session.user as any).name as string) ??
    ((session.user as any).discordId as string) ??
    "";

  const userKey =
    ((session.user as any).id as string) ??
    ((session.user as any).discordId as string);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl">Team Sign-Up</h1>

      <div className="rounded-md border border-zinc-700 bg-black/40 p-3 text-sm">
        <span className="opacity-70">Signed in as:</span>{" "}
        <span className="font-semibold">{captainDiscordName}</span>
      </div>

      <TeamSignupForm
        tournaments={tournaments.map((t) => ({ id: t.id, name: t.title }))}
        captainDiscordName={captainDiscordName}
        userKey={userKey}
        action={handleSignup}
      />
    </div>
  );
}