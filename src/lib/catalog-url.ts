// Pure helpers for catalog URLs — no React, no Next.js, easy to test.

type CatalogParams = {
  kategori?: string;
  q?: string;
  halaman?: number;
};

export function buildCatalogHref({ kategori, q, halaman }: CatalogParams): string {
  const params = new URLSearchParams();
  if (kategori) params.set("kategori", kategori);
  if (q?.trim()) params.set("q", q.trim());
  if (halaman && halaman > 1) params.set("halaman", String(halaman));

  const query = params.toString();
  return query ? `/barang?${query}` : "/barang";
}

// ?halaman=abc, -3 or 0 all fall back to page 1
export function parsePageParam(value: string | undefined): number {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

// ?x=a&x=b arrives as an array — take the first one
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
