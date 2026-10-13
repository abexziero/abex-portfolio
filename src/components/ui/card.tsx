import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: ComponentProps<"article">) {
  return <article data-slot="card" className={cn("rounded-2xl border border-border bg-card text-card-foreground", className)} {...props} />;
}
