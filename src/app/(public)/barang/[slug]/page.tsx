import { notFound } from "next/navigation";
import { SAMPLE } from "../sample";

export default async function ItemDetailPage({ params }: PageProps<"/barang/[slug]">) {
  const { slug } = await params; // params is a Promise in Next.js 15+
  const item = SAMPLE.find((i) => i.slug === slug);

  if (!item) notFound(); // returns `never`, so TS knows `item` is defined below

  return (
    <article className="space-y-2">
      <p className="text-sm text-gray-500">{item.code}</p>
      <h1 className="text-2xl font-bold">{item.title}</h1>
      <p className="text-gray-600">Detail barang akan dibangun di Hari 10.</p>
    </article>
  );
}
