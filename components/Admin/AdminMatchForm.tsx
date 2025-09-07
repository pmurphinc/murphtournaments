// components/Admin/AdminMatchForm.tsx
import * as React from "react";

type Option = { id: string; name: string };

type Initial = {
  id: string;
  tournamentId: string;
  teamAId: string | null;
  teamBId: string | null;
  round: number;
  bestOf: number;
  startAtIso: string | null;
};

type Props = {
  mode: "create" | "edit";
  tournaments: Option[];
  teams: Option[];
  // ⬇ allow the page action to return anything, but we'll coerce to void on the form
  action: (formData: FormData) => void | Promise<any>;
  initial: Initial;
};

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

export default function AdminMatchForm({
  mode,
  tournaments,
  teams,
  initial,
  action,
}: Props) {
  return (
    // ⬇ wrap the passed-in action so the form sees Promise<void>
    <form
      action={async (fd) => {
        await action(fd);
      }}
      className="grid gap-4 rounded-md border border-zinc-700 bg-zinc-900 p-4"
    >
      {/* id only used on edit */}
      <input type="hidden" name="id" defaultValue={initial.id} />

      <div className="grid gap-1">
        <label htmlFor="tournamentId" className="text-sm text-zinc-300">Tournament</label>
        <select
          id="tournamentId"
          name="tournamentId"
          defaultValue={initial.tournamentId}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
          required
        >
          {tournaments.map((t) => (
            <option key={
