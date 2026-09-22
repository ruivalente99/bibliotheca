import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Field, UploadZone, Progress, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui";

describe("Field Component", () => {
  it("renders label, hint and input correctly", () => {
    const html = renderToString(
      <Field label="Full Name" description="Your legal name" htmlFor="name-input">
        <input id="name-input" type="text" />
      </Field>
    );

    expect(html).toContain("Full Name");
    expect(html).toContain("Your legal name");
    expect(html).toContain('id="name-input"');
    expect(html).toContain('for="name-input"');
  });

  it("displays required asterisk and error message", () => {
    const html = renderToString(
      <Field label="Email" required error="Email is invalid">
        <input type="email" />
      </Field>
    );

    expect(html).toContain("*");
    expect(html).toContain('role="alert"');
    expect(html).toContain("Email is invalid");
  });
});

describe("UploadZone Component", () => {
  it("renders upload area with title and description", () => {
    const html = renderToString(
      <UploadZone
        onFilesSelected={() => {}}
        title="Upload Image"
        description="PNG or JPG up to 5MB"
      />
    );

    expect(html).toContain("Upload Image");
    expect(html).toContain("PNG or JPG up to 5MB");
    expect(html).toContain('role="button"');
  });

  it("renders preview image and clear button when previewUrl is supplied", () => {
    const html = renderToString(
      <UploadZone
        onFilesSelected={() => {}}
        previewUrl="https://example.com/test.png"
        onClear={() => {}}
      />
    );

    expect(html).toContain('src="https://example.com/test.png"');
    expect(html).toContain('aria-label="Remove image"');
  });
});

describe("Progress Component", () => {
  it("renders determinate progress bar with accessible role and attributes", () => {
    const html = renderToString(
      <Progress value={45} max={100} label="Uploading" showValueLabel />
    );

    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="45"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain("45%");
    expect(html).toContain("Uploading");
  });

  it("handles indeterminate mode correctly", () => {
    const html = renderToString(<Progress indeterminate label="Processing" />);

    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuetext="Loading..."');
    expect(html).not.toContain("aria-valuenow=");
  });
});

describe("Accordion Component", () => {
  it("renders accordion structure with WAI-ARIA attributes", () => {
    const html = renderToString(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(html).toContain("Section 1");
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain("Content 1");
    expect(html).toContain("Section 2");
    expect(html).toContain('aria-expanded="false"');
  });
});
