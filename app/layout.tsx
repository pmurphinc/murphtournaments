import "./globals.css";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { SystemBar } from "@/components/SystemBar";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Murph Tournaments",
  description: "Frictionless sign-ups, Q&A, and live ops for THE FINALS."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground font-mono antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black/70 text-cyber-neon px-3 py-1 rounded">
          Skip to content
        </a>
        <SystemBar />
        <header className="border-b border-cyber-gold/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Murph Tournaments" className="h-8 w-8" />
              <span className="text-xl tracking-wide">Murph Tournaments</span>
            </Link>
            <Nav session={session} />
          </div>
        </header>
        <main id="main" className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <div aria-live="polite" aria-atomic="true" className="sr-only" id="live-region"></div>
      </body>
    </html>
  );
}