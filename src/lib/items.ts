import { CATEGORIES, ITEMS, ITEM_PHOTOS } from "@/data/dummy";
import type { Category, Item, ItemWithRelations } from "@/types/item";

function withRelations(item: Item): ItemWithRelations {
  const category = CATEGORIES.find((c) => c.id === item.category_id);
  if (!category) throw new Error(`Category ${item.category_id} not found for ${item.code}`);

  const photos = ITEM_PHOTOS.filter((p) => p.item_id === item.id).sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return { ...item, category, photos };
}

export async function getCategories(): Promise<Category[]> {
  return [...CATEGORIES].sort((a, b) => a.sort_order - b.sort_order);
}

type GetItemsOptions = {
  categorySlug?: string;
};

export async function getItems({ categorySlug }: GetItemsOptions = {}): Promise<
  ItemWithRelations[]
> {
  return [...ITEMS]
    .sort((a, b) => b.created_at.localeCompare(a.created_at)) // newest first
    .map(withRelations)
    .filter((item) => !categorySlug || item.category.slug === categorySlug);
}

export async function getItemBySlug(slug: string): Promise<ItemWithRelations | null> {
  const item = ITEMS.find((i) => i.slug === slug);
  return item ? withRelations(item) : null;
}

export function photoUrl(storagePath: string): string {
  return `/${storagePath}`;
}
