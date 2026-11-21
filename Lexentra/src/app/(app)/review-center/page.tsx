import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAgreements } from "@/lib/data";

export default async function ReviewCenterPage() {
  const agreements = (await getAgreements()).filter(
    (agreement) => agreement.status === "IN_REVIEW" || agreement.status === "NEEDS_CHANGES"
  );

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Review center"
        title="AI-assisted review queue"
        description="Prioritize agreements by risk, unresolved findings, and policy divergence. Comments, clauses, and workflow state in one place."
      />

      <div className="space-y-4">
        {agreements.map((agreement) => (
          <Card key={agreement.id} className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-foreground">{agreement.title}</p>
                  <Badge
                    tone={
                      agreement.riskLevel === "High" || agreement.riskLevel === "Critical"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {agreement.riskLevel} risk
                  </Badge>
                  <Badge tone={agreement.status === "NEEDS_CHANGES" ? "warning" : "default"}>
                    {agreement.status === "NEEDS_CHANGES" ? "Needs changes" : "In review"}
                  </Badge>
                </div>

                <p className="text-sm text-muted">
                  {agreement.counterparty} · {agreement.aiReviews[0]?.summary || "Awaiting review findings"}
                </p>

                {agreement.aiReviews[0]?.findings && agreement.aiReviews[0].findings.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {agreement.aiReviews[0].findings.map((finding) => (
                      <div
                        key={finding.title}
                        className="flex gap-3 rounded-xl bg-surface-raised p-4"
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{finding.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{finding.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`/agreements/${agreement.id}`}
                className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
              >
                Open review
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        ))}

        {agreements.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-20 text-center">
            <p className="text-sm font-medium text-foreground">No agreements in review</p>
            <p className="mt-1 text-sm text-muted">Agreements in review or needing changes will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
