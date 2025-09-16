
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    return <div className="space-y-2"><h1 className="text-2xl">Admin</h1><p>Please sign in.</p></div>;
  }

  // List all tournaments and teams for management
  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">Tournaments</h2>
        <ul className="space-y-1">
          {tournaments.map(t => (
            <li key={t.id} className="border-b py-1 flex items-center justify-between">
              <span>{t.name}</span>
              <span className="text-xs text-gray-400">Status: {t.status}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Teams</h2>
        <ul className="space-y-1">
          {teams.map(team => (
            <li key={team.id} className="border-b py-1 flex items-center justify-between">
              <span>{team.name}</span>
              <span className="text-xs text-gray-400">Leader ID: {team.leaderId || 'N/A'}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Site Management</h2>
        <ul className="list-disc ml-6 text-sm text-gray-500">
          <li>Feature: Add/edit/delete tournaments (coming soon)</li>
          <li>Feature: Add/edit/delete teams (coming soon)</li>
          <li>Feature: Manage users (coming soon)</li>
        </ul>
      </section>
    </div>
  );
}
