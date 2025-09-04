// app/signup/page.tsx
import { headers } from "next/headers";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Plat = "PC" | "Xbox" | "PlayStation";
type Reg = "NA" | "EU" | "APAC";

async function upsertTeam(formData: FormData): Promise<void> {
  "use server";

  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");

  // Simple rate limit
  const ip = getClientIp(headers());
  const rl = rateLimit(ip, "signup", 10, 60_000);
  if (!rl.ok) throw new Error("Rate limit exceeded. Try again in a minute.");

  // Collect base values
  const tournamentId = String(formData.get("tournamentId") || "");
  const teamName = String(formData.get("teamName") || "").trim();
  const captainDiscord = String(formData.get("captainDiscord") || "").trim();

  // Required Embark IDs
  const embark1 = String(formData.get("embark1") || "").trim();
  const embark2 = String(formData.get("embark2") || "").trim();
  const embark3 = String(formData.get("embark3") || "").trim();
  const embarkSub = String(formData.get("embarkSub") || "").trim() || undefined;

  // Per-player platform/region
  const p1Plat = (formData.get("embark1_platform") as Plat) || "PC";
  const p1Reg = (formData.get("embark1_region") as Reg) || "NA";
  const p2Plat = (formData.get("embark2_platform") as Plat) || "PC";
  const p2Reg = (formData.get("embark2_region") as Reg) || "NA";
  const p3Plat = (formData.get("embark3_platform") as Plat) || "PC";
  const p3Reg = (formData.get("embark3_region") as Reg) || "NA";
  const subPlat = (formData.get("embarkSub_platform") as Plat) || "PC";
  const subReg = (formData.get("embarkSub_region") as Reg) || "NA";

  const agree = formData.get("agree") === "on";
  const turnstileToken = String(formData.get("cf-turnstile-response") || "");

  // Minimal validation (keeps this page self-contained)
  if (!tournamentId) throw new Error("Tournament is required");
  if (teamName.length < 3) throw new Error("Team name must be at least 3 characters");
  if (!embark1 || !embark2 || !embark3) throw new Error("Embark IDs 1–3 are required");
  if (!agree) throw new Error("You must agree to the rules");

  const ok = await verifyTurnstile(turnstileToken);
  if (!ok) throw new Error("Turnstile verification failed");

  // Resolve captain user (the signed-in user)
  const captainUser = await prisma.user.findUnique({
    where: { discordId: (session.user as any).discordId }
  });
  if (!captainUser) throw new Error("User not found");

  // Store per-player platform/region in Team.notes as JSON
  const perPlayer = {
    p1: { platform: p1Plat, region: p1Reg },
    p2: { platform: p2Plat, region: p2Reg },
    p3: { platform: p3Plat, region: p3Reg },
    ...(embarkSub ? { sub: { platform: subPlat, region: subReg } } : {})
  };
  const notes = JSON.stringify(perPlayer);

  const team = await prisma.team.upsert({
    where: { name: teamName },
    update: {
      tournamentId,
      notes
    },
    create: {
      name: teamName,
      tournamentId,
      captainId: captainUser.id,
      notes,
      members: {
        create: [
          { displayName: captainDiscord || "Captain", embarkId: embark1 },
          { displayName: "Starter 2", embarkId: embark2 },
          { displayName: "Starter 3", embarkId: embark3 },
          ...(embarkSub ? [{ displayName: "Sub", embarkId: embarkSub, isSub: true }] : [])
        ]
      }
    }
  });

  // Realtime “new signup” ping (unchanged)
  const supa = createClient();
  await supa
    .channel(`realtime:tournament:${team.tournamentId}:signups`)
    .send({ type: "broadcast", event: "signup", payload: { teamName: team.name } });

  // Server action returns void (page will refresh/revalidate per Next rules)
}

export default async function SignUpPage() {
  const session = await auth();

  // Sign-in gate (prevents users from filling the form and losing inputs)
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
    ((session.user as any).name as string) ??
    ((session.user as any).discordId as string) ??
    "";

  const PlatSelect = (props: { id: string; name: string }) => (
    <select id={props.id} name={props.name} className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2">
      <option>PC</option>
      <option>Xbox</option>
      <option>PlayStation</option>
    </select>
  );

  const RegSelect = (props: { id: string; name: string }) => (
    <select id={props.id} name={props.name} className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2">
      <option>NA</option>
      <option>EU</option>
      <option>APAC</option>
    </select>
  );

  const PlayerBlock = (props: {
    title: string;
    embarkId: string;
    platId: string;
    regId: string;
    embarkName: string;
    platName: string;
    regName: string;
    required?: boolean;
    hint?: string;
  }) => (
    <fieldset className="rounded-md border border-zinc-700 p-3 space-y-2">
      <legend className="px-1 text-sm opacity-80">{props.title}</legend>
      <div>
        <Label htmlFor={props.embarkId}>Embark ID</Label>
        <Input id={props.embarkId} name={props.embarkName} required={props.required} />
        {props.hint ? <p className="text-xs opacity-60 mt-1">{props.hint}</p> : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={props.platId}>Platform</Label>
          <PlatSelect id={props.platId} name={props.platName} />
        </div>
        <div>
          <Label htmlFor={props.regId}>Region</Label>
          <RegSelect id={props.regId} name={props.regName} />
        </div>
      </div>
    </fieldset>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl">Team Sign-Up</h1>

      <div className="rounded-md border border-zinc-700 bg-black/40 p-3 text-sm">
        <span className="opacity-70">Signed in as:</span>{" "}
        <span className="font-semibold">{captainDiscordName}</span>
      </div>

      {/* Hidden field so backend still receives captainDiscord */}
      <input type="hidden" name="captainDiscord" value={captainDiscordName} />

      <form action={upsertTeam} className="space-y-4" aria-describedby="signup-help">
        <p id="signup-help" className="sr-only">
          Enter Embark IDs for 3 starters and (optionally) a sub. Select Platform and Region for each player.
        </p>

        <label htmlFor="tournamentId" className="sr-only">
          Tournament
        </label>
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

        {/* Player sections */}
        <PlayerBlock
          title="Player 1 — Captain"
          embarkId="embark1"
          platId="embark1_platform"
          regId="embark1_region"
          embarkName="embark1"
          platName="embark1_platform"
          regName="embark1_region"
          required
          hint="Embark ID from your in-game profile."
        />

        <PlayerBlock
          title="Player 2"
          embarkId="embark2"
          platId="embark2_platform"
          regId="embark2_region"
          embarkName="embark2"
          platName="embark2_platform"
          regName="embark2_region"
          required
        />

        <PlayerBlock
          title="Player 3"
          embarkId="embark3"
          platId="embark3_platform"
          regId="embark3_region"
          embarkName="embark3"
          platName="embark3_platform"
          regName="embark3_region"
          required
        />

        <PlayerBlock
          title="Sub (optional)"
          embarkId="embarkSub"
          platId="embarkSub_platform"
          regId="embarkSub_region"
          embarkName="embarkSub"
          platName="embarkSub_platform"
          regName="embarkSub_region"
        />

        <div className="flex items-center gap-2">
          <input type="checkbox" id="agree" name="agree" required />
          <Label htmlFor="agree">I agree to the rules and format.</Label>
        </div>

        {/* Turnstile stub (keep your existing flow) */}
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