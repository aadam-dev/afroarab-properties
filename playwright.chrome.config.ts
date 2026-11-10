import base from "./playwright.config";
import { defineConfig, devices } from "@playwright/test";

/** Local run against installed Google Chrome (no Playwright browser download). */
export default defineConfig({
  ...base,
  projects: [{ name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
});
