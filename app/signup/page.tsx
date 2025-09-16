// app/signup/page.tsx
export const dynamic = "force-dynamic";

import "server-only";
import Link from "next/link";
import TeamSignupForm from "@/components/signup/TeamSignupForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

// ⬇️ Import server actions from a separate module
import { handleSignup } from "./actions";

export default async function SignUpPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="max-w-xl space-y-4">
  <h1 className="text-2xl">Team Registration</h1>
        <p className="opacity-80">
          Please sign in with Discord to register your team. We link your Discord account to your team
          captain automatically so you don’t lose any info.
        </p>

        <form action={async () => {
          "use server";
          const { signInWithDiscord } = await import("./actions");
          await signInWithDiscord();
        }}>
          <Button type="submit" className="inline-flex items-center gap-2">
            {/* Optional: small Discord glyph next to text */}
            <span>Sign in with Discord</span>
          </Button>
        </form>

        <p className="text-xs text-zinc-400">
          By continuing you agree to our{" "}
          <Link href="/rules" className="underline hover:text-zinc-200">
            rules
          </Link>
          .
        </p>
      </div>
    );
  }

  const tournaments = await prisma.tournament.findMany({
  orderBy: { startAt: "desc" },
  select: { id: true, name: true },
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
  <h1 className="text-2xl">Team Registration</h1>

      <div className="rounded-md border border-zinc-700 bg-black/40 p-3 text-sm">
        <span className="opacity-70">Signed in as:</span>{" "}
        <span className="font-semibold">{captainDiscordName}</span>
      </div>

      <TeamSignupForm
  tournaments={tournaments.map((t) => ({ id: t.id, name: t.name }))}
        captainDiscordName={captainDiscordName}
        userKey={userKey}
        // ⬇️ Use the imported server action
        action={handleSignup}
      />
    </div>
  );
}
