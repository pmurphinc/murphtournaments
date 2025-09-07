import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">User Options</h1>

      {!isAuthed ? (
        <p className="text-zinc-300">
          Please sign in to manage your team and tournament actions.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800">
          <li className="p-4 hover:bg-zinc-900/60">
            <Link href="/signup" className="text-cyan-400 underline underline-offset-4">
              Sign up for a tournament
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
      )}
    </div>
  );
}
