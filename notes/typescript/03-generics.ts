export {};

// Go-style (value, err) as a discriminated union
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

function parseQuantity(input: string): Result<number> {
  const n = Number(input.replace(",", "."));
  if (Number.isNaN(n) || n < 0) return { ok: false, error: `Jumlah tidak valid: ${input}` };
  return { ok: true, data: n };
}

// Generic helper reused for items, categories, anything
type Paginated<T> = { rows: T[]; page: number; totalPages: number };

function paginate<T>(all: T[], page: number, perPage = 12): Paginated<T> {
  const start = (page - 1) * perPage;
  return {
    rows: all.slice(start, start + perPage),
    page,
    totalPages: Math.ceil(all.length / perPage),
  };
}

for (const input of ["12,5", "abc", "-3"]) {
  const r = parseQuantity(input);
  if (r.ok) {
    console.log("OK:", r.data); // TS knows `data` exists here
  } else {
    console.log("Error:", r.error); // ...and `error` exists here
  }
}

const codes = ["SB-0001", "SB-0002", "SB-0003", "SB-0004", "SB-0005"];
const page2 = paginate(codes, 2, 2); // T inferred as string
console.log(page2);
