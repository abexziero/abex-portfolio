import { notFound } from "next/navigation";
import { isLocale, ui } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Stage } from "@/components/stage";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) { const { lang } = await params; if (!isLocale(lang)) notFound(); return pageMetadata(lang); }
export default async function Home({ params }: Props) {
  const { lang } = await params; if (!isLocale(lang)) notFound();
  return <Stage lang={lang} copy={ui[lang]}/>;
}
