export * from "../signup/actions";

"use server";
export const runtime = "nodejs";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // admin writes only

export async function handleRegistration(formData: FormData) {
	const reqId = `reg_${Date.now()}`;
	try {
		const teamName = String(formData.get("teamName") || "").trim();
		if (!teamName) {
			console.error(`[${reqId}] Missing teamName`);
			return { ok: false, error: "Team name is required." };
		}

		// Example write — replace with your schema
		const { error } = await supabaseAdmin.from("teams").insert({ name: teamName });
		if (error) {
			console.error(`[${reqId}] Supabase insert error:`, error);
			throw new Error("DB write failed");
		}

		revalidatePath("/teams");
		return { ok: true };
	} catch (err) {
		console.error(`[${reqId}] handleRegistration failed:`, err);
		return { ok: false, error: "Registration failed. Please try again." };
	}
}
