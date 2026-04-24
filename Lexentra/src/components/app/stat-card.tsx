import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  tone = "default"
}: {
  label: string;
  value: string;
  change: string;
  tone?: "default" | "warning" | "success";
}) {
  const positive = tone === "success";

  return (
    <Card className="p-5">
      <div className="space-y-3">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              tone === "default" && "bg-slate-100 text-slate-600",
              tone === "warning" && "bg-amber-50 text-amber-700",
              tone === "success" && "bg-emerald-50 text-emerald-700"
            )}
          >
            {positive ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
            {change}
          </div>
        </div>
      </div>
    </Card>
  );
}
