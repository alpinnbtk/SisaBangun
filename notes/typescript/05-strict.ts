export {};

type Item = { title: string; description?: string; pricePerUnit: number | null };

// strictNullChecks: optional fields may be undefined
export function unsafeLength(item: Item): number {
  // @ts-expect-error: description may be undefined
  return item.description.length;
}

// Safe versions: optional chaining + nullish coalescing
export function safeLength(item: Item): number {
  return item.description?.length ?? 0;
}

// noImplicitAny: params must be typed
// @ts-expect-error: parameters implicitly have an 'any' type
export function total(price, qty) {
  return price * qty;
}

// ?? vs || : the difference matters for 0 and ""
const discount = 0;
console.log(discount || 10); // 10  — wrong, 0 is treated as "empty"
console.log(discount ?? 10); // 0   — correct, only null/undefined fall back

console.log(safeLength({ title: "Engsel pintu", pricePerUnit: null }));
