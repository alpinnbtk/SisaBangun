import { CATEGORIES, ITEMS, ITEM_PHOTOS } from "@/data/dummy";
import type { Item, ItemWithRelations } from "@/types/item";

// The ONLY place that knows where data comes from.
// Day 16: replace these bodies with Supabase queries — pages & components stay unchanged.

function withRelations(item: Item): ItemWithRelations {
  const category = CATEGORIES.find((c) => c.id === item.category_id);
  if (!category) throw new Error(`Category ${item.category_id} not found for ${item.code}`);

  const photos = ITEM_PHOTOS.filter((p) => p.item_id === item.id).sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return { ...item, category, photos };
}

export async function getItems(): Promise<ItemWithRelations[]> {
  return [...ITEMS]
    .sort((a, b) => b.created_at.localeCompare(a.created_at)) // newest first
    .map(withRelations);
}

export async function getItemBySlug(slug: string): Promise<ItemWithRelations | null> {
  const item = ITEMS.find((i) => i.slug === slug);
  return item ? withRelations(item) : null;
}

// Day 21: return the Supabase Storage public URL instead
export function photoUrl(storagePath: string): string {
  return `/${storagePath}`;
}
