import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Logo } from "../ui/Logo";
import { NanoBananaLogo } from "../ui/NanoBananaLogo";
import { Button } from "../ui/Button";
import { SegmentedControl } from "../ui/SegmentedControl";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Switch } from "../ui/Switch";
import { EmptyState } from "../ui/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs";
import { AccentSelector } from "../ui/AccentSelector";
import { ThemeProvider } from "../ui/ThemeContext";

describe("UI Components SSR rendering", () => {
  it("renders Logo container with icon and accessible attributes", () => {
    const html = renderToString(
      <Logo size="lg" glow icon={<span className="test-icon">Icon</span>} ariaLabel="App Logo" />
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="App Logo"');
    expect(html).toContain("test-icon");
    expect(html).toContain("w-12 h-12");
  });

  it("renders Logo with image source", () => {
    const html = renderToString(
      <Logo size="md" src="/logo.png" alt="Company Logo" />
    );
    expect(html).toContain("<img");
    expect(html).toContain('src="/logo.png"');
    expect(html).toContain('alt="Company Logo"');
  });

  it("renders NanoBananaLogo with accessible attributes", () => {
    const html = renderToString(<NanoBananaLogo size="md" glow ariaLabel="Brand Logo" />);
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Brand Logo"');
    expect(html).toContain("<svg");
  });

  it("renders NanoBananaLogo with custom children emblem", () => {
    const html = renderToString(
      <NanoBananaLogo size="md" ariaLabel="Custom Emblem">
        <span className="custom-icon">B</span>
      </NanoBananaLogo>
    );
    expect(html).toContain("custom-icon");
    expect(html).toContain(">B<");
  });

  it("renders Button with primary variant and text", () => {
    const html = renderToString(<Button variant="primary">Export Document</Button>);
    expect(html).toContain("Export Document");
    expect(html).toContain("bg-[var(--brand)]");
  });

  it("renders Button in loading state", () => {
    const html = renderToString(<Button loading>Loading</Button>);
    expect(html).toContain("animate-spin");
  });

  it("renders SegmentedControl with options and active indicator", () => {
    const items = [
      { id: "tab1", label: "General" },
      { id: "tab2", label: "Advanced", badge: 5 },
    ];
    const html = renderToString(
      <SegmentedControl items={items} value="tab1" onChange={() => {}} />
    );
    expect(html).toContain("General");
    expect(html).toContain("Advanced");
    expect(html).toContain("5");
    expect(html).toContain('aria-selected="true"');
  });

  it("renders Badge variants and dot indicator", () => {
    const html = renderToString(
      <Badge variant="brand" dot removable>
        Featured Tag
      </Badge>
    );
    expect(html).toContain("Featured Tag");
    expect(html).toContain("bg-[var(--brand-soft)]");
    expect(html).toContain("aria-hidden=\"true\"");
    expect(html).toContain("aria-label=\"Remove tag\"");
  });

  it("renders Card structure with title, content and footer", () => {
    const html = renderToString(
      <Card variant="default" hoverable>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent>Body content goes here.</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );
    expect(html).toContain("Section Title");
    expect(html).toContain("Body content goes here.");
    expect(html).toContain("Footer actions");
  });

  it("renders Input with label, helperText, and error state", () => {
    const normalHtml = renderToString(
      <Input label="Username" helperText="Enter your handle" />
    );
    expect(normalHtml).toContain("Username");
    expect(normalHtml).toContain("Enter your handle");

    const errorHtml = renderToString(
      <Input label="Email" error="Invalid email address" />
    );
    expect(errorHtml).toContain("Invalid email address");
    expect(errorHtml).toContain("aria-invalid=\"true\"");
  });

  it("renders Input with left icon ensuring paddingLeft overrides size padding", () => {
    const html = renderToString(
      <Input
        label="Search"
        iconLeft={<span className="search-icon">S</span>}
        size="md"
      />
    );
    expect(html).toContain("search-icon");
    expect(html).toContain("pl-9");
  });

  it("renders Textarea with character count limit", () => {
    const html = renderToString(
      <Textarea
        label="Summary"
        value="Short bio text"
        maxLength={200}
        showCount
        readOnly
      />
    );
    expect(html).toContain("Summary");
    expect(html).toContain("Short bio text");
    expect(html).toContain("14/200");
  });

  it("renders Switch with accessible role and labels", () => {
    const html = renderToString(
      <Switch
        checked={true}
        onChange={() => {}}
        label="Dark Canvas"
        description="Toggle dark background"
      />
    );
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-checked="true"');
    expect(html).toContain("Dark Canvas");
    expect(html).toContain("Toggle dark background");
  });

  it("renders EmptyState with icon, title, description, and action", () => {
    const html = renderToString(
      <EmptyState
        title="No Items Found"
        description="Try adjusting your search criteria"
        action={<Button size="sm">Create New</Button>}
      />
    );
    expect(html).toContain("No Items Found");
    expect(html).toContain("Try adjusting your search criteria");
    expect(html).toContain("Create New");
  });

  it("renders Tabs with tablist and active tabpanel", () => {
    const html = renderToString(
      <Tabs defaultValue="tabA">
        <TabsList ariaLabel="Test Tabs">
          <TabsTrigger value="tabA">Tab A</TabsTrigger>
          <TabsTrigger value="tabB">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="tabA">Content for Tab A</TabsContent>
        <TabsContent value="tabB">Content for Tab B</TabsContent>
      </Tabs>
    );
    expect(html).toContain('role="tablist"');
    expect(html).toContain("Tab A");
    expect(html).toContain("Tab B");
    expect(html).toContain("Content for Tab A");
    expect(html).not.toContain("Content for Tab B");
  });

  it("renders AccentSelector with all 7 signature themes", () => {
    const html = renderToString(
      <ThemeProvider defaultTheme="light" defaultAccent="teal">
        <AccentSelector variant="swatches" />
      </ThemeProvider>
    );
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain("Amber Gold");
    expect(html).toContain("Lateralis Teal");
    expect(html).toContain("Classic Royal Blue");
    expect(html).toContain("Executive Navy");
    expect(html).toContain("Forest Emerald");
    expect(html).toContain("Burgundy Rose");
    expect(html).toContain("Obsidian Slate");
  });
});
