"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/barang", label: "Katalog" },
  { href: "/cara-beli", label: "Cara Beli" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 text-sm">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active ? "font-semibold text-green-700" : "text-gray-600 hover:text-gray-900"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
