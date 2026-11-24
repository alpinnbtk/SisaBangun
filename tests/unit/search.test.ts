import { describe, expect, it } from "vitest";
import { toIlikeFilterValue } from "@/lib/search";

describe("toIlikeFilterValue", () => {
  it("wraps a plain term as a quoted contains-pattern", () => {
    expect(toIlikeFilterValue("pipa")).toBe('"%pipa%"');
  });

  it("collapses whitespace", () => {
    expect(toIlikeFilterValue("  pipa   pvc ")).toBe('"%pipa pvc%"');
  });

  it("keeps commas and parentheses (safe inside quotes)", () => {
    expect(toIlikeFilterValue("1,7 (besi)")).toBe('"%1,7 (besi)%"');
  });

  it("strips characters with special meaning", () => {
    expect(toIlikeFilterValue('100%"_*\\')).toBe('"%100%"');
  });

  it("neutralizes a filter-injection attempt", () => {
    expect(toIlikeFilterValue('pipa"),title.eq.x')).toBe('"%pipa ),title.eq.x%"');
  });

  it("returns null for empty or junk-only input", () => {
    expect(toIlikeFilterValue(undefined)).toBeNull();
    expect(toIlikeFilterValue("   ")).toBeNull();
    expect(toIlikeFilterValue('%%""')).toBeNull();
  });

  it("caps the length at 50 characters", () => {
    expect(toIlikeFilterValue("a".repeat(80))).toBe(`"%${"a".repeat(50)}%"`);
  });
});
