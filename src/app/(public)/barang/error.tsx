"use client";

// Shown when a query in this route throws (e.g. the database is unreachable)
export default function CatalogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-dashed p-8 text-center">
      <p className="font-semibold">Katalog sedang tidak bisa dimuat.</p>
      <p className="text-sm text-gray-500">Coba lagi sebentar, atau hubungi kami via WhatsApp.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="min-h-11 rounded-lg bg-green-600 px-4 text-white hover:bg-green-700"
      >
        Coba lagi
      </button>
    </div>
  );
}
