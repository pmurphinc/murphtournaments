# Murph Tournaments Ops

Dark, cyberpunk dashboard for frictionless team sign-ups, centralized Q&A, and live tournament ops for **THE FINALS**.

## Stack
- Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Auth: Discord OAuth (next-auth v5)
- Data: Prisma + Postgres (Supabase)
- Realtime: Supabase Realtime channels
- Charts: Recharts
- Deploy: Supabase (DB) + Vercel (web)
- Quality: Zod, ESLint/Prettier, Vitest, Playwright

## Local Dev (short)
1. Create **.env.local** from `.env.example` and fill values.
2. `pnpm i`
3. `pnpm db:push && pnpm db:migrate && pnpm db:seed`
4. `pnpm dev` → http://localhost:3000

See full step-by-step guide in chat thread.