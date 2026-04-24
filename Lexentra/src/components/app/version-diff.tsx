import { Card } from "@/components/ui/card";

function paragraphs(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function VersionDiff({
  left,
  right
}: {
  left: string;
  right: string;
}) {
  const leftLines = paragraphs(left);
  const rightLines = paragraphs(right);
  const size = Math.max(leftLines.length, rightLines.length);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Prior version
        </p>
        <div className="space-y-3 text-sm leading-6 text-slate-700">
          {Array.from({ length: size }).map((_, index) => {
            const value = leftLines[index];
            const changed = value && value !== rightLines[index];
            return (
              <p className={changed ? "rounded-xl bg-rose-50 px-3 py-2 text-rose-900" : ""} key={index}>
                {value || " "}
              </p>
            );
          })}
        </div>
      </Card>
      <Card className="p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Current version
        </p>
        <div className="space-y-3 text-sm leading-6 text-slate-700">
          {Array.from({ length: size }).map((_, index) => {
            const value = rightLines[index];
            const changed = value && value !== leftLines[index];
            return (
              <p className={changed ? "rounded-xl bg-emerald-50 px-3 py-2 text-emerald-900" : ""} key={index}>
                {value || " "}
              </p>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
