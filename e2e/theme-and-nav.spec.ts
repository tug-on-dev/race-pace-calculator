import { test, expect } from "@playwright/test";

test.describe("Theme Switching", () => {
  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/en");

    // Click theme dropdown
    await page.getByLabel("Theme").click();

    // Click Dark
    await page.getByRole("menuitem", { name: "Dark" }).click();

    // HTML should have dark class
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should toggle light mode", async ({ page }) => {
    await page.goto("/en");

    // Click theme dropdown
    await page.getByLabel("Theme").click();

    // Click Light
    await page.getByRole("menuitem", { name: "Light" }).click();

    // HTML should have light class
    await expect(page.locator("html")).toHaveClass(/light/);
  });
});

test.describe("Navigation", () => {
  test("should navigate between calculator and splits", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Race Pace Calculator")).toBeVisible();

    // Click splits link
    await page.getByRole("link", { name: "Splits" }).click();
    await expect(page.getByText("Split Times", { exact: true })).toBeVisible();

    // Click calculator link
    await page.getByRole("link", { name: "Calculator" }).click();
    await expect(page.getByText("Race Pace Calculator")).toBeVisible();
  });
});

test.describe("Mobile Viewport", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("should show hamburger menu on mobile", async ({ page }) => {
    await page.goto("/en");

    // Desktop nav links should be hidden
    await expect(page.locator("nav").getByRole("link", { name: "Calculator" })).toBeHidden();

    // Hamburger should be visible
    await page.getByLabel("Toggle menu").click();

    // Mobile nav should appear
    await expect(page.getByRole("link", { name: "Calculator" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Splits" })).toBeVisible();
  });

  test("should navigate via mobile menu", async ({ page }) => {
    await page.goto("/en");

    // Open mobile menu
    await page.getByLabel("Toggle menu").click();

    // Click Splits
    await page.getByRole("link", { name: "Splits" }).click();

    await expect(page.getByText("Split Times", { exact: true })).toBeVisible();
  });
});
