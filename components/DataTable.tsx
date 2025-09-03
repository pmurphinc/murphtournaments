import { ReactNode } from "react";
export function DataTable({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto border border-zinc-800 rounded-lg"><table className="min-w-full text-sm">{children}</table></div>;
}