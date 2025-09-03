export async function verifyTurnstile(token?: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  try { return true; } catch { return false; }
}