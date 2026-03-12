import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full rounded-[1.5rem] border border-stone-900/10 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-900 outline-none transition focus-visible:border-stone-400 focus-visible:ring-2 focus-visible:ring-stone-300/60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
