import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-panel border border-border bg-white/95 shadow-panel shadow-slate-900/5",
        className
      )}
      {...props}
    />
  );
}
