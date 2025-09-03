import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { askQuestionSchema } from "@/lib/validators";
import { getClientIp } from "@/lib/utils";
import { rateLimit } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

async function askQuestion(formData: FormData, headers: Headers) {
  "use server";
  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");
  const ip = getClientIp(headers);
  const rl = rateLimit(ip, "qna", 15, 60000);
  if (!rl.ok) throw new Error("Slow down");

  const raw = {
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    tags: ((formData.get("tags") as string) || "").split(",").map(s => s.trim()).filter(Boolean),
    tournamentId: (formData.get("tournamentId") as string) || undefined
  };
  const parsed = askQuestionSchema.parse(raw);
  const q = await prisma.question.create({
    data: { authorId: (session.user as any).id, tournamentId: parsed.tournamentId, title: parsed.title, body: parsed.body, tags: parsed.tags }
  });

  const supa = createClient();
  await supa.channel("realtime:qna").send({ type: "broadcast", event: "question:new", payload: { id: q.id } });

  return { ok: true, id: q.id };
}

export default async function QnaPage() {
  const session = await auth();
  const items = await prisma.question.findMany({ orderBy: { id: "desc" }, take: 50 });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        <h1 className="text-2xl">Q&A / Help Desk</h1>
        <ul className="space-y-2">
          {items.map(q => (
            <li key={q.id} className="border border-zinc-800 rounded p-3 hover:border-cyber-gold">
              <Link href={`/qna/${q.id}`} className="text-cyber-neon">{q.title}</Link>
              <div className="mt-1 text-xs opacity-70">{q.tags.join(", ")} • {q.status}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl">Ask a question</h2>
        {!session?.user && <p className="opacity-70 text-sm">Sign in with Discord to ask.</p>}
        <form action={askQuestion}>
          <label className="sr-only" htmlFor="title">Title</label>
          <Input id="title" name="title" placeholder="Title" required />
          <label className="sr-only" htmlFor="body">Body</label>
          <Textarea id="body" name="body" placeholder="Describe your issue..." required />
          <label className="sr-only" htmlFor="tags">Tags</label>
          <Input id="tags" name="tags" placeholder="Tags (comma separated)" />
          <Button type="submit" className="mt-2 w-full">Submit</Button>
        </form>
      </div>
    </div>
  );
}