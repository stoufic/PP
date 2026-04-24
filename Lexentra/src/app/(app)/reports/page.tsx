import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { getAgreements, getDashboardState } from "@/lib/data";

export default async function ReportsPage() {
  const agreements = await getAgreements();
  const dashboard = await getDashboardState();
  const highRisk = agreements.filter((item) => item.riskLevel === "High" || item.riskLevel === "Critical");

  return (
    <div className="space-y-8">
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
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Agreements by status</p>
          <div className="mt-6 space-y-4">
            {["IN_REVIEW", "APPROVED", "AWAITING_SIGNATURE", "EXECUTED", "NEEDS_CHANGES"].map((status) => {
              const count = agreements.filter((agreement) => agreement.status === status).length;
              return (
                <div className="space-y-2" key={status}>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{status.replace(/_/g, " ")}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[#1f2937]"
                      style={{ width: `${(count / agreements.length) * 100 || 4}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Review bottlenecks</p>
          <div className="mt-6 space-y-4">
            {dashboard.reviewBottlenecks.map((item) => (
              <div className="rounded-[1.25rem] border border-border p-4" key={item.label}>
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-2 text-sm text-slate-600">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
