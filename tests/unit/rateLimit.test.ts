import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rateLimit";
describe("rateLimit", () => {
  it("allows within window", () => {
    const r = rateLimit("1.1.1.1", "test", 2, 1000);
    expect(r.ok).toBe(true);
    const r2 = rateLimit("1.1.1.1", "test", 2, 1000);
    expect(r2.ok).toBe(true);
    const r3 = rateLimit("1.1.1.1", "test", 2, 1000);
    expect(r3.ok).toBe(false);
  });
});