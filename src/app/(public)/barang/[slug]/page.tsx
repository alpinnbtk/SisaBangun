import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATUS_LABEL, formatPrice, formatQuantity } from "@/lib/item-format";
import { getItemBySlug } from "@/lib/items";

export async function generateMetadata({ params }: PageProps<"/barang/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  return { title: item ? item.title : "Barang tidak ditemukan" };
}

export default async function ItemDetailPage({ params }: PageProps<"/barang/[slug]">) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) notFound();

  return (
    <article className="space-y-2">
      <p className="text-sm text-gray-500">
        {item.code} · {item.category.name} · {STATUS_LABEL[item.status]}
      </p>
      <h1 className="text-2xl font-bold">{item.title}</h1>
      <p>Stok: {formatQuantity(item.quantity, item.unit)}</p>
      <p className="font-semibold">{formatPrice(item.price_per_unit, item.unit)}</p>
      {item.description && <p className="text-gray-600">{item.description}</p>}
    </article>
  );
}
