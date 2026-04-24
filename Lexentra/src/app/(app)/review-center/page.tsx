import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAgreements } from "@/lib/data";

export default async function ReviewCenterPage() {
  const agreements = (await getAgreements()).filter(
    (agreement) => agreement.status === "IN_REVIEW" || agreement.status === "NEEDS_CHANGES"
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Review center"
        title="AI-assisted review queue"
        description="Prioritize agreements by risk, unresolved findings, and policy divergence while keeping comments, clauses, and workflow state in one place."
      />

      <div className="space-y-5">
        {agreements.map((agreement) => (
          <Card className="p-6" key={agreement.id}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <p className="text-lg font-semibold text-slate-950">{agreement.title}</p>
                  <Badge tone={agreement.riskLevel === "High" || agreement.riskLevel === "Critical" ? "danger" : "warning"}>
                    {agreement.riskLevel} risk
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {agreement.counterparty} • {agreement.aiReviews[0]?.summary || "Awaiting review findings"}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {agreement.aiReviews[0]?.findings.map((finding) => (
                    <div className="rounded-[1.25rem] bg-slate-100 p-4" key={finding.title}>
                      <p className="text-sm font-semibold text-slate-900">{finding.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{finding.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Link className="text-sm font-semibold text-slate-900" href={`/agreements/${agreement.id}`}>
                Open review
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
