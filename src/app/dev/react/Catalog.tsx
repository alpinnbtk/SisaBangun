"use client";

import { useEffect, useState } from "react";
import { ITEMS, STATUS_LABEL, type ItemStatus } from "./data";
import { ItemCard } from "./ItemCard";
import { QuantityPicker } from "./QuantityPicker";

type Filter = ItemStatus | "all";
const FILTERS: Filter[] = ["all", "available", "reserved", "sold"];

export function Catalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const [lastOrder, setLastOrder] = useState<string | null>(null);

  // Derived value ≈ Vue computed: just compute it during render
  const visible = filter === "all" ? ITEMS : ITEMS.filter((i) => i.status === filter);

  // Effect ≈ Vue watch: sync with something OUTSIDE React (the browser tab title)
  useEffect(() => {
    document.title = `${visible.length} barang · SisaBangun`;
  }, [visible.length]);

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1 ${filter === f ? "bg-black text-white" : "border"}`}
          >
            {f === "all" ? "Semua" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {lastOrder && <p className="rounded bg-green-50 p-2">{lastOrder}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((item) => (
          <ItemCard key={item.code} item={item}>
            {item.status === "available" && (
              <QuantityPicker
                max={item.quantity}
                unit={item.unit}
                onConfirm={(qty) =>
                  setLastOrder(`Pesan ${qty} ${item.unit} ${item.title} (${item.code})`)
                }
              />
            )}
          </ItemCard>
        ))}
      </div>

      {visible.length === 0 && <p>Tidak ada barang.</p>}
    </section>
  );
}
