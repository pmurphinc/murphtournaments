import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditTeamPage() {
  const session = await auth();
  if (!session?.user) return <div className="p-4">Please sign in.</div>;
  // Find the user's team (as owner or member)
  const userId = (session.user as any).id;
  const team = await prisma.team.findFirst({
    where: {
      members: { some: { userId } },
    },
    include: {
      members: { include: { user: true } },
    },
  });

  if (!team) {
    return <div className="p-4">You are not a member of any team.</div>;
  }

  // Simple form to edit team name (owner only)
  const isOwner = team.ownerId === userId;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Edit Team</h1>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Team Name:</span>{" "}
          {isOwner ? (
            <form action={async (formData) => {
              "use server";
              const name = formData.get("teamName") as string;
              await prisma.team.update({ where: { id: team.id }, data: { name } });
            }}>
              <input
                type="text"
                name="teamName"
                defaultValue={team.name}
                className="border rounded px-2 py-1 bg-black/40 text-white"
                minLength={3}
                required
              />
              <button type="submit" className="ml-2 px-3 py-1 bg-cyan-600 text-white rounded">Save</button>
            </form>
          ) : (
            <span>{team.name}</span>
          )}
        </div>
        <div>
          <span className="font-semibold">Members:</span>
          <ul className="mt-2 space-y-1">
            {team.members.map((m) => (
              <li key={m.id} className="flex items-center gap-2">
                <span>{m.user.displayName}</span>
                <span className="text-xs text-zinc-400">({m.role})</span>
                {isOwner && m.role !== "OWNER" && (
                  <form action={async () => {
                    "use server";
                    await prisma.teamMember.delete({ where: { id: m.id } });
                  }}>
                    <button type="submit" className="ml-2 px-2 py-0.5 text-xs bg-red-700 text-white rounded">Remove</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
