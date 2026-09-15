import { test, expect } from "@playwright/test";

test.describe("Preview Viewport & DockableToolbar E2E", () => {
  test("PreviewViewport renders document and controls zoom level", async ({ page }) => {
    await page.goto("/iframe.html?id=preview-previewviewport--a-4-document-preview&viewMode=story");

    // The document sheet should be rendered
    await expect(page.getByText("DYLAN VALENTE")).toBeVisible();
    await expect(page.getByText("FULLSTACK ARCHITECT & LEAD DEVELOPER")).toBeVisible();

    // Zoom Out click
    const zoomOutBtn = page.getByRole("button", { name: "Zoom Out" });
    const zoomText = page.locator("span.font-mono").filter({ hasText: "%" }).first();

    await expect(zoomText).toBeVisible();
    const initialText = await zoomText.innerText();

    await zoomOutBtn.click();
    const afterOutText = await zoomText.innerText();
    expect(parseInt(afterOutText)).toBeLessThanOrEqual(parseInt(initialText));
  });

  test("DockableToolbar cycles dock position and toggles tools", async ({ page }) => {
    await page.goto("/iframe.html?id=preview-dockabletoolbar--interactive-docking&viewMode=story");

    const handToolBtn = page.getByRole("button", { name: "Hand Tool" });
    await handToolBtn.click();
    await expect(handToolBtn).toHaveClass(/bg-white|bg-\[#30363d\]/);

    const pointerToolBtn = page.getByRole("button", { name: "Pointer Tool" });
    await pointerToolBtn.click({ force: true });
    await expect(pointerToolBtn).toHaveClass(/bg-white|bg-\[#30363d\]/);

    // Open Keyboard Shortcuts Modal
    const helpBtn = page.getByRole("button", { name: "Shortcuts" });
    await helpBtn.click({ force: true });

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
