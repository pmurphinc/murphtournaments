// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // pick one depending on what you're testing:
    environment: "node", // for utils like rateLimit
    // environment: "jsdom", // for React components
    globals: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
});
