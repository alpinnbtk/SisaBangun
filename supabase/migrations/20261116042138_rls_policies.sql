-- ============================================================
-- Layer 1: GRANTs — which operations a role may attempt at all.
-- Revoke first so local and cloud end up identical, regardless of
-- each environment's default privileges ("expose new tables" is off in cloud).
-- ============================================================
revoke all on table public.categories, public.items, public.item_photos
  from anon, authenticated;
revoke all on sequence public.item_code_seq
  from anon, authenticated;

grant select on table public.categories, public.items, public.item_photos
  to anon, authenticated;

-- ============================================================
-- Layer 2: RLS policies — which rows those operations may touch.
-- Only SELECT policies exist, so every API write is denied.
-- Admin write policies come on Day 22.
-- ============================================================
create policy "Categories are publicly readable"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create policy "Non-deleted items are publicly readable"
  on public.items
  for select
  to anon, authenticated
  using (deleted_at is null);

create policy "Photos of non-deleted items are publicly readable"
  on public.item_photos
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.items i
      where i.id = item_photos.item_id
        and i.deleted_at is null
    )
  );