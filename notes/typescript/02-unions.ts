export {};

// Literal union = the TS equivalent of a Postgres enum
type ItemStatus = "available" | "reserved" | "sold";
type ItemUnit = "buah" | "m2" | "meter" | "lonjor";

// Record<K, V>: TS forces you to provide a label for EVERY status
const STATUS_LABEL: Record<ItemStatus, string> = {
  available: "Tersedia",
  reserved: "Dipesan",
  sold: "Terjual",
};

type Item = {
  code: string;
  title: string;
  quantity: number;
  unit: ItemUnit;
  pricePerUnit: number | null; // null = "Nego"
  status: ItemStatus;
};

// Narrowing: after the null check, TS knows pricePerUnit is a number
function priceLabel(item: Item): string {
  if (item.pricePerUnit === null) return "Nego";
  return `Rp${item.pricePerUnit.toLocaleString("id-ID")} / ${item.unit}`;
}

// Exhaustiveness check with `never`
function badgeColor(status: ItemStatus): string {
  switch (status) {
    case "available":
      return "green";
    case "reserved":
      return "yellow";
    case "sold":
      return "gray";
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}

const item: Item = {
  code: "SB-0001",
  title: "Andang besi",
  quantity: 50,
  unit: "buah",
  pricePerUnit: 150000,
  status: "available",
};

// @ts-expect-error: "lusin" is not a valid ItemUnit
const wrongUnit: Item = { ...item, unit: "lusin" };

console.log(STATUS_LABEL[item.status], priceLabel(item), badgeColor(item.status));
console.log(priceLabel({ ...item, pricePerUnit: null }), wrongUnit.code);
