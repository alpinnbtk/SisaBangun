import type { Metadata } from "next";
import Link from "next/link";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ItemCard } from "@/components/ItemCard";
import { getCategories, getItems } from "@/lib/items";

// ?kategori=a&kategori=b arrives as an array — take the first one
function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: PageProps<"/barang">): Promise<Metadata> {
  const slug = firstParam((await searchParams).kategori);
  const category = (await getCategories()).find((c) => c.slug === slug);
  return { title: category ? `${category.name} — Katalog` : "Katalog" };
}

export default async function CatalogPage({ searchParams }: PageProps<"/barang">) {
  const requested = firstParam((await searchParams).kategori);
  const categories = await getCategories();
  const active = categories.find((c) => c.slug === requested); // unknown slug → treated as "Semua"
  const items = await getItems({ categorySlug: active?.slug });

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{active ? active.name : "Semua barang"}</h1>
        <p className="text-sm text-gray-500">{items.length} barang</p>
      </div>

      <CategoryFilter categories={categories} activeSlug={active?.slug} />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          <p>Belum ada barang di kategori ini.</p>
          <Link href="/barang" className="mt-2 inline-block underline">
            Lihat semua barang
          </Link>
        </div>
      )}
    </section>
  );
}
