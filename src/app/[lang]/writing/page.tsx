import { notFound, permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/content";
type Props = { params: Promise<{ lang: string }> };
export default async function Writing({ params }: Props) {
  const { lang } = await params; if (!isLocale(lang)) notFound();
  permanentRedirect(`/${lang}/services`);
}
