import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md space-y-4 p-10 text-center">
      <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="text-gray-600">Barang mungkin sudah terjual, atau link-nya salah.</p>
      <Link href="/barang" className="underline">
        Kembali ke katalog
      </Link>
    </main>
  );
}
