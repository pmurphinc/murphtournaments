import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InviteToTeamPage() {
  const session = await auth();
  if (!session?.user) return <div className="p-4">Please sign in.</div>;
  // Find the user's team
  const userId = (session.user as any).id;
  const team = await prisma.team.findFirst({
    where: {
      members: { some: { userId } },
    },
  });

  if (!team) {
    return <div className="p-4">You are not a member of any team.</div>;
  }

  // Generate invite link (simple: /registration?invite=teamId)
  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://murphtournaments.vercel.app"}/registration?invite=${team.id}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Invite User to Team</h1>
      <p className="text-zinc-300">Share this link with your friend. When they sign up, they'll be added to your team:</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inviteUrl}
          readOnly
          className="w-full px-2 py-1 border rounded bg-black/40 text-white"
        />
        <button
          type="button"
          className="px-3 py-1 bg-cyan-600 text-white rounded"
          onClick={() => navigator.clipboard.writeText(inviteUrl)}
        >
          Copy
        </button>
      </div>
      <p className="text-xs text-zinc-400 mt-2">Anyone with this link can join your team. You can remove members from the Edit Team page.</p>
    </div>
  );
}
