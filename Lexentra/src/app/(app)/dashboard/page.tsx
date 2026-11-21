import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
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
    <div className="space-y-10">
      <PageHeader
        eyebrow="Command center"
        title="Agreement operations"
        description="Monitor review load, policy friction, renewal pressure, and execution flow from one operating surface."
        actions={
          <Link href="/agreements/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New agreement
            </Button>
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Attention required</p>
              <p className="mt-1 text-base font-semibold text-foreground">
                Agreements in review, approval, or escalation
              </p>
            </div>
            <Link
              href="/agreements"
              className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {agreements.slice(0, 4).map((agreement) => (
              <div
                key={agreement.id}
                className="flex flex-col gap-4 rounded-xl border border-border p-5 transition-colors hover:bg-surface-raised lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{agreement.title}</p>
                    <Badge
                      tone={
                        agreement.riskLevel === "High" || agreement.riskLevel === "Critical"
                          ? "danger"
                          : "default"
                      }
                    >
                      {agreement.riskLevel} risk
                    </Badge>
                    <Badge
                      tone={
                        agreement.complianceStatus === "Escalated"
                          ? "danger"
                          : agreement.complianceStatus === "Attention Needed"
                          ? "warning"
                          : "success"
                      }
                    >
                      {agreement.complianceStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">
                    {agreement.counterparty} · {sentenceCase(agreement.status)} · {agreement.department}
                  </p>
                </div>
                <Link href={`/agreements/${agreement.id}`}>
                  <Button variant="secondary">
                    Open
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Upcoming</p>
            <p className="mt-1 mb-5 text-base font-semibold text-foreground">Deadlines & renewals</p>
            <div className="space-y-3">
              {dashboard.upcomingDeadlines.map((item) => (
                <div
                  key={item.agreementId}
                  className="rounded-lg bg-surface-raised p-4"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted">
                    Due {formatDate(item.dueAt)}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <div className="rounded-xl border border-warning/20 bg-warning-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-warning">Risk alerts</p>
            <ul className="mt-3 space-y-2">
              {dashboard.riskAlerts.map((alert) => (
                <li key={alert} className="text-sm leading-relaxed text-warning">
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Operations</p>
          <p className="mt-1 mb-5 text-base font-semibold text-foreground">Operational bottlenecks</p>
          <div className="space-y-2">
            {dashboard.reviewBottlenecks.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <p className="text-sm text-muted">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">Activity</p>
          <p className="mb-5 text-base font-semibold text-foreground">Document activity</p>
          <Timeline items={dashboard.activityFeed.slice(0, 5)} />
        </div>
      </section>
    </div>
  );
}
