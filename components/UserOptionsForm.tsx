"use client";
import { useState } from "react";

export type UserOptionsFormProps = {
  user: {
    embarkId?: string;
    region?: string;
    timezone?: string;
    platform?: string;
  };
  discordId: string;
};

export default function UserOptionsForm({ user, discordId }: UserOptionsFormProps) {
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const embarkId = formData.get('embarkId') as string;
    const region = formData.get('region') as string;
    const timezone = formData.get('timezone') as string;
    const platform = formData.get('platform') as string;
    await fetch('/api/account/update', {
      method: 'POST',
      body: JSON.stringify({ discordId, embarkId, region, timezone, platform }),
      headers: { 'Content-Type': 'application/json' },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form className="space-y-4 border border-zinc-800 rounded-lg p-4 mb-6" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 font-medium">Embark ID</label>
        <input
          type="text"
          name="embarkId"
          defaultValue={user?.embarkId ?? ''}
          className="w-full border rounded px-2 py-1 bg-black/40 text-white"
          minLength={3}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Region</label>
        <select
          name="region"
          defaultValue={user?.region ?? ''}
          className="w-full border rounded px-2 py-1 bg-black/40 text-white"
          required
        >
          <option value="">Select region</option>
          <option value="NA">NA</option>
          <option value="EU">EU</option>
          <option value="APAC">APAC</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Timezone</label>
        <select
          name="timezone"
          defaultValue={user?.timezone ?? ''}
          className="w-full border rounded px-2 py-1 bg-black/40 text-white"
          required
        >
          <option value="">Select timezone</option>
          <option value="UTC-8">UTC-8 (PST)</option>
          <option value="UTC-5">UTC-5 (EST)</option>
          <option value="UTC+0">UTC+0 (GMT)</option>
          <option value="UTC+1">UTC+1 (CET)</option>
          <option value="UTC+8">UTC+8 (CST)</option>
          <option value="UTC+9">UTC+9 (JST)</option>
          <option value="UTC+10">UTC+10 (AEST)</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Platform</label>
        <select
          name="platform"
          defaultValue={user?.platform ?? ''}
          className="w-full border rounded px-2 py-1 bg-black/40 text-white"
          required
        >
          <option value="">Select platform</option>
          <option value="PC">PC</option>
          <option value="Xbox">Xbox</option>
          <option value="PlayStation">PlayStation</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-cyan-600 text-white rounded mt-2"
      >
        Save
      </button>
      {saved && (
        <div className="mt-2 text-green-400 font-semibold transition-opacity">Saved!</div>
      )}
    </form>
  );
}
