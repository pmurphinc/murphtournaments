// components/Nav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/AuthButton";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
  { href: "/rules", label: "Rules" },
  { href: "/registration", label: "Team Registration" },
];

export default function Nav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90">
          <Image
            src="/logo.svg"
            alt="Murph Tournaments"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
          />
          <span className="font-mono text-lg tracking-tight whitespace-nowrap">
            Murph Tournaments
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`text-sm transition-colors ${
                pathname === it.href
                  ? "text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {it.label}
            </Link>
          ))}

          {/* Auth button (Discord sign-in or avatar) */}
          <AuthButton />
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center justify-center rounded-md p-2.5 text-zinc-200 hover:bg-zinc-800/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 md:hidden"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
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
        <div
          id="mobile-menu"
          className="md:hidden border-t border-zinc-800/60 bg-black/95"
        >
          <nav className="mx-auto grid max-w-6xl gap-2 px-4 py-3">
            {LINKS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base ${
                  pathname === it.href
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                {it.label}
              </Link>
            ))}

            {/* Auth button on mobile */}
            <div className="mt-2">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}