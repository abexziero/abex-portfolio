"use client";

export default function staticImageLoader({ src, width }: { src: string; width: number }) {
  return `/optimized${src}-${width}.webp`;
}
