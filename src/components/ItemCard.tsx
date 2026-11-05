import Image from "next/image";
import Link from "next/link";
import { CONDITION_LABEL, formatPrice, formatQuantity } from "@/lib/item-format";
import { photoUrl } from "@/lib/items";
import { StatusBadge } from "./StatusBadge";
import type { ItemWithRelations } from "@/types/item";

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
        <StatusBadge status={item.status} className="absolute top-2 left-2" />
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
