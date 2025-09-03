type Bucket = { count: number; ts: number };
const buckets = new Map<string, Bucket>();
const WINDOW = 60000;
const MAX = 20;
export function rateLimit(ip: string, key: string, max = MAX, windowMs = WINDOW) {
  const composite = `${ip}:${key}`;
  const now = Date.now();
  const b = buckets.get(composite);
  if (!b || now - b.ts > windowMs) { buckets.set(composite, { count: 1, ts: now }); return { ok: true, remaining: max - 1 }; }
  if (b.count >= max) return { ok: false, remaining: 0 };
  b.count++; return { ok: true, remaining: max - b.count };
}