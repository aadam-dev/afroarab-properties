import { expect, test } from "@playwright/test";
import path from "node:path";

test.describe("Afro Arab smoke", () => {
  test("homepage brand and primary CTA", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByText("Properties").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Everyone can buy a house",
    );
    await page.locator('img[alt*="Lamin"]').waitFor({ state: "visible" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join("docs", "qa", "home-1440x900.png"),
      fullPage: false,
    });
  });

  test("mobile homepage viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByText("Properties").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join("docs", "qa", "home-390x844.png"),
      fullPage: false,
    });
  });

  test("tablet projects viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Greater Accra");
    await page.locator("main img").first().waitFor({ state: "visible" });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join("docs", "qa", "projects-768x1024.png"),
      fullPage: false,
    });
  });

  test("plot explorer shareable URL and enquiry consent", async ({ page }) => {
    await page.goto("/lands/titled-lands-green-valley/explorer?plot=1");
    await expect(page.getByRole("heading", { name: "Demo Estate" })).toBeVisible();
    await expect(page.getByText("Plot 1").first()).toBeVisible();
    await expect(page.getByText(/Data Protection Act/i)).toBeVisible();
  });

  test("enquiry API accepts valid payload", async ({ request }) => {
    const res = await request.post("/api/enquiries", {
      data: {
        fullName: "Test Buyer",
        phone: "+233200000000",
        email: "buyer@example.com",
        message: "Interested in a viewing",
        consent: true,
        intent: "viewing",
        projectSlug: "cephas-court",
      },
    });
    expect(res.ok()).toBeTruthy();
  });
});
