import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CreateTeamPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/account");
  }

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startAt: "asc" },
    select: { id: true, name: true },
  });

  async function createTeam(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const leaderId = formData.get("leaderId") as string;
    const member1Id = formData.get("member1Id") as string;
    const member2Id = formData.get("member2Id") as string;
    const member3Id = formData.get("member3Id") as string;
    const substituteId = formData.get("substituteId") as string;
    const tournamentId = formData.get("tournamentId") as string;

    await prisma.team.create({
      data: {
        name,
        logoUrl: logoUrl || undefined,
        leaderId,
        member1Id: member1Id || undefined,
        member2Id: member2Id || undefined,
        member3Id: member3Id || undefined,
        substituteId: substituteId || undefined,
        tournamentId: tournamentId || undefined,
      } as any,
    });
    redirect("/account");
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Team</h1>
      <form action={createTeam} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" name="name" className="w-full border rounded px-2 py-1 bg-black/40 text-white" minLength={3} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Logo URL</label>
          <input type="url" name="logoUrl" className="w-full border rounded px-2 py-1 bg-black/40 text-white" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Leader Embark ID</label>
          <input type="text" name="leaderId" className="w-full border rounded px-2 py-1 bg-black/40 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Member 1 Embark ID</label>
          <input type="text" name="member1Id" className="w-full border rounded px-2 py-1 bg-black/40 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Member 2 Embark ID</label>
          <input type="text" name="member2Id" className="w-full border rounded px-2 py-1 bg-black/40 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Member 3 Embark ID</label>
          <input type="text" name="member3Id" className="w-full border rounded px-2 py-1 bg-black/40 text-white" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Substitute Embark ID</label>
          <input type="text" name="substituteId" className="w-full border rounded px-2 py-1 bg-black/40 text-white" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tournament</label>
          <select name="tournamentId" className="w-full border rounded px-2 py-1 bg-black/40 text-white" required>
            <option value="">Select tournament</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded mt-2">Create Team</button>
      </form>
    </div>
  );
}
