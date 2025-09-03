// app/qna/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Do NOT export this; server action must return void
async function askQuestion(formData: FormData): Promise<void> {
  "use server";

  const session = await auth();
  if (!session || !(session.user as any)?.id) throw new Error("Sign in required");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const rawTags = String(formData.get("tags") ?? "").trim();

  const tags =
    rawTags ? rawTags.split(",").map(t => t.trim()).filter(Boolean) : [];

  const q = await prisma.question.create({
    data: { title, body, tags, authorId: (session.user as any).id },
  });

  revalidatePath("/qna");
  redirect(`/qna/${q.id}`);
}

export default async function QnaPage() {
  const session = await auth();

  const questions = await prisma.question.findMany({
    orderBy: { id: "desc" },              // <-- CHANGED: no createdAt
    select: {
      id: true,
      title: true,
      tags: true,
      answers: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-mono">Q&amp;A</h1>
        <p className="text-sm opacity-70">
          Ask questions about rules, format, scheduling, or tech. Staff can mark official answers.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl">Ask a question</h2>
        {!session?.user && <p className="opacity-70 text-sm">Sign in with Discord to ask.</p>}

        <form action={askQuestion} className="space-y-3">
          <label className="sr-only" htmlFor="title">Title</label>
          <Input id="title" name="title" placeholder="Title" required />

          <label className="sr-only" htmlFor="body">Body</label>
          <Textarea id="body" name="body" placeholder="Describe your question…" required />

          <Input name="tags" placeholder="tags (comma separated, e.g. Rules, Format)" />

          <Button type="submit" disabled={!session?.user}>Ask</Button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl">Recent questions</h2>
        {questions.length === 0 ? (
          <p className="opacity-70">No questions yet.</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q.id} className="border border-zinc-800 rounded p-3 hover:border-cyan-700 transition">
                <Link href={`/qna/${q.id}`} className="font-medium hover:underline">
                  {q.title}
                </Link>
                <div className="text-xs opacity-70 mt-1">
                  {q.tags?.length ? q.tags.join(", ") : "no tags"} • {q.answers.length} answer{q.answers.length === 1 ? "" : "s"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
