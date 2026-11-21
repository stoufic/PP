import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-accent text-white hover:bg-[var(--accent-hover)]",
        variant === "secondary" && "border border-border bg-surface text-foreground hover:bg-surface-raised",
        variant === "ghost" && "text-muted hover:bg-surface-raised hover:text-foreground",
        variant === "danger" && "bg-danger text-white hover:opacity-90",
        className
      )}
      type={type}
      {...props}
    />
  );
}
