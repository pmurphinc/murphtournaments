"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type IdName = { id: string; name: string };

export type AdminMatchInitial = {
  id?: string;
  tournamentId?: string | null;
  teamAId?: string | null;
  teamBId?: string | null;
  round?: number | null;
  bestOf?: number | null;
  startAtIso?: string | null; // UTC ISO
};

type Props = {
  mode: "create" | "edit";
  tournaments: IdName[];
  teams: IdName[];
  initial?: AdminMatchInitial;
  action: (formData: FormData) => void | Promise<void>; // server action
};

// ---------- Timezone helpers (no deps) ----------
const PT = "America/Los_Angeles";
const ET = "America/New_York";

function partsFromFormatter(d: Date, tz: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map = Object.fromEntries(
    fmt.formatToParts(d).filter(p => p.type !== "literal").map(p => [p.type, p.value])
  ) as Record<string, string>;
  return {
    year: +map.year,
    month: +map.month,
    day: +map.day,
    hour: +map.hour,
    minute: +map.minute,
    second: +map.second,
  };
}

// Offset (minutes) of a given timeZone at a given UTC timestamp
function tzOffsetMinutes(timeZone: string, utcTs: number) {
  const p = partsFromFormatter(new Date(utcTs), timeZone);
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return (asUTC - utcTs) / 60000; // minutes
}

// Convert local wall time in a timeZone to a UTC ISO string
function zonedLocalToUtcIso(dateStr: string, timeStr: string, timeZone: string): string {
  if (!dateStr || !timeStr) return "";
  const [y, m, d] = dateStr.split("-").map(n => parseInt(n, 10));
  const [hh, mm] = timeStr.split(":").map(n => parseInt(n, 10));
  // Initial guess: treat as if entered components were UTC
  const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
  // Adjust by zone offset
  let off = tzOffsetMinutes(timeZone, guess);
  let actual = guess - off * 60000;
  // One more iteration for DST boundary safety
  const off2 = tzOffsetMinutes(timeZone, actual);
  if (off2 !== off) actual = guess - off2 * 60000;
  return new Date(actual).toISOString();
}

// Convert UTC ISO -> date/time strings in a timeZone for form fields
function utcIsoToZonedParts(iso: string, timeZone: string): { date: string; time: string } {
  const ts = Date.parse(iso);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date(ts)).filter(p => p.type !== "literal").map(p => [p.type, p.value])
  ) as Record<string, string>;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

function fmtPreview(iso: string, timeZone: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

// ------------------------------------------------

export default function AdminMatchForm({
  mode,
  tournaments,
  teams,
  initial,
  action,
}: Props) {
  // fields
  const [tournamentId, setTournamentId] = React.useState(initial?.tournamentId ?? tournaments[0]?.id ?? "");
  const [teamAId, setTeamAId] = React.useState(initial?.teamAId ?? "");
  const [teamBId, setTeamBId] = React.useState(initial?.teamBId ?? "");
  const [round, setRound] = React.useState<number>(initial?.round ?? 1);
  const [bestOf, setBestOf] = React.useState<number>(initial?.bestOf ?? 1);

  // Time fields (default PT). If editing, derive from existing UTC ISO.
  const [date, setDate] = React.useState<string>(() => {
    if (initial?.startAtIso) return utcIsoToZonedParts(initial.startAtIso, PT).date;
    return "";
  });
  const [time, setTime] = React.useState<string>(() => {
    if (initial?.startAtIso) return utcIsoToZonedParts(initial.startAtIso, PT).time;
    return "";
  });

  // live-computed UTC ISO for submission & previews
  const startAtIso = React.useMemo(() => {
    if (!date || !time) return "";
    return zonedLocalToUtcIso(date, time, PT);
  }, [date, time]);

  function onSubmit() {
    // clear nothing here; server will revalidate schedule
  }

  return (
    <form action={action} onSubmit={onSubmit} className="space-y-4">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {/* Tournament */}
      <div>
        <Label htmlFor="tournamentId">Tournament</Label>
        <select
          id="tournamentId"
          name="tournamentId"
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
          className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
          required
        >
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="teamAId">Team A</Label>
          <select
            id="teamAId"
            name="teamAId"
            value={teamAId}
            onChange={(e) => setTeamAId(e.target.value)}
            className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
            required
          >
            <option value="" disabled>— Select Team A —</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="teamBId">Team B</Label>
          <select
            id="teamBId"
            name="teamBId"
            value={teamBId}
            onChange={(e) => setTeamBId(e.target.value)}
            className="w-full h-9 rounded-md border border-zinc-700 bg-black/50 px-2"
            required
          >
            <option value="" disabled>— Select Team B —</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Round / BestOf */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="round">Round</Label>
          <Input
            id="round"
            name="round"
            type="number"
            min={1}
            value={round}
            onChange={(e) => setRound(parseInt(e.target.value || "1", 10))}
            required
          />
        </div>
        <div>
          <Label htmlFor="bestOf">Best Of</Label>
          <Input
            id="bestOf"
            name="bestOf"
            type="number"
            min={1}
            step={1}
            value={bestOf}
            onChange={(e) => setBestOf(parseInt(e.target.value || "1", 10))}
            required
          />
        </div>
      </div>

      {/* Date & Time (Pacific default) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date">Date (Pacific)</Label>
          <Input
            id="date"
            name="date_pacific"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time (Pacific)</Label>
          <Input
            id="time"
            name="time_pacific"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* UTC ISO that the server uses — computed from Pacific */}
      <input type="hidden" name="startAtIso" value={startAtIso} />

      {/* Live previews */}
      <div className="rounded-md border border-zinc-800 bg-black/40 p-3 text-sm">
        <div>Pacific (PT): <span className="font-mono">{startAtIso ? fmtPreview(startAtIso, PT) : "—"}</span></div>
        <div>Eastern (ET): <span className="font-mono">{startAtIso ? fmtPreview(startAtIso, ET) : "—"}</span></div>
        <div className="opacity-70">Saves as UTC to <code>startAt</code>: <span className="font-mono">{startAtIso || "—"}</span></div>
      </div>

      <Button type="submit" className="w-full">
        {mode === "create" ? "Create Match" : "Save Changes"}
      </Button>
    </form>
  );
}