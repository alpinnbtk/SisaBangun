# SisaBangun — 8-Week Daily Learning Map

**Goal:** Learn modern full-stack web development (TypeScript, React/Next.js, Postgres via Supabase) _and_ the operational side of running a real website — hosting, security, backups, monitoring — by building a used construction-materials catalog for my father's contracting business, with a clean, daily-committed GitHub history.

**Assumed baseline:** Comfortable with Go, Python, SQL, Vue.js/jQuery, Git, and Docker. New to TypeScript, React/Next.js, managed backends (Supabase), and running a production site end to end. This map is a _new-stack + operations_ track, not an intro to programming.

**Business model (v1):** Public catalog + WhatsApp checkout. Buyers browse items and tap "Pesan via WhatsApp", which opens a chat with a pre-filled message containing the item code. Negotiation, inspection, payment, and pickup happen in chat. The owner updates item status (Tersedia / Dipesan / Terjual) from a mobile-friendly admin panel. No cart, no online payment, no buyer accounts in v1.

**Cadence:** ~6 working days/week (rest one day), ~60–90 min/day. Weeks 1–5 build the product; Week 6 hardens it; Weeks 7–8 are go-live, operations, and handover. If time is short, stop after Week 5 with a working site on a preview deployment — but do not go live with real buyers before finishing Week 6.

**Data & privacy note:** The repository contains code, schema, and dummy seed data only. No real client names, project addresses, buyer data, or production secrets are ever committed.

---

## How to use this map

