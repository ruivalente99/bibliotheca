import { describe, it, expect } from "vitest";
import { cn, generateId } from "../ui/utils";

describe("ui/utils", () => {
  it("merges class names correctly", () => {
    const result = cn("text-red-500", "bg-black", false && "hidden");
    expect(result).toBe("text-red-500 bg-black");
  });

  it("resolves Tailwind CSS conflicts using twMerge", () => {
    const result = cn("p-2", "p-6", "text-sm", "text-lg");
    expect(result).toBe("p-6 text-lg");
  });

  it("generates unique ids with prefix", () => {
    const id1 = generateId("doc");
    const id2 = generateId("doc");
    expect(id1.startsWith("doc-")).toBe(true);
    expect(id2.startsWith("doc-")).toBe(true);
    expect(id1).not.toBe(id2);
  });
});
