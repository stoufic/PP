import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { getAgreements, getDashboardState } from "@/lib/data";

export default async function ReportsPage() {
  const agreements = await getAgreements();
  const dashboard = await getDashboardState();
  const highRisk = agreements.filter((item) => item.riskLevel === "High" || item.riskLevel === "Critical");

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Reporting"
        title="Operational analytics"
        description="Track throughput, bottlenecks, renewals, risk concentration, and AI review completion through concise enterprise metrics."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Total agreements", String(agreements.length)],
          ["High-risk agreements", String(highRisk.length)],
          ["Open compliance issues", String(dashboard.complianceIssues.length)]
        ].map(([label, value]) => (
          <Card className="p-6" key={label}>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">{label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Distribution</p>
          <p className="mt-1 mb-5 text-base font-semibold text-foreground">Agreements by status</p>
          <div className="space-y-4">
            {["IN_REVIEW", "APPROVED", "AWAITING_SIGNATURE", "EXECUTED", "NEEDS_CHANGES"].map((status) => {
              const count = agreements.filter((agreement) => agreement.status === status).length;
              return (
                <div className="space-y-2" key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{status.replace(/_/g, " ")}</span>
                    <span className="font-semibold text-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-raised">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${(count / agreements.length) * 100 || 4}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Operations</p>
          <p className="mt-1 mb-5 text-base font-semibold text-foreground">Review bottlenecks</p>
          <div className="space-y-3">
            {dashboard.reviewBottlenecks.map((item) => (
              <div className="rounded-xl border border-border p-4" key={item.label}>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-2 text-sm text-muted">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
