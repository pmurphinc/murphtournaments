// components/Admin/Matches/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// Legacy match/tournamentEntry logic removed. This page is deprecated with the new schema.
export default function AdminMatchesPage() {
  return (
    <div className="p-8 text-center text-zinc-400">
      <h1 className="text-2xl mb-4">Admin: Matches</h1>
      <p>This page is deprecated. Match and tournament entry logic has been removed in the new schema.</p>
    </div>
  );
}