import { test, expect } from "@playwright/test";

test.describe("Language Switching", () => {
  test("should display English content on /en", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Race Pace Calculator")).toBeVisible();
    await expect(page.getByRole("button", { name: "Calculate" })).toBeVisible();
  });

  test("should display French content on /fr", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.getByText("Calculateur d'Allure")).toBeVisible();
    await expect(page.getByRole("button", { name: "Calculer" })).toBeVisible();
  });

  test("should switch from English to French via language menu", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Race Pace Calculator")).toBeVisible();

    // Click language dropdown
    await page.getByLabel("Language").click();

    // Click French
    await page.getByRole("menuitem", { name: "Français" }).click();

    // Should now show French
    await expect(page.getByText("Calculateur d'Allure")).toBeVisible();
    await expect(page).toHaveURL(/\/fr/);
  });

  test("should switch from French to English via language menu", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.getByText("Calculateur d'Allure")).toBeVisible();

    // Click language dropdown
    await page.getByLabel("Langue").click();

    // Click English
    await page.getByRole("menuitem", { name: "English" }).click();

    await expect(page.getByText("Race Pace Calculator")).toBeVisible();
    await expect(page).toHaveURL(/\/en/);
  });

  test("should preserve language on splits page", async ({ page }) => {
    await page.goto("/fr/splits");
    await expect(page.getByText("Temps de Passage", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Générer les Splits" })).toBeVisible();
  });
});
