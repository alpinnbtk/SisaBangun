-- ============================================================
-- 0. Enums — mirror the TypeScript unions in src/types/item.ts
-- ============================================================
create type public.item_status as enum ('available', 'reserved', 'sold');
create type public.item_condition as enum ('good', 'usable', 'needs_repair');
create type public.item_unit as enum ('buah', 'm2', 'meter', 'lonjor');

-- ============================================================
-- 1. Categories (reference data)
-- ============================================================
create table public.categories (
  id smallint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. Items
-- ============================================================
-- Human-readable codes SB-0001 ... SB-9999.
-- maxvalue makes the 10,000th insert fail loudly instead of silently
-- producing a truncated, duplicate code.
create sequence public.item_code_seq maxvalue 9999;

create table public.items (
  id uuid primary key default gen_random_uuid(),
  code text not null unique
    default ('SB-' || lpad(nextval('public.item_code_seq')::text, 4, '0')),
  slug text not null unique,
  title text not null check (char_length(title) between 3 and 120),
  description text,
  category_id smallint not null references public.categories (id) on delete restrict,
  condition public.item_condition not null,
  quantity numeric(12, 2) not null check (quantity >= 0),   -- remaining stock; fractional for m2/meter
  unit public.item_unit not null,
  price_per_unit bigint check (price_per_unit is null or price_per_unit > 0), -- rupiah; null = "Nego"
  location_area text not null,                              -- area only, never a full address
  status public.item_status not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sold_at timestamptz,
  deleted_at timestamptz                                    -- soft delete
);

-- ============================================================
-- 3. Item photos
-- ============================================================
create table public.item_photos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items (id) on delete cascade,
  storage_path text not null,                               -- path, not URL
  sort_order smallint not null default 0,                   -- 0 = cover
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. Indexes — Postgres does NOT index foreign keys automatically
-- ============================================================
create index items_category_id_idx on public.items (category_id);
create index item_photos_item_id_idx on public.item_photos (item_id);
-- Catalog query: visible items, newest first
create index items_catalog_idx on public.items (created_at desc) where deleted_at is null;

-- ============================================================
-- 5. Triggers
-- ============================================================
-- Keep updated_at current on every update
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger items_set_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

-- Business rule from docs/flows.md:
-- quantity reaching 0 => sold; sold_at follows status automatically
create function public.sync_item_sold_state()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.quantity = 0 and new.status <> 'sold' then
    new.status := 'sold';
  end if;

  if new.status = 'sold' and new.sold_at is null then
    new.sold_at := now();
  elsif new.status <> 'sold' then
    new.sold_at := null;
  end if;

  return new;
end;
$$;

create trigger items_sync_sold_state
  before insert or update on public.items
  for each row execute function public.sync_item_sold_state();

-- ============================================================
-- 6. Row Level Security — ON from the start.
--    RLS on + no policies = nobody can read or write through the API.
-- ============================================================
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.item_photos enable row level security;

-- ============================================================
-- 7. Reference data — needed in every environment, so it lives in a
--    migration 
-- ============================================================
insert into public.categories (name, slug, sort_order) values
  ('Andang & Perancah',      'andang-perancah',  1),
  ('Mesin & Alat Kerja',     'mesin-alat-kerja', 2),
  ('Pipa & Plumbing',        'pipa-plumbing',    3),
  ('Engsel & Hardware',      'engsel-hardware',  4),
  ('Bahan Bangunan Lainnya', 'bahan-lainnya',    5);