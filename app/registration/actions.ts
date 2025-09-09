// app/registration/actions.ts
"use server";
export const runtime = "nodejs";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function handleRegistration(formData: FormData) {
  const reqId = `reg_${Date.now()}`;
  try {
    const name = String(formData.get("teamName") || "").trim();
    const ownerId = String(formData.get("ownerId") || "").trim(); // e.g., from session or hidden input
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);

    if (!name) return { ok: false, error: "Team name is required." };
    if (!ownerId) return { ok: false, error: "Owner is required." };

    console.info("[info] Team insert payload:", { name, ownerId, slug });

    const { error } = await supabaseAdmin
      .from("teams")
      .insert({ name, owner_id: ownerId, slug }); // adjust column names to your schema

    if (error) {
      console.error("[error] Supabase team insert error:", error);
      throw new Error(`Failed to create team: ${error.message}`);
    }

    revalidatePath("/teams");
    return { ok: true };
  } catch (err) {
    console.error("[error] handleRegistration failed:", err);
    return { ok: false, error: "Registration failed. Please try again." };
  }
}