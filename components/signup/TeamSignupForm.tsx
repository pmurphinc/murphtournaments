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

// Optional per-Embark choices
type PlatformOpt = "" | "PC" | "Xbox" | "PlayStation";
type RegionOpt = "" | "NA" | "EU" | "APAC";

export default function TeamSignupForm({
  tournaments,
  captainDiscordName,
  userKey,
  action,
}: Props) {
  // ----- state -----
  // No tournament selection; registration is global or handled elsewhere
  const [teamName, setTeamName] = React.useState("");

  const [embark1, setEmbark1] = React.useState("");
  const [embark2, setEmbark2] = React.useState("");
  const [embark3, setEmbark3] = React.useState("");
  const [embarkSub, setEmbarkSub] = React.useState("");

  // NEW: optional per-embark platform/region
  const [platform1, setPlatform1] = React.useState<PlatformOpt>("");
  const [platform2, setPlatform2] = React.useState<PlatformOpt>("");
  const [platform3, setPlatform3] = React.useState<PlatformOpt>("");
  const [platformSub, setPlatformSub] = React.useState<PlatformOpt>("");

  const [region1, setRegion1] = React.useState<RegionOpt>("");
  const [region2, setRegion2] = React.useState<RegionOpt>("");
  const [region3, setRegion3] = React.useState<RegionOpt>("");
  const [regionSub, setRegionSub] = React.useState<RegionOpt>("");

  // Team-level platform/region are still required by your current backend.
  // We provide safe hidden defaults to avoid breaking the server action.
  const TEAM_DEFAULT_PLATFORM: Exclude<PlatformOpt, ""> = "PC";
  const TEAM_DEFAULT_REGION: Exclude<RegionOpt, ""> = "NA";

  const [agree, setAgree] = React.useState(false);

  // Per-user, per-tournament key
  const draftKey = React.useMemo(
    () => `signup:${userKey}`,
    [userKey]
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

      setPlatform1((d.platform1 as PlatformOpt) ?? "");
      setPlatform2((d.platform2 as PlatformOpt) ?? "");
      setPlatform3((d.platform3 as PlatformOpt) ?? "");
      setPlatformSub((d.platformSub as PlatformOpt) ?? "");

      setRegion1((d.region1 as RegionOpt) ?? "");
      setRegion2((d.region2 as RegionOpt) ?? "");
      setRegion3((d.region3 as RegionOpt) ?? "");
      setRegionSub((d.regionSub as RegionOpt) ?? "");

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
      platform1,
      platform2,
      platform3,
      platformSub,
      region1,
      region2,
      region3,
      regionSub,
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
  }, [
    draftKey,
    teamName,
    embark1,
    embark2,
    embark3,
    embarkSub,
    platform1,
    platform2,
    platform3,
    platformSub,
    region1,
    region2,
    region3,
    regionSub,
    agree,
  ]);

  // clear draft after submit fires
  function handleSubmitted() {
    try {
      localStorage.removeItem(draftKey);
    } catch {}
  }

  // Small helper for per-embark optional selects
  function PlatformSelect({
    id,
    name,
    value,
    onChange,
  }: {
    id: string;
    name: string;
    value: PlatformOpt;
    onChange: (v: PlatformOpt) => void;
  }) {
    return (
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value as PlatformOpt)}
        className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
      >
  <option value="">— Platform —</option>
        <option value="PC">PC</option>
        <option value="Xbox">Xbox</option>
        <option value="PlayStation">PlayStation</option>
      </select>
    );
  }

  function RegionSelect({
    id,
    name,
    value,
    onChange,
  }: {
    id: string;
    name: string;
    value: RegionOpt;
    onChange: (v: RegionOpt) => void;
  }) {
    return (
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value as RegionOpt)}
        className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
      >
  <option value="">— Region —</option>
        <option value="NA">NA</option>
        <option value="EU">EU</option>
        <option value="APAC">APAC</option>
      </select>
    );
  }

  return (
    <form action={action} onSubmit={handleSubmitted} className="space-y-4" aria-describedby="signup-help">
      <p id="signup-help" className="sr-only">
        All fields required unless marked optional. Enter Embark IDs for 3 starters and (optionally) a sub.
      </p>


  {/* Team Registration only; tournament selection removed */}

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

      {/* Hidden team-level defaults to satisfy current backend */}
      <input type="hidden" name="platform" value={TEAM_DEFAULT_PLATFORM} />
      <input type="hidden" name="region" value={TEAM_DEFAULT_REGION} />

      {/* Embark IDs + optional per-embark Platform/Region */}
      <div className="grid grid-cols-1 gap-4">
        {/* Row 1 */}
        <div className="rounded-md border border-zinc-800 p-3">
          <Label htmlFor="embark1">Embark ID 1 (Captain)</Label>
          <Input
            id="embark1"
            name="embark1"
            required
            value={embark1}
            onChange={(e) => setEmbark1(e.target.value)}
          />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <PlatformSelect id="platform1" name="platform1" value={platform1} onChange={setPlatform1} />
            <RegionSelect id="region1" name="region1" value={region1} onChange={setRegion1} />
          </div>
          <p className="text-xs opacity-60 mt-2">Platform and region are optional.</p>
        </div>

        {/* Row 2 */}
        <div className="rounded-md border border-zinc-800 p-3">
          <Label htmlFor="embark2">Embark ID 2</Label>
          <Input
            id="embark2"
            name="embark2"
            required
            value={embark2}
            onChange={(e) => setEmbark2(e.target.value)}
          />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <PlatformSelect id="platform2" name="platform2" value={platform2} onChange={setPlatform2} />
            <RegionSelect id="region2" name="region2" value={region2} onChange={setRegion2} />
          </div>
        </div>

        {/* Row 3 */}
        <div className="rounded-md border border-zinc-800 p-3">
          <Label htmlFor="embark3">Embark ID 3</Label>
          <Input
            id="embark3"
            name="embark3"
            required
            value={embark3}
            onChange={(e) => setEmbark3(e.target.value)}
          />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <PlatformSelect id="platform3" name="platform3" value={platform3} onChange={setPlatform3} />
            <RegionSelect id="region3" name="region3" value={region3} onChange={setRegion3} />
          </div>
        </div>

        {/* Row Sub (optional) */}
        <div className="rounded-md border border-zinc-800 p-3">
          <Label htmlFor="embarkSub">Embark ID (Sub) — optional</Label>
          <Input
            id="embarkSub"
            name="embarkSub"
            value={embarkSub}
            onChange={(e) => setEmbarkSub(e.target.value)}
          />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <PlatformSelect id="platformSub" name="platformSub" value={platformSub} onChange={setPlatformSub} />
            <RegionSelect id="regionSub" name="regionSub" value={regionSub} onChange={setRegionSub} />
          </div>
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
        <Label htmlFor="agree">
          I agree to the <a href="/rules" target="_blank" className="underline text-cyan-400 hover:text-cyan-300">Official Rules &amp; Fair Play Policy</a>.
        </Label>
      </div>

      {/* Turnstile (hidden stub to match your current server code) */}
      <input type="hidden" name="cf-turnstile-response" value="stub-ok" />

      <Button type="submit" className="w-full" aria-live="polite">
        Submit
      </Button>
    </form>
  );
}
