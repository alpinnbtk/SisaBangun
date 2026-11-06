type WhatsAppButtonProps = {
  primaryHref: string;
  backupHref: string | null;
  label: string;
};

export function WhatsAppButton({ primaryHref, backupHref, label }: WhatsAppButtonProps) {
  return (
    <div className="space-y-2">
      <a
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 w-full items-center justify-center rounded-lg bg-green-600 px-4 font-semibold text-white hover:bg-green-700"
      >
        {label}
      </a>
      {backupHref && (
        <p className="text-center text-sm text-gray-500">
          Tidak dibalas?{" "}
          <a href={backupHref} target="_blank" rel="noopener noreferrer" className="underline">
            Hubungi nomor cadangan
          </a>
        </p>
      )}
    </div>
  );
}
