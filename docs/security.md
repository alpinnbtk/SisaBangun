# Security model

## Data access

Two layers, both defined in `supabase/migrations/`:
1. **GRANT** (table level) — which operations a role may attempt.
2. **RLS policies** (row level) — which rows those operations may touch.

| Table | anon (visitors) | authenticated | service_role |
|---|---|---|---|
| `categories` | SELECT all rows | SELECT all rows | full access (bypasses RLS) |
| `items` | SELECT where `deleted_at is null` | same as anon | full access |
| `item_photos` | SELECT if parent item is not deleted | same as anon | full access |

No INSERT / UPDATE / DELETE for `anon` or `authenticated` yet. Admin writes: Day 22.
`service_role` is never used in browser code.

## Verification log

| Date | Environment | Test | Result |
|---|---|---|---|
| 2026-11-16 | local | anon SELECT items | only non-deleted rows |
| 2026-11-16 | local | anon SELECT with `deleted_at=not.is.null` | `[]` |
| 2026-11-16 | local | anon INSERT / DELETE items | 42501 permission denied (GRANT layer) |
| 2026-11-16 | local | anon INSERT with temporary GRANT | blocked by RLS (policy layer) |