import { createClient } from "@supabase/supabase-js";
import { isServer } from "./isServer";
import { ENV } from "./env.server";

if (!isServer()) {
  throw new Error("supabaseAdmin must only be imported on the server");
}

export const supabaseAdmin = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
