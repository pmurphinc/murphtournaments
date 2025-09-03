import { auth } from "./auth";
export async function requireRole(minRole: "USER" | "STAFF" | "ADMIN") {
  const session = await auth();
  const role = (session?.user as any)?.role ?? "USER";
  const order = { USER: 0, STAFF: 1, ADMIN: 2 } as const;
  if (!session || order[role] < order[minRole]) throw new Error("Forbidden");
  return session;
}