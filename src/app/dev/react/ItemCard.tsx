import type { ReactNode } from "react";
import { STATUS_LABEL, type Item } from "./data";

type ItemCardProps = {
  item: Item;
  children?: ReactNode; // ≈ Vue <slot>
};

export function ItemCard({ item, children }: ItemCardProps) {
  const isSold = item.status === "sold";
  const price =
    item.pricePerUnit === null
      ? "Nego"
      : `Rp${item.pricePerUnit.toLocaleString("id-ID")} / ${item.unit}`;

  return (
    <article className={`rounded-lg border p-4 ${isSold ? "opacity-50" : ""}`}>
      <p className="text-xs text-gray-500">{item.code}</p>
      <h3 className="font-semibold">{item.title}</h3>
      <p>
        Stok: {item.quantity} {item.unit}
      </p>
      <p>{price}</p>
      <span className="text-sm">{STATUS_LABEL[item.status]}</span>
      {children}
    </article>
  );
}
