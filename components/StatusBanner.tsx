"use client";

import { useEffect, useMemo, useState } from "react";
import { LiveDot } from "./LiveDot";

type TournyStatus =
  | "DRAFT"
  | "REGISTRATION"
  | "LOCKED"   // full + closed, waiting
  | "CHECKIN"
  | "LIVE"
  | "FINISHED"
  | "ARCHIVED";

type Props = {
  tournament:
    | {
        name: string;
        status: TournyStatus;
        startsAt: Date | string | null;
        checkInOpensAt?: Date | string | null;
      }
    | null;
};

// Sept 5, 2025 @ 6:00 PM PT == 2025-09-06T01:00:00Z
const FALLBACK_START_ISO = "2025-09-06T01:00:00.000Z";
const CHECKIN_MINUTES_BEFORE = 30; // flip to CHECK-IN this many minutes before start

const STATUS_STYLE: Record<TournyStatus | "CLOSED", string> = {
  DRAFT: "bg-zinc-900 border-zinc-700",
  REGISTRATION: "bg-emerald-900/40 border-emerald-700 text-emerald-200",
  LOCKED: "bg-amber-900/30 border-amber-500/60 text-amber-300",
  CHECKIN: "bg-cyan-900/40 border-cyan-700 text-cyan-200",
  LIVE: "bg-red-900/40 border-red-700 text-red-200",
  FINISHED: "bg-zinc-900 border-zinc-700",
  ARCHIVED: "bg-zinc-900 border-zinc-700",
  CLOSED: "bg-zinc-900/60 border-yellow-500/40 text-yellow-300",
};

function fmtTZ(d: Date, tz: string, label: "PT" | "ET") {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${f} ${label}`;
}

function countdown(to: Date) {
  const diff = +to - Date.now();
  if (diff <= 0) return "Starting soon";
  const secs = Math.floor(diff / 1000);
  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function StatusBanner({ tournament }: Props) {
  // Parse times
  const dbStart = tournament?.startsAt ? new Date(tournament.startsAt) : null;
  const start = dbStart ?? new Date(FALLBACK_START_ISO);

  const explicitCheckIn = tournament?.checkInOpensAt
    ? new Date(tournament.checkInOpensAt)
    : null;
  const computedCheckIn = new Date(
    start.getTime() - CHECKIN_MINUTES_BEFORE * 60_000
  );
  const checkInAt = explicitCheckIn ?? computedCheckIn;

  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Time-based status with DB as baseline
  const status = useMemo<TournyStatus>(() => {
    if (now >= start) return "LIVE";
    if (now >= checkInAt) return "CHECKIN";
    return (tournament?.status ?? "DRAFT") as TournyStatus;
  }, [now, start, checkInAt, tournament?.status]);

  const leftLabel =
    status === "LOCKED" ? "LOCKED — REGISTRATION FULL" : status;

  const whenPT = fmtTZ(start, "America/Los_Angeles", "PT");
  const whenET = fmtTZ(start, "America/New_York", "ET");
  const cd = countdown(start);

  return (
    <section
      role="status"
      aria-live="polite"
      className={`border px-4 py-3 rounded-lg shadow-glow-gold flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${STATUS_STYLE[status]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs opacity-70 tracking-wide">Tournament Status</span>
        <span className="text-xl font-bold tracking-widest flex items-center gap-2">
          {status === "LIVE" && <LiveDot />}
          {leftLabel}
        </span>
      </div>

      <div className="flex flex-col md:items-end text-sm">
        <div className="opacity-90">
          {tournament?.name ?? "Upcoming Tournament"}
        </div>
        <div className="opacity-90">Starts {whenPT} &nbsp;/&nbsp; {whenET}</div>
        <div className="text-xs opacity-70">
          {status === "LIVE" ? "Match in progress" : `Countdown: ${cd}`}
        </div>
      </div>
    </section>
  );
}
