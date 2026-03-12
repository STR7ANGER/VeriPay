import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-stone-400",
  {
    variants: {
      variant: {
        default: "bg-stone-950 text-stone-50 hover:bg-stone-800",
        outline:
          "border border-stone-900/10 bg-white text-stone-900 hover:bg-stone-100",
        secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
        amber: "bg-amber-500 text-stone-950 hover:bg-amber-400",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-xs tracking-[0.18em] uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
