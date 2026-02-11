import { test, expect } from "@playwright/test";

test.describe("Splits Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/splits");
  });

  test("should display the splits title", async ({ page }) => {
    await expect(page.getByText("Split Times", { exact: true })).toBeVisible();
  });

  test("should generate splits for 5K with 1km intervals", async ({ page }) => {
    // Select 5K
    await page.getByRole("button", { name: /5K/ }).first().click();

    // Enter pace 5:00
    await page.getByLabel(/Enter pace/).fill("5:00");

    // Interval defaults to 1

    // Click Generate
    await page.getByRole("button", { name: "Generate Splits" }).click();

    // Should show 5 split rows
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(5);

    // First split should show 00:05:00
    await expect(rows.first()).toContainText("00:05:00");

    // Last split should show cumulative 00:25:00
    await expect(rows.last()).toContainText("00:25:00");
  });

  test("should generate splits with custom interval", async ({ page }) => {
    // Select 10K
    await page.getByRole("button", { name: /^10K/ }).first().click();

    // Enter pace 5:00
    await page.getByLabel(/Enter pace/).fill("5:00");

    // Change interval to 2.5
    const intervalInput = page.getByLabel(/Custom interval/);
    await intervalInput.clear();
    await intervalInput.fill("2.5");

    // Generate
    await page.getByRole("button", { name: "Generate Splits" }).click();

    // 10K / 2.5km = 4 splits
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(4);
  });

  test("should show error when fields are missing", async ({ page }) => {
    // Click Generate without filling fields
    await page.getByRole("button", { name: "Generate Splits" }).click();

    await expect(page.getByText("Please fill in at least two fields.")).toBeVisible();
  });
});
