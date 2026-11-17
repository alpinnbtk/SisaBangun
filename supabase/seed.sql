-- ============================================================
-- DEV-ONLY dummy data.
-- Runs automatically after migrations on `supabase db reset` (local).
-- ============================================================

-- Items are inserted in this order so the sequence assigns SB-0001 ... SB-0006,
-- matching the codes already embedded in the slugs.
insert into public.items
  (slug, title, description, category_id, condition, quantity, unit, price_per_unit,
   location_area, status, created_at, sold_at)
values
  ('andang-besi-170-cm-sb-0001', 'Andang besi 1,7 m',
   'Main frame andang besi tinggi 1,7 m, lengkap dengan cross brace.',
   (select id from public.categories where slug = 'andang-perancah'),
   'good', 40, 'buah', 150000, 'Malang', 'available', '2026-10-20T08:00:00Z', null),

  ('mesin-molen-350-liter-sb-0002', 'Mesin molen 350 liter',
   'Mesin diesel, masih jalan normal. Bak ada bekas karat ringan.',
   (select id from public.categories where slug = 'mesin-alat-kerja'),
   'usable', 1, 'buah', null, 'Malang', 'sold', '2026-10-05T08:00:00Z', '2026-10-18T10:00:00Z'),

  ('pipa-pvc-3-inch-sb-0003', 'Pipa PVC 3 inch',
   'Pipa AW panjang 4 m per lonjor, sisa proyek perumahan.',
   (select id from public.categories where slug = 'pipa-plumbing'),
   'good', 25, 'lonjor', 45000, 'Malang', 'available', '2026-10-22T08:00:00Z', null),

  ('engsel-pintu-stainless-4-inch-sb-0004', 'Engsel pintu stainless 4 inch',
   null,
   (select id from public.categories where slug = 'engsel-hardware'),
   'good', 60, 'buah', 8000, 'Malang', 'reserved', '2026-10-15T08:00:00Z', null),

  ('keramik-lantai-40x40-sb-0005', 'Keramik lantai 40×40 putih',
   'Sisa pemasangan, masih dalam dus.',
   (select id from public.categories where slug = 'bahan-lainnya'),
   'good', 12.5, 'm2', 35000, 'Malang', 'available', '2026-10-24T08:00:00Z', null),

  ('selang-air-3-4-inch-sb-0006', 'Selang air 3/4 inch',
   null,
   (select id from public.categories where slug = 'pipa-plumbing'),
   'usable', 50, 'meter', null, 'Malang', 'available', '2026-10-10T08:00:00Z', null);

-- A soft-deleted item: must NEVER appear for anon (RLS test fixture for Day 18)
insert into public.items
  (slug, title, category_id, condition, quantity, unit, location_area, deleted_at)
values
  ('barang-dihapus-sb-0007', 'Barang dihapus (uji RLS)',
   (select id from public.categories where slug = 'bahan-lainnya'),
   'usable', 1, 'buah', 'Malang', now());

-- Photos: join by slug so we never hardcode UUIDs.
-- Paths match the files in public/dummy/ (served by photoUrl() until Day 21).
insert into public.item_photos (item_id, storage_path, sort_order)
select i.id, p.path, p.sort_order
from (values
  ('andang-besi-170-cm-sb-0001', 'dummy/foto-1.jpg', 0),
  ('andang-besi-170-cm-sb-0001', 'dummy/foto-2.jpg', 1),
  ('andang-besi-170-cm-sb-0001', 'dummy/foto-3.jpg', 2)
) as p (slug, path, sort_order)
join public.items i on i.slug = p.slug;