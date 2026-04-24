import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { getPlaybooks } from "@/lib/data";

export default async function PlaybooksPage() {
  const playbooks = await getPlaybooks();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Policy engine"
        title="Playbook management"
        description="Capture preferred clauses, fallback positions, unacceptable terms, and approval escalations so AI review remains governed by institutional policy."
      />

      <div className="space-y-6">
        {playbooks.map((playbook) => (
          <Card className="p-6" key={playbook.id}>
            <p className="text-lg font-semibold text-slate-950">{playbook.name}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{playbook.description}</p>
            <div className="mt-6 grid gap-4">
              {playbook.rules.map((rule) => (
                <div className="rounded-[1.25rem] border border-border p-4" key={rule.id}>
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-sm font-semibold text-slate-900">{rule.category}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {rule.riskCategory} • {rule.approvalPath}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preferred</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{rule.preferredText}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Fallback</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{rule.fallbackText}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Unacceptable</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{rule.unacceptable}</p>
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
