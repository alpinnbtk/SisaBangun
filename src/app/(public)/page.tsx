import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4 py-10">
      <h1 className="text-3xl font-bold">Material bangunan bekas, siap pakai.</h1>
      <p className="text-gray-600">
        Andang besi, mesin molen, pipa PVC, engsel, dan bahan bangunan lainnya dari proyek
        kontraktor. Harga nego langsung via WhatsApp.
      </p>
      <Link href="/barang" className="inline-block rounded bg-green-600 px-4 py-2 text-white">
        Lihat katalog
      </Link>
    </section>
  );
}
