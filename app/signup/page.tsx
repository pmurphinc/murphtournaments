// app/signup/page.tsx
export const dynamic = "force-dynamic";

import "server-only";
import Link from "next/link";
import TeamSignupForm from "@/components/signup/TeamSignupForm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

// ⬇️ Import server actions from a separate module
import { handleSignup } from "./actions";

// Team registration page deleted as requested.
export default function SignUpPage() {
  return <div className="p-8 text-center text-zinc-400">Team registration is now disabled.</div>;
}
