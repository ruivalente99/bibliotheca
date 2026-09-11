import { test, expect } from "@playwright/test";

test.describe("UI Components E2E", () => {
  test("NanoBananaLogo renders properly in all sizes", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-nanobananalogo--all-sizes&viewMode=story");
    const logos = page.locator('div[role="img"]');
    await expect(logos).toHaveCount(4);
    await expect(logos.first()).toBeVisible();
  });

  test("Button renders variants, clicks and respects loading state", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-button--all-variants&viewMode=story");
    const primaryBtn = page.getByRole("button", { name: "Primary", exact: true });
    await expect(primaryBtn).toBeVisible();
    await expect(primaryBtn).toBeEnabled();

    const loadingBtn = page.getByRole("button", { name: "Loading", exact: true });
    await expect(loadingBtn).toBeDisabled();
    await expect(loadingBtn.locator(".animate-spin")).toBeVisible();
  });

  test("SegmentedControl switches tabs interactively", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-segmentedcontrol--editor-tabs&viewMode=story");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(5);

    // Initial active tab: 'Ajustes'
    await expect(tabs.filter({ hasText: "Ajustes" })).toHaveAttribute("aria-selected", "true");

    // Click 'Fundo' tab
    const fundoTab = tabs.filter({ hasText: "Fundo" });
    await fundoTab.click();
    await expect(fundoTab).toHaveAttribute("aria-selected", "true");
    await expect(tabs.filter({ hasText: "Ajustes" })).toHaveAttribute("aria-selected", "false");
  });

  test("ThemeSelector opens dropdown and changes selection", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-themeselector--dropdown&viewMode=story");
    const trigger = page.locator("button[aria-expanded]");
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const darkOption = page.getByRole("button", { name: "Dark" });
    await expect(darkOption).toBeVisible();
    await darkOption.click();

    // Dropdown closes after selection
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Toast and ConfirmDialog opens, handles escape and confirm", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-toast-confirmdialog--default&viewMode=story");

    // Click toast trigger
    const toastSuccessBtn = page.getByRole("button", { name: "Toast Sucesso" });
    await toastSuccessBtn.click();

    // Floating toast should appear
    const toast = page.locator('div[aria-live="polite"]');
    await expect(toast).toContainText("Alterações guardadas automaticamente.");

    // Click Confirm Dialog trigger
    const confirmBtn = page.getByRole("button", { name: "Abrir Confirmação Assíncrona" });
    await confirmBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Eliminar Documento?");

    // Test Escape key dismissal
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(toast).toContainText("Ação cancelada pelo utilizador.");
  });
});
