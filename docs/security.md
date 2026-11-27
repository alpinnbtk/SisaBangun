# Security model

## Threat model

The Supabase URL and the publishable key are **public by design**: anyone can call
the Supabase API directly, bypassing the website. Security therefore never relies on
hiding that key. It relies on two database layers, both defined in `supabase/migrations/`:

1. **GRANT** (table level): which operations a role may attempt at all.
2. **RLS policies** (row level): which rows those operations may touch.

The secret key (`sb_secret_…` / `service_role`) bypasses both layers. It is never used
in this app, never prefixed `NEXT_PUBLIC_`, and never committed.

## Data access

| Table         | anon (visitors)                          | authenticated | service_role               |
| ------------- | ---------------------------------------- | ------------- | -------------------------- |
| `categories`  | SELECT all rows                          | same as anon  | full access (bypasses RLS) |
| `items`       | SELECT where `deleted_at is null`        | same as anon  | full access                |
| `item_photos` | SELECT if the parent item is not deleted | same as anon  | full access                |

No INSERT / UPDATE / DELETE for `anon` or `authenticated`.

### Gotcha: RLS can fail silently

When a role has the GRANT but no matching policy, UPDATE/DELETE return **200 with 0 rows**
instead of an error. Status codes alone are not proof; compare the data before and after.

## Automated check

`scripts/rls-check.mjs` attacks the API with the public key only (reads, writes, RPC,
and a before/after data snapshot). Exit code 1 on any failure.

    pnpm rls:check                                              # local
    node scripts/rls-check.mjs https://<ref>.supabase.co <key>   # cloud

Re-run after every migration that touches grants, policies, or new tables.

## Verification log

| Date       | Environment              | Result      | Notes                                                                 |
| ---------- | ------------------------ | ----------- | --------------------------------------------------------------------- |
| 2026-11-16 | local                    | manual curl | reads filtered, writes denied by GRANT                                |
| 2026-11-26 | local                    | 11/11 PASS  | script verified by temporarily breaking a policy (2 FAIL as expected) |
| 2026-11-26 | cloud (`sisabangun-dev`) | 11/11 PASS  | Security Advisor clean                                                |
| 2026-11-26 | build + git history      | clean       | no `sb_secret_` in bundle or history; only `.env.example` tracked     |

## Known limitations (tracked for later days)

- No admin role yet: writes are impossible for everyone.
- Storage bucket and its policies not created yet.
- No security headers yet.
- Supabase's default API rate limits only; no app-level rate limiting.
