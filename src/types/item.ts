// Mirrors docs/erd.md. Replaced by Supabase-generated types on Day 15.

export type ItemStatus = "available" | "reserved" | "sold";
export type ItemCondition = "good" | "usable" | "needs_repair";
export type ItemUnit = "buah" | "m2" | "meter" | "lonjor";

export type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type ItemPhoto = {
  id: string;
  item_id: string;
  storage_path: string;
  sort_order: number; // 0 = cover
};

export type Item = {
  id: string;
  code: string; // human-readable, e.g. "SB-0012"
  slug: string;
  title: string;
  description: string | null;
  category_id: number;
  condition: ItemCondition;
  quantity: number; // remaining stock; may be fractional for m2/meter
  unit: ItemUnit;
  price_per_unit: number | null; // rupiah; null = "Nego"
  location_area: string;
  status: ItemStatus;
  created_at: string; // ISO timestamp — timestamptz arrives as a string
  sold_at: string | null;
};

// What pages actually render: an item joined with its category and photos
export type ItemWithRelations = Item & {
  category: Category;
  photos: ItemPhoto[];
};
