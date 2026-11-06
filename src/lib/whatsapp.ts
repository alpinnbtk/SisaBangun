import type { Item } from "@/types/item";

// Pure functions only: no env vars, no React — easy to test.

/** Normalizes an Indonesian number to the digits-only "62..." format wa.me expects. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, ""); // drop +, spaces, dashes, parentheses
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;

  if (!/^62\d{8,13}$/.test(digits)) {
    throw new Error(`Invalid Indonesian WhatsApp number: "${raw}"`);
  }
  return digits;
}

export function itemUrl(slug: string, siteUrl: string): string {
  return new URL(`/barang/${slug}`, siteUrl).toString();
}

export function buildItemMessage(item: Pick<Item, "code" | "title">, url: string): string {
  return [
    "Halo, saya tertarik dengan barang ini:",
    `[${item.code}] ${item.title}`,
    url,
    "",
    "Jumlah yang dibutuhkan: ", // partial purchase is allowed — invite the buyer to say how much
    "Apakah masih tersedia?",
  ].join("\n");
}

export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}
