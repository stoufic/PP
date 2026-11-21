import { Card } from "@/components/ui/card";
import { TimelineItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <Card className="p-6">
      <div className="relative space-y-6">
        {items.map((item, index) => (
          <div className="flex gap-4" key={item.id}>
            <div className="relative flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-accent" />
              {index < items.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="space-y-1 pb-1">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                {item.actor} · {formatDate(item.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
