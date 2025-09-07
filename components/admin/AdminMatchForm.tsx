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
  action: (formData: FormData) => Promise<unknown>;
  initial: Initial;
};

function toLocalInputValue(iso: string | null) {
  if (!iso) return "";
  // datetime-local expects "YYYY-MM-DDTHH:mm" (local). Using ISO is fine as a starter.
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
    <form action={action} className="grid gap-4 rounded-md border border-zinc-700 bg-zinc-900 p-4">
      {/* id only used on edit */}
      <input type="hidden" name="id" defaultValue={initial.id} />

      <div className="grid gap-1">
        <label htmlFor="tournamentId" className="text-sm text-zinc-300">
          Tournament
        </label>
        <select
          id="tournamentId"
          name="tournamentId"
          defaultValue={initial.tournamentId}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
          required
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label htmlFor="teamAId" className="text-sm text-zinc-300">
          Team A
        </label>
        <select
          id="teamAId"
          name="teamAId"
          defaultValue={initial.teamAId ?? ""}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
          required
        >
          <option value="">— Select —</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label htmlFor="teamBId" className="text-sm text-zinc-300">
          Team B
        </label>
        <select
          id="teamBId"
          name="teamBId"
          defaultValue={initial.teamBId ?? ""}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
          required
        >
          <option value="">— Select —</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1">
          <label htmlFor="round" className="text-sm text-zinc-300">
            Round
          </label>
          <input
            id="round"
            name="round"
            type="number"
            min={1}
            defaultValue={initial.round ?? 1}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
            required
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="bestOf" className="text-sm text-zinc-300">
            Best Of
          </label>
          <input
            id="bestOf"
            name="bestOf"
            type="number"
            min={1}
            defaultValue={initial.bestOf ?? 1}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
            required
          />
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="startAtIso" className="text-sm text-zinc-300">
          Start (local)
        </label>
        <input
          id="startAtIso"
          name="startAtIso"
          type="datetime-local"
          defaultValue={toLocalInputValue(initial.startAtIso)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {mode === "edit" ? "Save Match" : "Create Match"}
        </button>
      </div>
    </form>
  );
}