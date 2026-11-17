// Derived from the generated database types — regenerate with `pnpm db:types`
// after every migration. Never hand-edit database.ts.
import type { Enums, Tables } from "./database";

export type ItemStatus = Enums<"item_status">;
export type ItemCondition = Enums<"item_condition">;
export type ItemUnit = Enums<"item_unit">;

export type Category = Tables<"categories">;
export type Item = Tables<"items">;
export type ItemPhoto = Tables<"item_photos">;

// What pages actually render: an item joined with its category and photos
export type ItemWithRelations = Item & {
  category: Category;
  photos: ItemPhoto[];
};
