import { auth } from "@/lib/auth";

export default async function InviteToTeamPage() {
  const session = await auth();
  if (!session?.user) return <div className="p-4">Please sign in.</div>;
  return (
    <div className="mx-auto max-w-3xl space-y-3 p-4">
      <h1 className="text-2xl font-semibold">Invite User to Team</h1>
      <p className="text-zinc-300">Placeholder page — implement invite flow here.</p>
    </div>
  );
}
