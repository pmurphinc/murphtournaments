import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  use: { baseURL: "http://localhost:3000", trace: "retry-with-trace" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});