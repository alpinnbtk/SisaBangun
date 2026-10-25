import type { ItemCondition, ItemStatus, ItemUnit } from "@/types/item";

export const STATUS_LABEL: Record<ItemStatus, string> = {
  available: "Tersedia",
  reserved: "Dipesan",
  sold: "Terjual",
};

export const CONDITION_LABEL: Record<ItemCondition, string> = {
  good: "Bagus",
  usable: "Layak pakai",
  needs_repair: "Perlu perbaikan",
};

export const UNIT_LABEL: Record<ItemUnit, string> = {
  buah: "buah",
  m2: "m²",
  meter: "meter",
  lonjor: "lonjor",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatQuantity(quantity: number, unit: ItemUnit): string {
  return `${quantity.toLocaleString("id-ID")} ${UNIT_LABEL[unit]}`; // 12.5 → "12,5 m²"
}

export function formatPrice(pricePerUnit: number | null, unit: ItemUnit): string {
  if (pricePerUnit === null) return "Nego";
  return `${rupiah.format(pricePerUnit)} / ${UNIT_LABEL[unit]}`;
}
