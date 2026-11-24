import Link from "next/link";
import { buildCatalogHref } from "@/lib/catalog-url";

type PaginationProps = {
  page: number;
  totalPages: number;
  kategori?: string;
  q?: string;
};

const base = "inline-flex min-h-11 items-center rounded-lg border px-4 text-sm";

export function Pagination({ page, totalPages, kategori, q }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Halaman katalog" className="flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link
          href={buildCatalogHref({ kategori, q, halaman: page - 1 })}
          className={`${base} hover:border-gray-400`}
        >
          ← Sebelumnya
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} text-gray-300`}>
          ← Sebelumnya
        </span>
      )}

      <p className="text-sm text-gray-500">
        Halaman {page} dari {totalPages}
      </p>

      {page < totalPages ? (
        <Link
          href={buildCatalogHref({ kategori, q, halaman: page + 1 })}
          className={`${base} hover:border-gray-400`}
        >
          Berikutnya →
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} text-gray-300`}>
          Berikutnya →
        </span>
      )}
    </nav>
  );
}
