import { test, expect } from "@playwright/test";

test.describe("Calculator Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("should display the calculator title", async ({ page }) => {
    await expect(page.getByText("Race Pace Calculator")).toBeVisible();
  });

  test("should display all preset distance buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^5K\b/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^10K\b/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Half Marathon/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Marathon/ })).toBeVisible();
  });

  test("should calculate time from distance and pace", async ({ page }) => {
    // Select 5K
    await page.getByRole("button", { name: /5K/ }).first().click();

    // Enter pace 5:00 min/km
    await page.getByLabel(/Enter pace/).fill("5:00");

    // Click Calculate
    await page.getByRole("button", { name: "Calculate" }).click();

    // Verify result: 5km * 5:00/km = 25:00 = 00:25:00
    await expect(page.getByTestId("result-value")).toContainText("00:25:00");
  });

  test("should calculate pace from distance and time", async ({ page }) => {
    // Select 10K
    await page.getByRole("button", { name: /^10K/ }).first().click();

    // Enter time 50:00
    await page.getByLabel(/Enter time/).fill("00:50:00");

    // Click Calculate
    await page.getByRole("button", { name: "Calculate" }).click();

    // Verify result: 10km in 50min = 5:00 min/km
    await expect(page.getByTestId("result-value")).toContainText("05:00");
  });

  test("should calculate distance from pace and time", async ({ page }) => {
    // Enter pace 5:00
    await page.getByLabel(/Enter pace/).fill("5:00");

    // Enter time 25:00
    await page.getByLabel(/Enter time/).fill("00:25:00");

    // Click Calculate
    await page.getByRole("button", { name: "Calculate" }).click();

    // 25min / 5min per km = 5.00 km
    await expect(page.getByTestId("result-value")).toContainText("5.00");
  });

  test("should show error when less than 2 fields filled", async ({ page }) => {
    // Only enter pace
    await page.getByLabel(/Enter pace/).fill("5:00");

    // Click Calculate
    await page.getByRole("button", { name: "Calculate" }).click();

    // Should show error
    await expect(page.getByText("Please fill in at least two fields.")).toBeVisible();
  });

  test("should reset all fields", async ({ page }) => {
    // Fill fields
    await page.getByRole("button", { name: /5K/ }).first().click();
    await page.getByLabel(/Enter pace/).fill("5:00");

    // Click Reset
    await page.getByRole("button", { name: "Reset" }).click();

    // Fields should be empty
    await expect(page.getByLabel(/Enter pace/)).toHaveValue("");
  });

  test("should handle custom distance", async ({ page }) => {
    // Click Custom
    await page.getByRole("button", { name: "Custom" }).click();

    // Enter custom distance
    await page.getByLabel(/Distance/).fill("7.5");

    // Enter pace
    await page.getByLabel(/Enter pace/).fill("6:00");

    // Calculate
    await page.getByRole("button", { name: "Calculate" }).click();

    // 7.5km * 6:00/km = 45:00 = 00:45:00
    await expect(page.getByTestId("result-value")).toContainText("00:45:00");
  });

  test("should switch to imperial units", async ({ page }) => {
    // Click Imperial
    await page.getByRole("radio", { name: /Imperial/ }).click();

    // Select Marathon
    await page.getByRole("button", { name: /^Marathon/ }).click();

    // Should show distance in miles (~26.22)
    const distInput = page.getByLabel(/Distance \(mi\)/);
    await expect(distInput).toBeVisible();
  });

  test("should recalculate when switching units", async ({ page }) => {
    // Select 5K metric
    await page.getByRole("button", { name: /5K/ }).first().click();

    // Switch to imperial
    await page.getByRole("radio", { name: /Imperial/ }).click();

    // Distance should be converted to miles (~3.11)
    const distInput = page.getByLabel(/Distance \(mi\)/);
    const value = await distInput.inputValue();
    expect(parseFloat(value)).toBeCloseTo(3.11, 1);
  });
});
