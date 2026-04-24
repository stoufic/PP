import { Card } from "@/components/ui/card";
import { TimelineItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {items.map((item) => (
          <div className="flex gap-4" key={item.id}>
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm leading-6 text-slate-600">{item.detail}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {item.actor} • {formatDate(item.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
