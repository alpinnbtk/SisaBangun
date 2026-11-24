import "server-only";
import { supabasePublic as supabase } from "@/lib/supabase/public";
import { toIlikeFilterValue } from "@/lib/search";
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

export const CATALOG_PAGE_SIZE = 12;

type GetItemsOptions = {
  categorySlug?: string;
  search?: string;
  page?: number;
};

export type ItemsPage = {
  items: ItemWithRelations[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getItems({
  categorySlug,
  search,
  page = 1,
}: GetItemsOptions = {}): Promise<ItemsPage> {
  const from = (page - 1) * CATALOG_PAGE_SIZE;
  const to = from + CATALOG_PAGE_SIZE - 1;

  // Filters first...
  let query = supabase.from("items").select(ITEM_SELECT, { count: "exact" }).is("deleted_at", null);

  if (categorySlug) query = query.eq("category.slug", categorySlug);

  const pattern = toIlikeFilterValue(search);
  if (pattern) {
    query = query.or(`title.ilike.${pattern},code.ilike.${pattern},description.ilike.${pattern}`);
  }

  // ...then ordering and paging
  const { data, error, count } = await query
    .order("status") // enum order: available → reserved → sold
    .order("created_at", { ascending: false })
    .range(from, to);

  // Asking for a page past the end (e.g. ?halaman=99) is "range not satisfiable"
  if (error?.code === "PGRST103") {
    return { items: [], total: 0, page, totalPages: 0 };
  }
  if (error) throw new Error(`getItems: ${error.message}`);

  const total = count ?? 0;
  return {
    items: data.map(sortPhotos),
    total,
    page,
    totalPages: Math.ceil(total / CATALOG_PAGE_SIZE),
  };
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
