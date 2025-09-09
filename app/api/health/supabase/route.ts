import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  const result: any = { ok: true, checks: {} };
  try {
    // Admin-only call; lists 1 user to prove the service key works.
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    result.checks.adminAuth = { ok: !error, error: error?.message ?? null, count: data?.users?.length ?? 0 };
    if (error) result.ok = false;
  } catch (e: any) {
    result.ok = false;
    result.checks.adminAuth = { ok: false, error: e?.message ?? "unknown" };
  }
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
