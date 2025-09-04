// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SystemBar } from "@/components/SystemBar";
import Navbar from "@/components/Nav"; // <-- new responsive navbar

export const metadata: Metadata = {
  title: "Murph Tournaments",
  description: "Frictionless sign-ups, Q&A, and live ops for THE FINALS.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // optional:
  // maximumScale: 1,
  // viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
       <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background text-foreground font-mono antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black/70 text-cyber-neon px-3 py-1 rounded"
        >
          Skip to content
        </a>

        <SystemBar />

        {/* New mobile-first, sticky navbar */}
        <Navbar />

        <main id="main" className="max-w-7xl mx-auto px-4 py-6">{children}</main>

        <div aria-live="polite" aria-atomic="true" className="sr-only" id="live-region"></div>
      </body>
    </html>
  );
}
