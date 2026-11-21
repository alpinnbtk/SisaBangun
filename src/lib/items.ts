import "server-only";
import { supabasePublic as supabase } from "@/lib/supabase/public";
import type { Category, ItemWithRelations } from "@/types/item";

// Pages & components call these functions and never touch Supabase directly.

// !inner: categories is required, and it lets us filter items by category.slug
const ITEM_SELECT = "*, category:categories!inner(*), photos:item_photos(*)";

function sortPhotos(item: ItemWithRelations): ItemWithRelations {
  return { ...item, photos: [...item.photos].sort((a, b) => a.sort_order - b.sort_order) };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw new Error(`getCategories: ${error.message}`);
  return data;
}

type GetItemsOptions = {
  categorySlug?: string;
};

export async function getItems({ categorySlug }: GetItemsOptions = {}): Promise<
  ItemWithRelations[]
> {
  let query = supabase
    .from("items")
    .select(ITEM_SELECT)
    .is("deleted_at", null) // RLS already enforces this; explicit filter documents intent and uses the partial index
    .order("created_at", { ascending: false });

  if (categorySlug) query = query.eq("category.slug", categorySlug);

  const { data, error } = await query;
  if (error) throw new Error(`getItems: ${error.message}`);
  return data.map(sortPhotos);
}

export async function getItemBySlug(slug: string): Promise<ItemWithRelations | null> {
  const { data, error } = await supabase
    .from("items")
    .select(ITEM_SELECT)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(`getItemBySlug: ${error.message}`);
  return data ? sortPhotos(data) : null;
}

export function photoUrl(storagePath: string): string {
  return `/${storagePath}`;
}
