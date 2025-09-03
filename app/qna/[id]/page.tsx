import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { postDiscordWebhook } from "@/lib/discord";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { revalidatePath } from "next/cache";

async function addAnswer(formData: FormData): Promise<void> {
  "use server";

  const session = await auth();
  if (!session) throw new Error("Sign in required");

  const qid = String(formData.get("questionId") ?? "");
  const body = String(formData.get("body") ?? "");
  const official = formData.get("official") === "on";

  // Only staff can mark an answer as Official
  if (official) await requireRole("STAFF");

  const a = await prisma.answer.create({
    data: {
      questionId: qid,
      authorId: (session.user as any).id,
      body,
      official,
    },
  });

  if (official) {
    await prisma.question.update({
      where: { id: qid },
      data: { status: "ANSWERED", officialAnswerId: a.id },
    });
    // Optional: send a Discord notice
    await postDiscordWebhook(`**Official Answer** posted: /qna/${qid}`);
  }

  // IMPORTANT: return nothing (void). Revalidate the page so the new answer shows.
  revalidatePath(`/qna/${qid}`);
}

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const q = await prisma.question.findUnique({ where: { id: params.id }, include: { answers: { include: { author: true } } } });
  if (!q) return <div>Not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">{q.title}</h1>
      <div className="text-sm opacity-90">{q.body}</div>
      <div className="text-xs opacity-70">Tags: {q.tags.join(", ")}</div>

      <div className="space-y-3">
        <h2 className="text-xl">Answers</h2>
        <ul className="space-y-2">
          {q.answers.map(a => (
            <li key={a.id} className={a.official ? "border rounded p-3 border-cyber-gold" : "border rounded p-3 border-zinc-800"}>
              <div className="text-sm">{a.body}</div>
              <div className="text-xs opacity-60 mt-1">{a.author.discordId} {a.official && "• Official"}</div>
            </li>
          ))}
        </ul>
      </div>

      <form action={addAnswer} className="space-y-2">
        <input type="hidden" name="questionId" value={q.id} />
        <Textarea name="body" required placeholder="Write an answer..." />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="official" /> Mark as Official (staff)
        </label>
        <Button type="submit">Post Answer</Button>
      </form>
    </div>
  );
}