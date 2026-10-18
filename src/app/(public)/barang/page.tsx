import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE } from "./sample";

export const metadata: Metadata = { title: "Katalog" };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function CatalogPage() {
  await sleep(1500); // TEMP: lets you see loading.tsx — remove after Step 7

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Katalog</h1>
      <ul className="list-disc space-y-1 pl-5">
        {SAMPLE.map((item) => (
          <li key={item.slug}>
            <Link href={`/barang/${item.slug}`} className="underline">
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/barang/tidak-ada" className="underline">
            Barang yang tidak ada (uji 404)
          </Link>
        </li>
      </ul>
    </section>
  );
}
