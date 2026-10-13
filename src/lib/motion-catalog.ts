import type { Locale } from "./content.ts";
export const motionCatalog = [
  { slug: "velocity-marquee", title: "Velocity marquee", id: "Kecepatan gulir mendorong barisan tipografi. Gulir lebih cepat untuk mempercepat gerakan.", en: "Scroll velocity pushes rows of typography. Scroll faster to accelerate the movement." },
  { slug: "ripple-grid", title: "Ripple grid", id: "Klik untuk mengirim gelombang melalui kisi titik.", en: "Click to send a wave through a grid of dots." },
  { slug: "flocking", title: "Flocking", id: "Kawanan mengikuti pointer, menjaga jarak, dan menyelaraskan arah.", en: "A flock follows your pointer, keeps its distance, and aligns its direction." },
  { slug: "shape-pit", title: "Shape pit", id: "Tarik bentuk di dalam wadah gravitasi dan lepaskan untuk melihat tumbukan.", en: "Drag shapes inside a gravity container and release them to watch collisions." },
  { slug: "text-scramble", title: "Text scramble", id: "Pointer mengacak huruf, lalu teks kembali terbaca.", en: "Your pointer scrambles letters before the phrase resolves again." },
  { slug: "motion-path", title: "MotionPath", id: "Objek mengikuti kurva. Klik untuk membalik arah perjalanan.", en: "An object follows a curve. Click to reverse its direction." },
  { slug: "parallax-tilt", title: "Parallax tilt", id: "Kartu dan lapisan bergerak mengikuti posisi pointer.", en: "A card and its layers tilt with your pointer position." },
  { slug: "path-editor", title: "Path editor", id: "Tarik titik kontrol untuk mengubah kurva dan jalur objek.", en: "Drag control points to reshape the curve and the object's path." },
  { slug: "text-loop", title: "Text loop", id: "Barisan kata berputar tanpa putus. Klik untuk membalik arah.", en: "Rows of words loop continuously. Click to reverse direction." },
  { slug: "text-pressure", title: "Text pressure", id: "Huruf menebal dan membesar saat pointer mendekat.", en: "Letters gain weight and size as your pointer approaches." },
  { slug: "flow-field", title: "Flow field", id: "Partikel menelusuri medan arah yang dipengaruhi pointer.", en: "Particles trace a vector field influenced by your pointer." },
  { slug: "cloth-pluck", title: "Cloth pluck", id: "Tarik kisi kain, lalu lepaskan untuk melihatnya berayun kembali.", en: "Pull the cloth mesh and release it to watch it settle back." },
  { slug: "iron-filings", title: "Iron filings", id: "Serpihan logam menyelaraskan diri dengan medan magnet pointer.", en: "Iron filings align with the magnetic field around your pointer." },
  { slug: "metaballs", title: "Metaballs", id: "Bola menyatu melalui filter SVG. Pointer menggerakkan salah satu bola.", en: "Blobs merge through an SVG filter. Your pointer guides one blob." },
  { slug: "spring-drag", title: "Spring drag", id: "Tarik objek, lalu lepaskan. Pegas mengembalikannya ke pusat.", en: "Drag the object and release it. A spring pulls it back to the center." },
] as const;
export type DemoSlug = (typeof motionCatalog)[number]["slug"];
export function demoDescription(demo: (typeof motionCatalog)[number], lang: Locale) { return demo[lang]; }
