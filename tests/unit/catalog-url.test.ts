import { describe, expect, it } from "vitest";
import { buildCatalogHref, firstParam, parsePageParam } from "@/lib/catalog-url";

describe("buildCatalogHref", () => {
  it("returns the bare path when there are no params", () => {
    expect(buildCatalogHref({})).toBe("/barang");
  });

  it("omits page 1 to keep URLs canonical", () => {
    expect(buildCatalogHref({ halaman: 1 })).toBe("/barang");
  });

  it("combines category, search and page", () => {
    expect(buildCatalogHref({ kategori: "pipa-plumbing", q: "pvc", halaman: 2 })).toBe(
      "/barang?kategori=pipa-plumbing&q=pvc&halaman=2",
    );
  });

  it("trims and encodes the search term", () => {
    expect(buildCatalogHref({ q: "  pipa pvc  " })).toBe("/barang?q=pipa+pvc");
  });

  it("drops a blank search term", () => {
    expect(buildCatalogHref({ q: "   " })).toBe("/barang");
  });
});

describe("parsePageParam", () => {
  it.each([
    [undefined, 1],
    ["2", 2],
    ["abc", 1],
    ["-3", 1],
    ["0", 1],
    ["2.7", 2],
  ])("parses %s as %i", (input, expected) => {
    expect(parsePageParam(input)).toBe(expected);
  });
});

describe("firstParam", () => {
  it("takes the first value of a repeated param", () => {
    expect(firstParam(["a", "b"])).toBe("a");
    expect(firstParam("a")).toBe("a");
    expect(firstParam(undefined)).toBeUndefined();
  });
});
