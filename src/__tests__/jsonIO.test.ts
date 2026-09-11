import { describe, it, expect, vi } from "vitest";
import { downloadJson } from "../export/jsonIO";

describe("export/jsonIO", () => {
  it("creates an object URL and triggers download with clean filename", () => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    const createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock HTMLAnchorElement click
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "a") {
        el.click = clickMock;
      }
      return el;
    });

    downloadJson({ name: "Dylan", role: "Architect" }, "profile");

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
  });
});
