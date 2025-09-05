// app/signup/page.tsx
export const dynamic = "force-dynamic";

import TeamSignupForm from "@/components/signup/TeamSignupForm";
import { headers } from "next/headers";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamSignupSchema } from "@/lib/validators";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// ----- server action -----
async function upsertTeam(formData: FormData): Promise<void> {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");

  const ip = getClientIp(headers());
  const rl = rateLimit(ip, "signup", 10, 60_000);
  if (!rl.ok) throw new Error("Rate limit exceeded. Try again in a minute.");

  const raw = {
    tournamentId: formData.get("tournamentId") as string,
    teamName: formData.get("teamName") as string,
    // still send this so your existing schema/backend keeps receiving it
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

  const team = await prisma.team.upsert({
    where: { name: parsed.data.teamName },
    update: {
      tournamentId: parsed.data.tournamentId,
      notes: `${parsed.data.platform}/${parsed.data.region}`,
    },
    create: {
      name: parsed.data.teamName,
      tournamentId: parsed.data.tournamentId,
      captainId: captainUser.id,
      members: {
        create: [
          // store captain’s readable Discord name alongside Embark ID 1
          { displayName: parsed.data.captainDiscord, embarkId: parsed.data.embark1 },
          { displayName: "Starter 2", embarkId: parsed.data.embark2 },
          { displayName: "Starter 3", embarkId: parsed.data.embark3 },
          ...(parsed.data.embarkSub
            ? [{ displayName: "Sub", embarkId: parsed.data.embarkSub, isSub: true }]
            : []),
        ],
      },
    },
  });

  // Realtime broadcast (keeps your existing behavior)
  const supa = createClient();
  await supa
    .channel(`realtime:tournament:${team.tournamentId}:signups`)
    .send({ type: "broadcast", event: "signup", payload: { teamName: team.name } });

  // returning void satisfies Next.js form action typing
}

// ----- page -----
export default async function SignUpPage() {
  const session = await auth();

  // If not signed in, show only the Discord sign-in button
  if (!session?.user) {
    async function signInWithDiscord(): Promise<void> {
      "use server";
      await signIn("discord");
    }

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

  // Signed-in flow
  const tournaments = await prisma.tournament.findMany({
    orderBy: { startsAt: "desc" }, // matches your schema (avoid 'createdAt')
  });

  const captainDiscordName =
    ((session.user as any).name as string) ??
    ((session.user as any).discordId as string) ??
    "";

  // key drafts per-user (user id preferred; fallback to discord id)
  const userKey =
    ((session.user as any).id as string) ??
    ((session.user as any).discordId as string);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl">Team Sign-Up</h1>

      {/* show who is signed in; carry value via hidden input in the form */}
      <div className="rounded-md border border-zinc-700 bg-black/40 p-3 text-sm">
        <span className="opacity-70">Signed in as:</span>{" "}
        <span className="font-semibold">{captainDiscordName}</span>
      </div>

      <TeamSignupForm
        tournaments={tournaments.map((t) => ({ id: t.id, name: t.name }))}
        captainDiscordName={captainDiscordName}
        userKey={userKey}
        action={upsertTeam}
      />
    </div>
  );
}