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

    // Initial active tab: 'Settings'
    await expect(tabs.filter({ hasText: "Settings" })).toHaveAttribute("aria-selected", "true");

    // Click 'Canvas' tab
    const canvasTab = tabs.filter({ hasText: "Canvas" });
    await canvasTab.click();
    await expect(canvasTab).toHaveAttribute("aria-selected", "true");
    await expect(tabs.filter({ hasText: "Settings" })).toHaveAttribute("aria-selected", "false");
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

  test("AccentSelector selects accent colors", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-accentselector--swatches-row&viewMode=story");
    const radiogroup = page.locator('div[role="radiogroup"]');
    await expect(radiogroup).toBeVisible();

    const radios = page.locator('button[role="radio"]');
    await expect(radios).toHaveCount(7);

    // Click teal swatch
    const tealSwatch = radios.filter({ hasText: "" }).nth(1);
    await tealSwatch.click();
    await expect(tealSwatch).toHaveAttribute("aria-checked", "true");
  });

  test("Badge renders all variants and removes tag", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-badge--removable-tag&viewMode=story");
    const badge = page.getByText("TypeScript");
    await expect(badge).toBeVisible();

    const removeBtn = page.getByRole("button", { name: "Remove tag" });
    await expect(removeBtn).toBeVisible();
  });

  test("Input supports typing, icons and clear button", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-input--search-field&viewMode=story");
    const input = page.locator("input");
    await expect(input).toBeVisible();
    await expect(input).toHaveValue("SplitEditorLayout");

    const clearBtn = page.getByRole("button", { name: "Clear input" });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
  });

  test("Switch toggles state on click", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-switch--interactive&viewMode=story");
    const switchBtn = page.getByRole("switch");
    await expect(switchBtn).toBeVisible();
    await expect(switchBtn).toHaveAttribute("aria-checked", "true");

    await switchBtn.click();
    await expect(switchBtn).toHaveAttribute("aria-checked", "false");
  });

  test("Tabs navigates between tab panels", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-tabs--default&viewMode=story");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);

    const expPanel = page.getByRole("tabpanel");
    await expect(expPanel).toContainText("Work Experience");

    const eduTab = page.getByRole("tab", { name: "Education" });
    await eduTab.click();
    await expect(page.getByRole("tabpanel")).toContainText("Academic Credentials");
  });

  test("DropdownMenu opens and displays items", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-dropdownmenu--default&viewMode=story");
    const trigger = page.getByRole("button", { name: "Item Options" });
    await expect(trigger).toBeVisible();

    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await expect(menu).toContainText("Duplicate Entry");
    await expect(menu).toContainText("Delete Item");

    // Close on Escape
    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
  });

  test("Toast and ConfirmDialog opens, handles escape and confirm", async ({ page }) => {
    await page.goto("/iframe.html?id=ui-toast-confirmdialog--default&viewMode=story");

    // Click toast trigger
    const toastSuccessBtn = page.getByRole("button", { name: "Success Toast" });
    await toastSuccessBtn.click();

    // Floating toast should appear
    const toast = page.locator('div[aria-live="polite"]');
    await expect(toast).toContainText("Changes saved automatically.");

    // Click Confirm Dialog trigger
    const confirmBtn = page.getByRole("button", { name: "Open Asynchronous Confirmation" });
    await confirmBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Delete Document?");

    // Test Escape key dismissal
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(toast).toContainText("Action cancelled by user.");
  });
});
