import { test, expect } from "@playwright/test";

test.describe("Editor Components E2E", () => {
  test("BuilderHeader renders brand titles, lema and actions", async ({ page, isMobile }) => {
    await page.goto("/iframe.html?id=editor-builderheader--papyrus-resume&viewMode=story");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Papyrus — Architectura Vitae")).toBeVisible();
    await expect(page.getByText("CURRICULUM VITAE & PROFILES")).toBeVisible();
    if (!isMobile) {
      await expect(page.getByText("Auto-saved")).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "JSON" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Exportar" })).toBeVisible();
  });

  test("SectionCard supports collapsing and expanding", async ({ page }) => {
    await page.goto("/iframe.html?id=editor-sectioncard--default&viewMode=story");
    const card = page.locator("#section-personal");
    await expect(card).toBeVisible();
    await expect(page.getByText("Informações Pessoais")).toBeVisible();

    const input = page.locator('input[placeholder="Ex: Dylan Valente"]');
    await expect(input).toBeVisible();

    // Collapse
    const collapseBtn = page.getByRole("button", { name: "Collapse section" });
    await collapseBtn.click();
    await expect(input).not.toBeVisible();

    // Expand
    const expandBtn = page.getByRole("button", { name: "Expand section" });
    await expandBtn.click();
    await expect(input).toBeVisible();
  });

  test("SplitEditorLayout syncs preview section click with form highlight", async ({ page, isMobile }) => {
    await page.goto("/iframe.html?id=editor-spliteditorlayout--interactive-sync-demo&viewMode=story");

    if (isMobile) {
      await page.getByRole("button", { name: "Preview" }).click({ force: true });
    }

    // Click on "Experiência" section in the preview sheet
    const previewExp = page.getByText("Senior Tech Lead — 2022–Presente");
    await previewExp.click();

    if (isMobile) {
      await page.getByRole("button", { name: "Edit" }).click({ force: true });
    }

    // Corresponding form section should receive the highlight ring
    const formExpCard = page.locator("#section-experience");
    await expect(formExpCard).toHaveClass(/ring-2 (ring-\[var\(--brand\)\]|ring-amber-500)/);
  });
});
