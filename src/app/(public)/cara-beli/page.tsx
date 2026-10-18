import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cara Beli" };

const STEPS = [
  "Pilih barang di katalog dan cek stok, kondisi, serta lokasi pengambilan.",
  'Tekan tombol "Pesan via WhatsApp" — pesan berisi kode barang terisi otomatis.',
  "Sebutkan jumlah yang ingin dibeli. Boleh beli sebagian, tidak harus semua stok.",
  "Nego harga langsung dengan penjual melalui chat.",
  "Bayar via transfer bank, atau tunai sesaat sebelum barang diambil.",
  "Ambil barang di lokasi yang disepakati.",
];

export default function HowToBuyPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Cara Beli</h1>
      <ol className="list-decimal space-y-2 pl-5">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
