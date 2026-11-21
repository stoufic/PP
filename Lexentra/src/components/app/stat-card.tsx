import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  tone = "default",
}: {
  label: string;
  value: string;
  change: string;
  tone?: "default" | "warning" | "success";
}) {
  return (
    <Card className="p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <div
        className={cn(
          "mt-3 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
          tone === "default" && "bg-surface-raised text-muted",
          tone === "warning" && "bg-warning-soft text-warning",
          tone === "success" && "bg-success-soft text-success"
        )}
      >
        {tone === "success" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
        {change}
      </div>
    </Card>
  );
}
