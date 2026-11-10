import { expect, test } from "@playwright/test";

const EXPLORER = "/lands/titled-lands-green-valley/explorer";

test.describe("Afro Arab smoke", () => {
  test("homepage hero, primary CTAs and footer credit", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Homes and titled land");
    await expect(page.getByRole("link", { name: /Explore estates/i }).first()).toBeVisible();
    const credit = page.getByRole("link", { name: "Aadam" });
    await expect(credit).toHaveAttribute("href", "https://aadambuilds.dev");
    await expect(credit).toHaveAttribute("target", "_blank");
  });

  test("mobile menu opens, traps focus and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /Payment plans/ })).toBeVisible();
    // Focus moves into the menu in the same effect that wires up Escape.
    await expect(menu.getByRole("link", { name: /Home/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });

  test("primary pages render a single h1", async ({ page }) => {
    for (const path of ["/projects", "/lands", "/payment-plans", "/plotline", "/company", "/faq", "/contact", "/privacy"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveCount(1);
    }
  });

  test("unknown routes return the branded 404", async ({ page }) => {
    const res = await page.goto("/this-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("isn't on the map");
  });

  test("plot explorer: search opens the plot panel and updates the URL", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(EXPLORER);
    await page.getByLabel("Go to plot number").fill("14");
    await page.getByRole("button", { name: "Go", exact: true }).click();
    const panel = page.getByRole("complementary", { name: "14" });
    await expect(panel).toBeVisible();
    await expect(panel.getByText(/Suggested home/)).toBeVisible();
    await expect(page).toHaveURL(/plot=14/);
  });

  test("plot explorer: ?plot= deep link and unknown plot message", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${EXPLORER}?plot=3`);
    await expect(page.getByRole("complementary", { name: "3" })).toBeVisible();
    await page.getByLabel("Go to plot number").fill("999");
    await page.getByRole("button", { name: "Go", exact: true }).click();
    await expect(page.locator("#plot-search-error")).toContainText("No plot 999");
  });

  test("plot explorer: filters change the match count", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(EXPLORER);
    await page.getByRole("button", { name: "Filters" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Find a plot" });
    await expect(dialog).toContainText("58 of 58 plots match");
    await dialog.getByRole("button", { name: "Corner plots" }).click();
    await expect(dialog).not.toContainText("58 of 58");
  });

  test("enquiry API accepts valid payload", async ({ request }) => {
    const res = await request.post("/api/enquiries", {
      data: {
        fullName: "Test Buyer",
        phone: "+233200000000",
        email: "buyer@example.com",
        message: "Interested in a viewing",
        consent: true,
        intent: "plot",
        projectSlug: "titled-lands-green-valley",
        plotCode: "14",
      },
    });
    expect(res.ok()).toBeTruthy();
  });
});
