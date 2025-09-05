// components/LocalTime.tsx
"use client";
import { useMemo } from "react";

export default function LocalTime({
  iso,
  withTz = true,
  options,
}: {
  iso: string;
  withTz?: boolean;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = useMemo(() => new Date(iso), [iso]);
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        ...options,
      }),
    [options]
  );
  const text = fmt.format(d);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <time dateTime={iso} title={iso}>
      {text}
      {withTz ? ` (${tz})` : ""}
    </time>
  );
}