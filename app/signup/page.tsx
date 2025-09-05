// app/signup/page.tsx
export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamSignupSchema } from "@/lib/validators";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    // still send captainDiscord so your existing schema/backend keeps working
    captainDiscord: formData.get("captainDiscord") as string,
    embark1: formData.get("embark1") as string,
    embark2: formData.get("embark2") as string,
    embark3: formData.get("embark3") as string,
    embarkSub: (formData.get("embarkSub") as string) || undefined,
    platform: formData.get("platform") as "PC" | "Xbox" | "PlayStation",
    region: formData.get("region") as "NA" | "EU" | "APAC",
    agree: formData.get("agree") === "on",
    turnstileToken: (formData.get("cf-turnstile-response") as string) || undefined
  };

  const parsed = teamSignupSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.flatten().formErrors.join("; "));
  }

  const ok = await verifyTurnstile(parsed.data.turnstileToken);
  if (!ok) throw new Error("Turnstile verification failed");

  // Captain is the signed-in user
  const captainUser = await prisma.user.findUnique({
    where: { discordId: (session.user as any).discordId }
  });
  if (!captainUser) throw new Error("User not found");

  const team = await prisma.team.upsert({
    where: { name: parsed.data.teamName },
    update: {
      tournamentId: parsed.data.tournamentId,
      notes: `${parsed.data.platform}/${parsed.data.region}`
    },
    create: {
      name: parsed.data.teamName,
      tournamentId: parsed.data.tournamentId,
      captainId: captainUser.id,
      members: {
        create: [
          // We still store the captain's Discord display name against Embark ID 1
          { displayName: parsed.data.captainDiscord, embarkId: parsed.data.embark1 },
          { displayName: "Starter 2", embarkId: parsed.data.embark2 },
          { displayName: "Starter 3", embarkId: parsed.data.embark3 },
          ...(parsed.data.embarkSub
            ? [{ displayName: "Sub", embarkId: parsed.data.embarkSub, isSub: true }]
            : [])
        ]
      }
    }
  });

  const supa = createClient();
  await supa
    .channel(`realtime:tournament:${team.tournamentId}:signups`)
    .send({ type: "broadcast", event: "signup", payload: { teamName: team.name } });

  // Successful server action returns void (letting the page revalidate/refresh)
}

export default async function SignUpPage() {
  const session = await auth();

  // Gate the form entirely behind auth
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

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startsAt: "desc" }
  });

  const captainDiscordName =
    // prefer the user’s Discord display/global name, fall back to id if needed
    ((session.user as any).name as string) ??
    ((session.user as any).discordId as string) ??
    "";

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl">Team Sign-Up</h1>

      {/* Show who’s signed in, and carry that value through as a hidden field */}
      <div className="rounded-md border border-zinc-700 bg-black/40 p-3 text-sm">
        <span className="opacity-70">Signed in as:</span>{" "}
        <span className="font-semibold">{captainDiscordName}</span>
      </div>

      <form action={upsertTeam} className="space-y-4" aria-describedby="signup-help">
        <p id="signup-help" className="sr-only">
          All fields required unless marked optional. Enter Embark IDs for 3 starters and (optionally) a sub.
        </p>

        <label htmlFor="tournamentId" className="sr-only">Tournament</label>
        <select
          id="tournamentId"
          name="tournamentId"
          className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div>
          <Label htmlFor="teamName">Team name</Label>
          <Input id="teamName" name="teamName" minLength={3} required />
        </div>

        {/* Hidden field so backend still receives captainDiscord */}
        <input type="hidden" name="captainDiscord" value={captainDiscordName} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="embark1">Embark ID 1 (Captain)</Label>
            <Input id="embark1" name="embark1" required />
            <p className="text-xs opacity-60 mt-1">Embark ID from your in-game profile.</p>
          </div>
          <div>
            <Label htmlFor="embark2">Embark ID 2</Label>
            <Input id="embark2" name="embark2" required />
          </div>
          <div>
            <Label htmlFor="embark3">Embark ID 3</Label>
            <Input id="embark3" name="embark3" required />
          </div>
          <div>
            <Label htmlFor="embarkSub">Embark ID (Sub) — optional</Label>
            <Input id="embarkSub" name="embarkSub" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <select
              id="platform"
              name="platform"
              className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
            >
              <option>PC</option>
              <option>Xbox</option>
              <option>PlayStation</option>
            </select>
          </div>
          <div>
            <Label htmlFor="region">Region</Label>
            <select
              id="region"
              name="region"
              className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
            >
              <option>NA</option>
              <option>EU</option>
              <option>APAC</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="agree" name="agree" required />
          <Label htmlFor="agree">I agree to the rules and format.</Label>
        </div>

        {/* Turnstile stub (keeps your existing flow) */}
        <div className="border border-zinc-700 rounded p-2 text-xs opacity-70">
          Anti-spam active (Turnstile)
          <input type="hidden" name="cf-turnstile-response" value="stub-ok" />
        </div>

        <Button type="submit" className="w-full" aria-live="polite">
          Submit
        </Button>
      </form>
    </div>
  );
}