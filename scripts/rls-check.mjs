#!/usr/bin/env node
// Attacker's-eye RLS check. Uses ONLY the public (publishable/anon) key,
// exactly like anyone who copies it could. Every check must PASS.
//
// Local:  pnpm rls:check
// Cloud:  node scripts/rls-check.mjs https://<ref>.supabase.co <publishable-key>

const [argUrl, argKey] = process.argv.slice(2);
const baseUrl = (argUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const key = argKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!baseUrl || !key) {
  console.error("Missing URL or key. See usage at the top of this file.");
  process.exit(2);
}
if (key.startsWith("sb_secret_")) {
  console.error("Refusing to run with a SECRET key: it bypasses RLS. Use the publishable key.");
  process.exit(2);
}

async function api(method, path, body) {
  const res = await fetch(`${baseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

const denied = (r) => r.status === 401 || r.status === 403;
const rows = (r) => (Array.isArray(r.data) ? r.data : []);

// Snapshot BEFORE the attacks: RLS can silently affect 0 rows instead of erroring,
// so the only real proof is that the data is identical afterwards.
const snapshot = () =>
  api("GET", "items?select=code,price_per_unit,quantity,status,deleted_at&order=code");
const before = await snapshot();

const checks = [
  // ---------- Reads ----------
  [
    "READ categories: 5 public rows",
    async () => {
      const r = await api("GET", "categories?select=slug");
      return [r.status === 200 && rows(r).length === 5, `${r.status}, ${rows(r).length} rows`];
    },
  ],
  [
    "READ items: no soft-deleted row leaks",
    async () => {
      const r = await api("GET", "items?select=code,deleted_at");
      const leaked = rows(r).filter((i) => i.deleted_at !== null).length;
      return [
        r.status === 200 && rows(r).length > 0 && leaked === 0,
        `${rows(r).length} rows, ${leaked} leaked`,
      ];
    },
  ],
  [
    "READ deleted item by slug: empty",
    async () => {
      const r = await api("GET", "items?select=code&slug=eq.barang-dihapus-sb-0007");
      return [r.status === 200 && rows(r).length === 0, `${r.status}, ${rows(r).length} rows`];
    },
  ],
  [
    "READ photos: none from deleted items",
    async () => {
      const visible = new Set(rows(await api("GET", "items?select=id")).map((i) => i.id));
      const photos = rows(await api("GET", "item_photos?select=item_id,storage_path"));
      const leaked = photos.filter((p) => !visible.has(p.item_id)).length;
      return [photos.length > 0 && leaked === 0, `${photos.length} photos, ${leaked} leaked`];
    },
  ],

  // ---------- Writes (all must be denied) ----------
  [
    "WRITE insert item: denied",
    async () => {
      const r = await api("POST", "items", {
        slug: "rls-attack",
        title: "Serangan",
        category_id: 1,
        condition: "good",
        quantity: 1,
        unit: "buah",
        location_area: "X",
      });
      return [denied(r), `${r.status} ${r.data?.code ?? ""}`];
    },
  ],
  [
    "WRITE update item price: denied",
    async () => {
      const r = await api("PATCH", "items?code=eq.SB-0001", { price_per_unit: 1 });
      return [denied(r), `${r.status} ${r.data?.code ?? ""}`];
    },
  ],
  [
    "WRITE delete item: denied",
    async () => {
      const r = await api("DELETE", "items?code=eq.SB-0001");
      return [denied(r), `${r.status} ${r.data?.code ?? ""}`];
    },
  ],
  [
    "WRITE insert category: denied",
    async () => {
      const r = await api("POST", "categories", { name: "Serangan", slug: "serangan" });
      return [denied(r), `${r.status} ${r.data?.code ?? ""}`];
    },
  ],
  [
    "WRITE delete all photos: denied",
    async () => {
      const r = await api("DELETE", "item_photos?id=not.is.null");
      return [denied(r), `${r.status} ${r.data?.code ?? ""}`];
    },
  ],

  // ---------- Functions ----------
  [
    "RPC trigger function: not callable",
    async () => {
      const r = await api("POST", "rpc/sync_item_sold_state", {});
      return [r.status >= 400, `${r.status} ${r.data?.code ?? ""}`];
    },
  ],

  // ---------- Integrity ----------
  [
    "INTEGRITY: items unchanged after attacks",
    async () => {
      const after = await snapshot();
      const same = JSON.stringify(after.data) === JSON.stringify(before.data);
      return [same, same ? "identical snapshot" : "DATA CHANGED"];
    },
  ],
];

let failed = 0;
for (const [name, run] of checks) {
  const [pass, detail] = await run();
  if (!pass) failed += 1;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name.padEnd(40)} ${detail}`);
}

console.log(`\n${checks.length - failed}/${checks.length} checks passed against ${baseUrl}`);
process.exit(failed ? 1 : 0);
