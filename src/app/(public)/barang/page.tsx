import type { Metadata } from "next";
import Link from "next/link";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ItemCard } from "@/components/ItemCard";
import { Pagination } from "@/components/Pagination";
import { SearchBox } from "@/components/SearchBox";
import { buildCatalogHref, firstParam, parsePageParam } from "@/lib/catalog-url";
import { getCategories, getItems } from "@/lib/items";

export async function generateMetadata({ searchParams }: PageProps<"/barang">): Promise<Metadata> {
  const params = await searchParams;
  const q = firstParam(params.q)?.trim();
  if (q) return { title: `Cari “${q}” — Katalog` };

  const slug = firstParam(params.kategori);
  const category = (await getCategories()).find((c) => c.slug === slug);
  return { title: category ? `${category.name} — Katalog` : "Katalog" };
}

export default async function CatalogPage({ searchParams }: PageProps<"/barang">) {
  const params = await searchParams;
  const requested = firstParam(params.kategori);
  const q = firstParam(params.q)?.trim() ?? "";
  const page = parsePageParam(firstParam(params.halaman));

  const categories = await getCategories();
  const active = categories.find((c) => c.slug === requested); // unknown slug → "Semua"
  const kategori = active?.slug;

  const { items, total, totalPages } = await getItems({ categorySlug: kategori, search: q, page });

  const heading = q ? `Hasil untuk “${q}”` : active ? active.name : "Semua barang";

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{heading}</h1>
        <p className="text-sm text-gray-500">{total} barang</p>
      </div>

      <SearchBox defaultValue={q} kategori={kategori} />
      <CategoryFilter categories={categories} activeSlug={kategori} search={q} />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          {page > 1 ? (
            <>
              <p>Halaman ini tidak ada.</p>
              <Link
                href={buildCatalogHref({ kategori, q })}
                className="mt-2 inline-block underline"
              >
                Kembali ke halaman pertama
              </Link>
            </>
          ) : q ? (
            <>
              <p>Tidak ada barang yang cocok dengan “{q}”.</p>
              <Link href={buildCatalogHref({ kategori })} className="mt-2 inline-block underline">
                Hapus pencarian
              </Link>
            </>
          ) : (
            <>
              <p>Belum ada barang di kategori ini.</p>
              <Link href="/barang" className="mt-2 inline-block underline">
                Lihat semua barang
              </Link>
            </>
          )}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} kategori={kategori} q={q} />
    </section>
  );
}
