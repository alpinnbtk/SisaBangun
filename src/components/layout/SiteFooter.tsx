export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t text-sm text-gray-600">
      <div className="mx-auto max-w-5xl space-y-1 px-4 py-6">
        <p>Pembayaran: transfer bank atau tunai saat pengambilan barang.</p>
        <p>Harga bisa nego via WhatsApp.</p>
        <p>© {year} SisaBangun</p>
      </div>
    </footer>
  );
}
