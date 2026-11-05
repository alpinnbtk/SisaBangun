"use client";

import Image from "next/image";
import { useState } from "react";

export type GalleryPhoto = {
  id: string;
  url: string;
};

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
  alt: string;
};

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [index, setIndex] = useState(0);
  const current = photos[index];

  if (!current) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        Belum ada foto
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={current.url}
          alt={`${alt} — foto ${index + 1} dari ${photos.length}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      {photos.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto">
          {photos.map((photo, i) => (
            <li key={photo.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Lihat foto ${i + 1}`}
                aria-current={i === index}
                className={`relative block h-16 w-20 overflow-hidden rounded border-2 ${
                  i === index
                    ? "border-green-700"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={photo.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
