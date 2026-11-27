## Week 2 — Static Catalog

**Built:** Public layout (header, footer, active nav), catalog with URL-based category filter,
item detail page with photo gallery and status notices, WhatsApp CTA with backup number,
first unit tests (Vitest), first Vercel deploy.

**Hard:** Small naming details with big effects — `(public)` vs `public`, and environment issues
that fail silently.

**Do differently:** Test on a real phone earlier (dark mode bug only showed there).

### Gotchas

- Route group needs parentheses: `public/` becomes a URL segment, `(public)/` doesn't.
- After renaming route folders, run `pnpm next typegen` (stale `PageProps`/`AppRoutes`).
- PowerShell treats `[slug]` as a wildcard → use `-LiteralPath`.
- Phone dark mode + `bg-white` = invisible text → forced `color-scheme: light`.
- `.env.local` copied from a UTF-16 `.env.example` → all env vars `undefined`.
- `NEXT_PUBLIC_*` vars are inlined at build time → restart dev / redeploy after changes.
- Server → Client Component props must be serializable (no functions).
- Reading `searchParams` turns a page from static (○) to dynamic (ƒ).
- Pin `timeZone: "Asia/Jakarta"` in date formatting; servers run in UTC.

### Next week

Database & RLS (Days 13–18): Supabase, migrations, Row Level Security, replace dummy data.

## Week 3 — Database & RLS

**Built:** Supabase local + cloud (`sisabangun-dev`), schema migration with enums, constraints,
triggers, explicit GRANTs and read-only RLS; dev seed; generated DB types; catalog reads from
Supabase with search, pagination and status ordering; automated RLS check (11/11 local + cloud).

**Hard:** Environment drift — things that work locally but were never applied to the cloud.

**Do differently:** Run `migration list --remote` after every push; test security by trying to break it.

### Gotchas

- Supabase CLI v3: `db push` targets LOCAL by default → use `--remote`.
- `db push` never runs `seed.sql`; dev cloud data was seeded by hand (never in production).
- A failed insert still consumes sequence values (gaps in SB-codes are normal).
- PowerShell 5.1 `>` writes UTF-16 → generate types via a pnpm script instead.
- PostgREST `.range()` past the end → `PGRST103`; treat as an empty page.
- `!inner` is required to filter parent rows by an embedded table's column.
- RLS-blocked UPDATE/DELETE return 200 with 0 rows, not an error.
- Node 20 is EOL; Vitest 5 needs `Map.groupBy` (Node 21+) → pinned Node 26 everywhere.

### Next week

Admin I (Days 19–24): Supabase Auth, protected /admin, create/edit items, design pass on Day 24.
