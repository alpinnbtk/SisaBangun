import Image from "next/image";
import Link from "next/link";
import { CONDITION_LABEL, STATUS_LABEL, formatPrice, formatQuantity } from "@/lib/item-format";
import { photoUrl } from "@/lib/items";
import type { ItemStatus, ItemWithRelations } from "@/types/item";

const STATUS_STYLE: Record<ItemStatus, string> = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-yellow-100 text-yellow-800",
  sold: "bg-gray-200 text-gray-700",
};

export function ItemCard({ item }: { item: ItemWithRelations }) {
  const cover = item.photos[0];
  const isSold = item.status === "sold";

  return (
    <Link
      href={`/barang/${item.slug}`}
      className={`group block overflow-hidden rounded-lg border bg-white transition hover:shadow-md ${isSold ? "opacity-60" : ""}`}
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {cover ? (
          <Image
            src={photoUrl(cover.storage_path)}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Belum ada foto
          </div>
        )}
        <span
          className={`absolute top-2 left-2 rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>

      <div className="space-y-1 p-3">
        <p className="text-xs text-gray-500">
          {item.code} · {item.category.name}
        </p>
        <h3 className="leading-snug font-semibold group-hover:underline">{item.title}</h3>
        <p className="text-sm">Stok: {formatQuantity(item.quantity, item.unit)}</p>
        <p className="font-semibold text-green-700">
          {formatPrice(item.price_per_unit, item.unit)}
        </p>
        <p className="text-xs text-gray-500">
          {CONDITION_LABEL[item.condition]} · {item.location_area}
        </p>
      </div>
    </Link>
  );
}
