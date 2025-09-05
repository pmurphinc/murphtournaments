"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Tournament = { id: string; name: string };

type Props = {
  tournaments: Tournament[];
  captainDiscordName: string;
  userKey: string; // user id or discord id
  action: (formData: FormData) => void | Promise<void>; // server action passed from the page
};

export default function TeamSignupForm({
  tournaments,
  captainDiscordName,
  userKey,
  action,
}: Props) {
  // ----- state -----
  const [tournamentId, setTournamentId] = React.useState(tournaments[0]?.id ?? "");
  const [teamName, setTeamName] = React.useState("");
  const [embark1, setEmbark1] = React.useState("");
  const [embark2, setEmbark2] = React.useState("");
  const [embark3, setEmbark3] = React.useState("");
  const [embarkSub, setEmbarkSub] = React.useState("");
  const [platform, setPlatform] = React.useState<"PC" | "Xbox" | "PlayStation">("PC");
  const [region, setRegion] = React.useState<"NA" | "EU" | "APAC">("NA");
  const [agree, setAgree] = React.useState(false);

  // Per-user, per-tournament key
  const draftKey = React.useMemo(
    () => `signup:${userKey}:${tournamentId || "none"}`,
    [userKey, tournamentId]
  );

  // ----- restore on mount or when tournament changes -----
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const d = JSON.parse(raw);
      setTeamName(d.teamName ?? "");
      setEmbark1(d.embark1 ?? "");
      setEmbark2(d.embark2 ?? "");
      setEmbark3(d.embark3 ?? "");
      setEmbarkSub(d.embarkSub ?? "");
      setPlatform((d.platform as typeof platform) ?? "PC");
      setRegion((d.region as typeof region) ?? "NA");
      setAgree(!!d.agree);
    } catch {
      // ignore parse errors
    }
  }, [draftKey]);

  // ----- debounce save whenever fields change -----
  React.useEffect(() => {
    const payload = {
      teamName,
      embark1,
      embark2,
      embark3,
      embarkSub,
      platform,
      region,
      agree,
    };
    const id = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(payload));
      } catch {
        // storage may be disabled; ignore
      }
    }, 400);
    return () => clearTimeout(id);
  }, [draftKey, teamName, embark1, embark2, embark3, embarkSub, platform, region, agree]);

  // clear draft after submit fires
  function handleSubmitted() {
    try {
      localStorage.removeItem(draftKey);
    } catch {}
  }

  return (
    <form action={action} onSubmit={handleSubmitted} className="space-y-4" aria-describedby="signup-help">
      <p id="signup-help" className="sr-only">
        All fields required unless marked optional. Enter Embark IDs for 3 starters and (optionally) a sub.
      </p>

      {/* Tournament */}
      <label htmlFor="tournamentId" className="sr-only">Tournament</label>
      <select
        id="tournamentId"
        name="tournamentId"
        value={tournamentId}
        onChange={(e) => setTournamentId(e.target.value)}
        className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
      >
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Team name */}
      <div>
        <Label htmlFor="teamName">Team name</Label>
        <Input
          id="teamName"
          name="teamName"
          minLength={3}
          required
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {/* Captain Discord: hidden — pulled from session */}
      <input type="hidden" name="captainDiscord" value={captainDiscordName} />

      {/* Embark IDs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="embark1">Embark ID 1 (Captain)</Label>
          <Input
            id="embark1"
            name="embark1"
            required
            value={embark1}
            onChange={(e) => setEmbark1(e.target.value)}
          />
          <p className="text-xs opacity-60 mt-1">12-digit Embark ID from your in-game profile.</p>
        </div>
        <div>
          <Label htmlFor="embark2">Embark ID 2</Label>
          <Input
            id="embark2"
            name="embark2"
            required
            value={embark2}
            onChange={(e) => setEmbark2(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="embark3">Embark ID 3</Label>
          <Input
            id="embark3"
            name="embark3"
            required
            value={embark3}
            onChange={(e) => setEmbark3(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="embarkSub">Embark ID (Sub) — optional</Label>
          <Input
            id="embarkSub"
            name="embarkSub"
            value={embarkSub}
            onChange={(e) => setEmbarkSub(e.target.value)}
          />
        </div>
      </div>

      {/* Platform & Region */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <select
            id="platform"
            name="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as typeof platform)}
            className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
          >
            <option value="PC">PC</option>
            <option value="Xbox">Xbox</option>
            <option value="PlayStation">PlayStation</option>
          </select>
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <select
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as typeof region)}
            className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
          >
            <option value="NA">NA</option>
            <option value="EU">EU</option>
            <option value="APAC">APAC</option>
          </select>
        </div>
      </div>

      {/* Agree */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="agree"
          name="agree"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
        />
        <Label htmlFor="agree">I agree to the rules and format.</Label>
      </div>

      {/* Turnstile (hidden stub to match your current server code) */}
      <input type="hidden" name="cf-turnstile-response" value="stub-ok" />

      <Button type="submit" className="w-full" aria-live="polite">
        Submit
      </Button>
    </form>
  );
}