1. One GitHub repo, e.g. `sisabangun`. One task = one commit (or a few small commits), using `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `sec:` prefixes.
2. At the end of each week, write 3–5 lines in `docs/journal.md` (what you built, what was hard, what you'd do differently).
3. Tag three milestones: `v0.1-public-catalog` (end of Week 3), `v0.2-admin` (end of Week 5), and `v1.0` (end of Week 8).
4. All database changes go through migration files in `supabase/migrations/` — never click-edit the production schema in the dashboard. The repo must be able to rebuild the database from scratch.
5. If a day's task runs long, commit what you have and carry the rest to Day 6 of that week (lighter by design).

---

## Week 1 — Discovery & Foundations

| Day | Task                                                                                                                                  | Output                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | Interview the owner: item types, typical volume, fixed vs. negotiable prices, who updates listings, pickup area, how buyers pay today | `docs/requirements.md`         |
| 2   | Write the user flows (buyer + admin) and draft the data model: `categories`, `items`, `item_photos`, item `status` enum               | `docs/flows.md`, `docs/erd.md` |
| 3   | Init repo: Next.js (App Router) + TypeScript + Tailwind; ESLint + Prettier; `.gitignore`, `.env.example`; skeleton README             | First commit                   |
| 4   | TypeScript review: types vs. interfaces, unions, generics, `async/await`, strict mode                                                 | `notes/typescript.md`          |
| 5   | React fundamentals mapped from Vue: components, props, state, effects, lists/keys                                                     | `notes/react-vs-vue.md`        |
| 6   | Buffer + Week 1 journal                                                                                                               | `docs/journal.md`              |

## Week 2 — Static Catalog

| Day | Task                                                                                                   | Output                                               |
| --- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| 7   | App Router basics: routes, layouts, `loading`/`not-found` files, Server vs. Client Components          | Layout + navigation                                  |
| 8   | `Item` type, dummy JSON data, `ItemCard` component                                                     | `src/types/item.ts`, `src/components/ItemCard.tsx`   |
| 9   | Catalog page: responsive grid, category filter, mobile-first styling                                   | `src/app/(public)/barang/page.tsx`                   |
| 10  | Item detail page: photo gallery, condition, quantity, location, price or "Nego", status badge          | `src/app/(public)/barang/[slug]/page.tsx`            |
| 11  | `buildWhatsAppLink()` utility with pre-filled message (item code + name + URL); unit tests with Vitest | `src/lib/whatsapp.ts`, `tests/unit/whatsapp.test.ts` |
| 12  | First deploy to a Vercel preview (git push → auto deploy); Week 2 journal                              | Live preview URL                                     |

## Week 3 — Database & Row Level Security

| Day | Task                                                                                                                                                   | Output                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| 13  | Create Supabase project; install Supabase CLI; first migration for tables + enum                                                                       | `supabase/migrations/0001_init.sql`          |
| 14  | Enable RLS on every table; public role can only `SELECT` non-deleted items; no public writes                                                           | `supabase/migrations/0002_rls.sql`           |
| 15  | Seed script with dummy items; generate TypeScript types from the schema                                                                                | `supabase/seed.sql`, `src/types/database.ts` |
| 16  | Replace dummy JSON with Supabase queries in Server Components                                                                                          | Data-driven catalog                          |
| 17  | Search, pagination, sort by newest; "Terjual" items shown greyed out                                                                                   | Updated catalog                              |
| 18  | **Milestone:** verify RLS by attempting INSERT/UPDATE/DELETE with the anon key via `curl` (all must fail); document results; tag `v0.1-public-catalog` | `docs/security.md`, Git tag                  |

## Week 4 — Admin I: Auth & Item Management

| Day | Task                                                                                                      | Output                                |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 19  | Supabase Auth (email + password) for the admin; **disable public sign-ups**                               | Admin login page                      |
| 20  | Protect `/admin/*` with middleware; session refresh; logout                                               | `src/middleware.ts`                   |
| 21  | Admin item list with one-tap status toggle (Tersedia → Dipesan → Terjual)                                 | `src/app/admin/page.tsx`              |
| 22  | Create-item form with Server Actions + Zod validation; RLS policy allowing writes only for the admin user | `src/app/admin/items/new/`, migration |
| 23  | Edit item + soft delete (`deleted_at`)                                                                    | Edit/delete flow                      |
| 24  | Buffer + Week 4 journal                                                                                   | —                                     |

## Week 5 — Admin II: Photos & Real-User Testing

| Day | Task                                                                                                 | Output                   |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------------ |
| 25  | Storage bucket for item photos + storage policies (public read, admin-only write)                    | Migration + bucket       |
| 26  | Multi-photo upload with client-side compression (phone photos are often 5 MB+)                       | Upload component         |
| 27  | Reorder/delete photos; clean up orphaned files when an item is deleted                               | Photo manager            |
| 28  | Mobile UX pass on the admin panel — large buttons, minimal typing                                    | Updated admin UI         |
| 29  | Usability test: owner adds 3 real items from a phone _without help_; record every point of confusion | `docs/usability-test.md` |
| 30  | **Milestone:** fix usability findings; Week 5 journal; tag `v0.2-admin`                              | Git tag                  |

## Week 6 — Quality & Security Hardening

| Day | Task                                                                                                                                                   | Output                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| 31  | Playwright end-to-end tests: browse → detail → WhatsApp link; admin login → create item                                                                | `tests/e2e/`                                 |
| 32  | GitHub Actions CI: lint, typecheck, unit tests, build on every push/PR                                                                                 | `.github/workflows/ci.yml`                   |
| 33  | Enable Dependabot + GitHub secret scanning/push protection; audit git history for leaked keys; confirm service-role key is never shipped to the client | `.github/dependabot.yml`, `docs/security.md` |
| 34  | Security headers (CSP, `X-Frame-Options`, `Referrer-Policy`); custom 404 and error boundary                                                            | `next.config.ts`                             |
| 35  | SEO: metadata, `sitemap.xml`, `robots.txt`, dynamic Open Graph image so shared links look good on WhatsApp/Facebook                                    | `src/app/sitemap.ts`, OG route               |
| 36  | Lighthouse pass (performance, accessibility, SEO); Week 6 journal                                                                                      | Lighthouse report in `docs/`                 |

## Week 7 — Go-Live & Operations

| Day | Task                                                                                                                              | Output                |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 37  | Buy a domain (.com or .id); configure DNS                                                                                         | Custom domain         |
| 38  | Move production to a plan that allows commercial use; separate dev and prod Supabase projects; set prod env vars                  | Production deployment |
| 39  | Privacy-friendly analytics + track WhatsApp button clicks per item (which items get interest)                                     | Analytics dashboard   |
| 40  | Scheduled database backup (`pg_dump`) to a **private** location — never to the public repo or public CI artifacts; test a restore | `docs/backup.md`      |
| 41  | Uptime monitor + error tracking; handle Supabase free-tier inactivity pausing if relevant                                         | Monitoring set up     |
| 42  | Soft launch to the owner's existing contacts; Week 7 journal                                                                      | Live site             |

## Week 8 — Handover & Polish

| Day | Task                                                                                                                  | Output                  |
| --- | --------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 43  | Admin guide in Bahasa Indonesia with screenshots (add item, change status, upload photos)                             | `docs/panduan-admin.md` |
| 44  | Runbook: site down, rotating a leaked key, restoring a backup, renewing the domain                                    | `docs/runbook.md`       |
| 45  | Final README pass: architecture diagram, flow diagram, screenshots, run instructions                                  | Updated `README.md`     |
| 46  | Demo GIF, badges (CI, license, Node version)                                                                          | `docs/demo.gif`         |
| 47  | Reproducibility check: fresh clone → new Supabase project → migrations + seed → app runs by following the README only | —                       |
| 48  | **Final:** `docs/final_review.md` retrospective; tag `v1.0`                                                           | Git tag                 |

---

## After v1.0 — Maintenance cadence

| Frequency | Task                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Weekly    | Check for items stuck in "Dipesan"; review error tracker; skim analytics                                 |
| Monthly   | Merge Dependabot PRs after CI passes; verify a backup restores; review RLS policies if any table changed |
| Quarterly | Rotate API keys; review who has admin access; re-run Lighthouse                                          |
| Yearly    | Renew domain; reassess hosting plan and costs                                                            |

## Stretch ideas (if you finish early)

- An `inquiries` table logging WhatsApp clicks per item, shown as "most-requested items" in the admin panel.
- Export listings as CSV for bulk-posting to Facebook Marketplace.
- Make the admin panel an installable PWA so the owner can open it like an app.
- Rewrite one server endpoint in Go and compare developer experience with Next.js Server Actions (a nice bridge to the internship stack).
- Online payment (Midtrans/Xendit) — only once transaction volume actually justifies it.
