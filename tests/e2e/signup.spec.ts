import { test, expect } from "@playwright/test";
test("user can visit signup page", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "Team Sign-Up" })).toBeVisible();
});