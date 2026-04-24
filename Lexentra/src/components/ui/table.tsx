import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-border">
      <table className={cn("min-w-full divide-y divide-border text-sm", className)} {...props} />
    </div>
  );
}
