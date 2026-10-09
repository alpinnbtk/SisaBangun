"use client";

import { useEffect, useState } from "react";

type QuantityPickerProps = {
  max: number;
  unit: string;
  onConfirm: (qty: number) => void; // ≈ Vue emit("confirm", qty)
};

export function QuantityPicker({ max, unit, onConfirm }: QuantityPickerProps) {
  const [qty, setQty] = useState(1);
  const clamp = (n: number) => Math.min(Math.max(n, 1), max);

  useEffect(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id); // cleanup ≈ onUnmounted
  }, []);

  return (
    <div className="mt-3 flex items-center gap-2">
      <button onClick={() => setQty((q) => clamp(q - 1))} className="rounded border px-2">
        −
      </button>
      {/* ≈ v-model: value + onChange, written by hand */}
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(clamp(Number(e.target.value)))}
        className="w-16 rounded border px-1 text-center"
      />
      <span>{unit}</span>
      <button onClick={() => setQty((q) => clamp(q + 1))} className="rounded border px-2">
        +
      </button>
      <button
        onClick={() => onConfirm(qty)}
        className="ml-auto rounded bg-green-600 px-3 py-1 text-white"
      >
        Pesan
      </button>
    </div>
  );
}
