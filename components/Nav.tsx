"use client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

export function Nav({ session }: { session: any }) {
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/signup", label: "Sign-Up" },
    { href: "/qna", label: "Q&A" },
    { href: "/t/september-showdown", label: "Schedule" },
    { href: "/rules", label: "Rules" }
  ];
  return (
    <nav className="flex items-center gap-4">
      {links.map(l => <Link key={l.href} href={l.href} className="hover:text-cyber-neon">{l.label}</Link>)}
      {session?.user ? (
        <>
          <Link href="/admin" className="hover:text-cyber-gold">Admin</Link>
          <button onClick={() => signOut()} className="hover:text-cyber-red">Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn("discord")} className="hover:text-cyber-neon">Sign in</button>
      )}
    </nav>
  );
}