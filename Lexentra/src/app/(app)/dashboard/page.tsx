import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Timeline } from "@/components/app/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAgreements, getDashboardState } from "@/lib/data";
import { formatDate, sentenceCase } from "@/lib/utils";

export default async function DashboardPage() {
  const dashboard = await getDashboardState();
  const agreements = await getAgreements();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Command center"
        title="Enterprise agreement operations"
        description="Monitor review load, policy friction, renewal pressure, AI extraction progress, and execution flow from one operating surface."
        actions={
          <Link href="/agreements/new">
            <Button>Create agreement</Button>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-950">Agreements requiring attention</p>
              <p className="mt-1 text-sm text-slate-600">
                Highest-risk items moving through review, approval, and signature.
              </p>
            </div>
            <Link className="text-sm font-semibold text-slate-900" href="/agreements">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {agreements.slice(0, 4).map((agreement) => (
              <div
                className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-white p-5 lg:flex-row lg:items-center lg:justify-between"
                key={agreement.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-950">{agreement.title}</p>
                    <Badge tone={agreement.riskLevel === "High" || agreement.riskLevel === "Critical" ? "danger" : "default"}>
                      {agreement.riskLevel} risk
                    </Badge>
                    <Badge tone={agreement.complianceStatus === "Escalated" ? "danger" : agreement.complianceStatus === "Attention Needed" ? "warning" : "success"}>
                      {agreement.complianceStatus}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {agreement.counterparty} • {sentenceCase(agreement.status)} • {agreement.department}
                  </p>
                </div>
                <Link href={`/agreements/${agreement.id}`}>
                  <Button variant="secondary">
                    Open
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Upcoming deadlines and renewals</p>
          <div className="mt-6 space-y-4">
            {dashboard.upcomingDeadlines.map((item) => (
              <div className="rounded-[1.25rem] bg-slate-100 p-4" key={item.agreementId}>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Due {formatDate(item.dueAt)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">Risk alerts</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-amber-900/80">
              {dashboard.riskAlerts.map((alert) => (
                <li key={alert}>{alert}</li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Operational bottlenecks</p>
          <div className="mt-6 grid gap-4">
            {dashboard.reviewBottlenecks.map((item) => (
              <div className="flex items-center justify-between rounded-[1.25rem] border border-border p-4" key={item.label}>
                <p className="text-sm text-slate-600">{item.label}</p>
                <p className="text-sm font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
        <div>
          <p className="mb-4 text-lg font-semibold text-slate-950">Document activity</p>
          <Timeline items={dashboard.activityFeed.slice(0, 5)} />
        </div>
      </section>
    </div>
  );
}
