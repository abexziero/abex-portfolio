import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
export default defineConfig({
  testDir: "./tests/e2e", fullyParallel: false, workers: 1, timeout: 30_000,
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: { command: `node node_modules/next/dist/bin/next start --port ${new URL(baseURL).port || "3000"}`, url: `${baseURL}/id`, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
