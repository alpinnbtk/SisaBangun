import type { Metadata } from "next";
import { ItemCard } from "@/components/ItemCard";
import { getItems } from "@/lib/items";

export const metadata: Metadata = { title: "Katalog" };

export default async function CatalogPage() {
  const items = await getItems();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Katalog</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
