import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full px-6 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 active:scale-[.98]", {
  variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", outline: "border border-foreground/25 bg-transparent text-foreground hover:bg-foreground/10", ghost: "bg-transparent text-foreground hover:bg-foreground/10" } }, defaultVariants: { variant: "default" },
});
function Button({ className, variant, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, className }))} {...props} />;
}
export { Button, buttonVariants };
