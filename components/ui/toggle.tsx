"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Toggle({ pressed, onPressedChange, children }: { pressed: boolean; onPressedChange: (v: boolean) => void; children: React.ReactNode; }) {
  return (
    <button aria-pressed={pressed} onClick={() => onPressedChange(!pressed)}
      className={cn("px-3 py-1 rounded border text-xs", pressed ? "border-cyber-neon text-cyber-neon shadow-glow" : "border-zinc-700 hover:border-cyber-gold hover:text-cyber-gold")}>
      {children}
    </button>
  );
}