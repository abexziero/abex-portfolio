import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="badge" className={cn("inline-flex rounded-full border border-foreground/20 px-3 py-1 text-xs font-medium", className)} {...props} />;
}
