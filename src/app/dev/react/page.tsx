import { notFound } from "next/navigation";
import { Catalog } from "./Catalog";

export default function ReactPlaygroundPage() {
  // Dev-only page: returns 404 in production builds
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">React playground</h1>
      <Catalog />
    </main>
  );
}
