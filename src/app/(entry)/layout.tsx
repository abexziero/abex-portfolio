import type { ReactNode } from "react";
export default function EntryLayout({ children }: { children: ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
