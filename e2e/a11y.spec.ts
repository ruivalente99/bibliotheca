import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility (a11y) WCAG 2.1 Audits", () => {
  const storiesToAudit = [
    { id: "ui-logo--all-sizes", name: "Logo" },
    { id: "ui-nanobananalogo--all-sizes", name: "NanoBananaLogo" },
    { id: "ui-button--all-variants", name: "Button" },
    { id: "ui-segmentedcontrol--editor-tabs", name: "SegmentedControl" },
    { id: "ui-themeselector--dropdown", name: "ThemeSelector" },
    { id: "ui-accentselector--swatches-row", name: "AccentSelector" },
    { id: "ui-badge--all-variants", name: "Badge" },
    { id: "ui-card--default", name: "Card" },
    { id: "ui-input--default", name: "Input" },
    { id: "ui-textarea--default", name: "Textarea" },
    { id: "ui-switch--interactive", name: "Switch" },
    { id: "ui-emptystate--default", name: "EmptyState" },
    { id: "ui-tabs--default", name: "Tabs" },
    { id: "ui-dropdownmenu--default", name: "DropdownMenu" },
    { id: "editor-builderheader--papyrus-resume", name: "BuilderHeader" },
    { id: "editor-sectioncard--default", name: "SectionCard" },
    { id: "preview-dockabletoolbar--interactive-docking", name: "DockableToolbar" },
  ];

  for (const story of storiesToAudit) {
    test(`A11y audit for ${story.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForLoadState("networkidle");

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include("#storybook-root")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // Disable color-contrast checks on simulated storybook iframes where ambient backdrop can vary
        .disableRules(["color-contrast"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
