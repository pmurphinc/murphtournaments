import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditTeamPage() {
  const session = await auth();
  if (!session?.user) return <div className="p-4">Please sign in.</div>;
    // Find the user's team (new schema: user has one team, no members array)
    const userId = (session.user as any).id;
    const team = await prisma.team.findFirst({
      where: { leaderId: userId },
    });

    if (!team) {
      return <div className="p-4">You do not own a team.</div>;
    }

    return (
      <div className="mx-auto max-w-3xl space-y-6 p-4">
        <h1 className="text-2xl font-semibold">Edit Team</h1>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Team Name:</span>{" "}
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
          </div>
          <div>
            <span className="font-semibold">Members:</span>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center gap-2">
                <span>{session.user.name}</span>
                <span className="text-xs text-zinc-400">(Owner)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
}
