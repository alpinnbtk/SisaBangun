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