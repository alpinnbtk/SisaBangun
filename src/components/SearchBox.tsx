"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { buildCatalogHref } from "@/lib/catalog-url";

type SearchBoxProps = {
  defaultValue: string;
  kategori?: string;
};

export function SearchBox({ defaultValue, kategori }: SearchBoxProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  // Debounce: update the URL 300 ms after the user stops typing.
  // Every keystroke resets the timer via the cleanup function (Day 5 pattern).
  useEffect(() => {
    if (value.trim() === defaultValue.trim()) return;

    const id = setTimeout(() => {
      startTransition(() => {
        // replace, not push: one history entry per search, not per keystroke
        router.replace(buildCatalogHref({ kategori, q: value }), { scroll: false });
      });
    }, 300);

    return () => clearTimeout(id);
  }, [value, defaultValue, kategori, router]);

  return (
    // Also works without JavaScript: a plain GET form submitted with Enter
    <form action="/barang" role="search" className="relative">
      {kategori && <input type="hidden" name="kategori" value={kategori} />}
      <label htmlFor="catalog-search" className="sr-only">
        Cari barang
      </label>
      <input
        id="catalog-search"
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari: pipa, engsel, SB-0003…"
        autoComplete="off"
        className="min-h-11 w-full rounded-lg border bg-white px-4 pr-24 text-base"
      />
      {isPending && (
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
          Mencari…
        </span>
      )}
    </form>
  );
}
