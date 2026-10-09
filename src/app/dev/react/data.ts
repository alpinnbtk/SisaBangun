export type ItemStatus = "available" | "reserved" | "sold";
export type ItemUnit = "buah" | "m2" | "meter" | "lonjor";

export type Item = {
  code: string;
  title: string;
  quantity: number;
  unit: ItemUnit;
  pricePerUnit: number | null;
  status: ItemStatus;
};

export const STATUS_LABEL: Record<ItemStatus, string> = {
  available: "Tersedia",
  reserved: "Dipesan",
  sold: "Terjual",
};

export const ITEMS: Item[] = [
  {
    code: "SB-0001",
    title: "Andang besi",
    quantity: 40,
    unit: "buah",
    pricePerUnit: 150000,
    status: "available",
  },
  {
    code: "SB-0002",
    title: "Mesin molen",
    quantity: 1,
    unit: "buah",
    pricePerUnit: null,
    status: "sold",
  },
  {
    code: "SB-0003",
    title: "Pipa PVC 3 inch",
    quantity: 25,
    unit: "lonjor",
    pricePerUnit: 45000,
    status: "available",
  },
  {
    code: "SB-0004",
    title: "Engsel pintu",
    quantity: 60,
    unit: "buah",
    pricePerUnit: 8000,
    status: "reserved",
  },
];
