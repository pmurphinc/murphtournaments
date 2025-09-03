import { prisma } from "@/lib/prisma";
export default async function RulesPage() {
  const t = await prisma.tournament.findFirst({ orderBy: { startsAt: "desc" } });
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Rules</h1>
      <pre className="whitespace-pre-wrap">{t?.rules ?? "No triple stacking classes. No cheating, exploiting, or stream sniping."}</pre>
    </article>
  );
}