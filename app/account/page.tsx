

import { User as PrismaUser } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  const isAuthed = !!session?.user;
  let user: PrismaUser | null = null;
  const discordId = session?.user?.id;
  if (isAuthed && discordId) {
    user = await prisma.user.findUnique({
      where: { discordId },
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">User Options</h1>

      {!isAuthed ? (
        <p className="text-zinc-300">
          Please sign in to manage your team and tournament actions.
        </p>
      ) : (
        <>
          <form
            className="space-y-4 border border-zinc-800 rounded-lg p-4 mb-6"
            action={async (formData) => {
              'use server';
              const embarkId = formData.get('embarkId') as string;
              const region = formData.get('region') as string;
              const timezone = formData.get('timezone') as string;
              const platform = formData.get('platform') as string;
              if (!discordId) return;
              // Cast region and platform to their respective enums
              await prisma.user.update({
                where: { discordId },
                data: {
                  embarkId,
                  region,
                  timezone,
                  platform,
                } as any,
              });
            }}
          >
            <div>
              <label className="block mb-1 font-medium">Embark ID</label>
              <input
                type="text"
                name="embarkId"
                defaultValue={(user as any)?.embarkId ?? ''}
                className="w-full border rounded px-2 py-1 bg-black/40 text-white"
                minLength={3}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Region</label>
              <select
                name="region"
                defaultValue={(user as any)?.region ?? ''}
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
                defaultValue={(user as any)?.timezone ?? ''}
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
                defaultValue={(user as any)?.platform ?? ''}
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
          </form>

          <ul className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800">
            <li className="p-4 hover:bg-zinc-900/60">
              <Link href="/teams/create" className="text-cyan-400 underline underline-offset-4">
                Create team
              </Link>
            </li>
            <li className="p-4 hover:bg-zinc-900/60">
              <Link href="/teams/edit" className="text-cyan-400 underline underline-offset-4">
                Edit team
              </Link>
            </li>
            <li className="p-4 hover:bg-zinc-900/60">
              <Link href="/teams/invite" className="text-cyan-400 underline underline-offset-4">
                Invite user to team
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
