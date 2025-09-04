"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/signup", label: "Sign-Up" },
  { href: "/qna", label: "Q&A" },
  { href: "/schedule", label: "Schedule" },
  { href: "/rules", label: "Rules" },
];

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 font-bold text-black">
            MT
          </div>
          <span className="font-mono text-lg tracking-tight whitespace-nowrap">
            Murph Tournaments
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href ? "text-white" : "text-zinc-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/api/auth/signin"
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-800"
          >
            Sign in
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center justify-center rounded-md p-2.5 text-zinc-200 hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 md:hidden"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-zinc-800/60 bg-black/95">
          <nav className="mx-auto grid max-w-6xl gap-2 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base ${
                  pathname === item.href ? "bg-zinc-800 text-white" : "text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/api/auth/signin"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-lg border border-zinc-700 px-3 py-2 text-base text-zinc-100 hover:bg-zinc-800"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
