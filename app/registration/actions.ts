// Team registration actions deleted.
"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { auth } from "@/lib/auth"; // adjust path if yours differs

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);
}

export async function handleRegistration(formData: FormData) {
  // 1) require login
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be logged in." };
  }

  // 2) read form field (make sure your input has name="teamName")
  const name = String(formData.get("teamName") || "").trim();
  if (!name) return { ok: false, error: "Team name is required." };

  const ownerId = String(session.user.id); // FK -> users.id (string)
  const slug = slugify(name);

  // 3) DO THE INSERT (this is the “line” in context)
  const { data, error } = await supabaseAdmin
    .from("teams")
    .insert({ name, slug, ownerId })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase teams insert error:", error);
    return { ok: false, error: "Failed to create team." };
  }

  revalidatePath("/teams");
  return { ok: true, teamId: data.id };
}