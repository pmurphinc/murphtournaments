"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function MiniBarChart({ data, dataKey }: { data: any[]; dataKey: string }) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" hide /><YAxis hide /><Tooltip /><Bar dataKey={dataKey} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}