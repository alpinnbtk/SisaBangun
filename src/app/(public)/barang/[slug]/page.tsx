import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/PhotoGallery";
import { StatusBadge } from "@/components/StatusBadge";
import { CONDITION_LABEL, formatDate, formatPrice, formatQuantity } from "@/lib/item-format";
import { getItemBySlug, photoUrl } from "@/lib/items";

export async function generateMetadata({ params }: PageProps<"/barang/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Barang tidak ditemukan" };

  return {
    title: item.title,
    description:
      item.description ??
      `${item.title} — ${formatQuantity(item.quantity, item.unit)}, ${formatPrice(item.price_per_unit, item.unit)}.`,
  };
}

export default async function ItemDetailPage({ params }: PageProps<"/barang/[slug]">) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) notFound();

  // Resolve URLs on the server; the client gallery only receives plain strings
  const photos = item.photos.map((p) => ({ id: p.id, url: photoUrl(p.storage_path) }));
  const categoryHref = `/barang?kategori=${item.category.slug}`;

  const specs = [
    { label: "Kategori", value: item.category.name },
    { label: "Kondisi", value: CONDITION_LABEL[item.condition] },
    { label: "Stok tersedia", value: formatQuantity(item.quantity, item.unit) },
    { label: "Lokasi pengambilan", value: item.location_area },
    { label: "Diunggah", value: formatDate(item.created_at) },
  ];

  return (
    <article className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <Link href="/barang" className="hover:underline">
          Katalog
        </Link>
        <span className="mx-1">/</span>
        <Link href={categoryHref} className="hover:underline">
          {item.category.name}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        <PhotoGallery photos={photos} alt={item.title} />

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">{item.code}</p>
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <StatusBadge status={item.status} />
          </div>

          <div>
            <p className="text-2xl font-bold text-green-700">
              {formatPrice(item.price_per_unit, item.unit)}
            </p>
            <p className="text-sm text-gray-500">
              {item.price_per_unit === null
                ? "Harga ditentukan lewat nego via WhatsApp."
                : "Harga masih bisa nego via WhatsApp."}
            </p>
          </div>

          {item.status === "reserved" && (
            <p className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-900">
              Barang ini sedang dipesan pembeli lain. Tetap boleh ditanyakan — kadang pesanan batal.
            </p>
          )}

          {item.status === "sold" && (
            <p className="rounded-md bg-gray-100 p-3 text-sm text-gray-700">
              Barang ini sudah terjual{item.sold_at ? ` pada ${formatDate(item.sold_at)}` : ""}.{" "}
              <Link href={categoryHref} className="underline">
                Lihat barang lain di {item.category.name}
              </Link>
            </p>
          )}

          <dl className="divide-y rounded-lg border">
            {specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-gray-500">{spec.label}</dt>
                <dd className="text-right font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>

          {/* Day 11: WhatsApp CTA goes here */}

          {item.status !== "sold" && (
            <ul className="space-y-1 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              <li>✔ Boleh beli sebagian — sebutkan jumlah yang dibutuhkan saat chat.</li>
              <li>✔ Pembayaran: transfer bank atau tunai sesaat sebelum barang diambil.</li>
              <li>✔ Alamat lengkap pengambilan diberikan lewat WhatsApp.</li>
            </ul>
          )}
        </div>
      </div>

      {item.description && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Deskripsi</h2>
          <p className="whitespace-pre-line text-gray-700">{item.description}</p>
        </section>
      )}
    </article>
  );
}
