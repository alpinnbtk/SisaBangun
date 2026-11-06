function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing env var ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

// Access NEXT_PUBLIC_* vars with the full literal name (process.env.NEXT_PUBLIC_X).
// Next.js inlines them at build time; dynamic access like process.env[name] is NOT inlined.
export const siteConfig = {
  siteUrl: required("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL),
  waPrimary: required("NEXT_PUBLIC_WA_NUMBER", process.env.NEXT_PUBLIC_WA_NUMBER),
  waBackup: process.env.NEXT_PUBLIC_WA_NUMBER_BACKUP || null, // optional
};
