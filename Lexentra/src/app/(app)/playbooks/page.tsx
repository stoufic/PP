import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { getPlaybooks } from "@/lib/data";

export default async function PlaybooksPage() {
  const playbooks = await getPlaybooks();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Policy engine"
        title="Playbook management"
        description="Capture preferred clauses, fallback positions, unacceptable terms, and approval escalations so AI review remains governed by institutional policy."
      />

      <div className="space-y-6">
        {playbooks.map((playbook) => (
          <Card className="p-6" key={playbook.id}>
            <p className="text-base font-semibold text-foreground">{playbook.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{playbook.description}</p>
            <div className="mt-6 grid gap-4">
              {playbook.rules.map((rule) => (
                <div className="rounded-xl border border-border p-4" key={rule.id}>
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-sm font-semibold text-foreground">{rule.category}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                      {rule.riskCategory} · {rule.approvalPath}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Preferred</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{rule.preferredText}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Fallback</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{rule.fallbackText}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Unacceptable</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{rule.unacceptable}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
