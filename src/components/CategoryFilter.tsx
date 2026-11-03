import Link from "next/link";
import type { Category } from "@/types/item";

type CategoryFilterProps = {
  categories: Category[];
  activeSlug?: string;
};

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  const options = [
    { slug: undefined, name: "Semua" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    // -mx-4 px-4: chips scroll edge-to-edge on phones, inside the page padding on larger screens
    <nav aria-label="Filter kategori" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 sm:flex-wrap">
        {options.map((option) => {
          const isActive = option.slug === activeSlug;
          return (
            <li key={option.slug ?? "all"} className="shrink-0">
              <Link
                href={option.slug ? `/barang?kategori=${option.slug}` : "/barang"}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm whitespace-nowrap transition ${
                  isActive
                    ? "border-green-700 bg-green-700 text-white"
                    : "bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {option.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
