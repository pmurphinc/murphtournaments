// Server-only env validation. Do NOT import in client components.
import { isServer } from "./isServer";

if (!isServer()) {
  throw new Error("env.server imported on the client. Import server env only from server code.");
}

const must = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

export const ENV = {
  SUPABASE_URL: must("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: must("SUPABASE_SERVICE_ROLE_KEY"),
  NEXT_PUBLIC_SUPABASE_URL: must("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: must("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
};

/**
 * Vercel (Production & Preview) — set:
 *  SUPABASE_URL
 *  SUPABASE_SERVICE_ROLE_KEY        (server-only)
 *  NEXT_PUBLIC_SUPABASE_URL         (public)
 *  NEXT_PUBLIC_SUPABASE_ANON_KEY    (public)
 *  DATABASE_URL
 *  NEXTAUTH_URL
 *  NEXTAUTH_SECRET
 *  DISCORD_CLIENT_ID
 *  DISCORD_CLIENT_SECRET
 *
 * Local sync:
 *   npx vercel env pull .env.local
 */
