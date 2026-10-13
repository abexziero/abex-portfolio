import { readFileSync } from "node:fs";
import { join } from "node:path";
export const dynamic = "force-static";
export function GET() {
  return new Response(readFileSync(join(process.cwd(), "src/components/motion-demo.tsx"), "utf8"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
