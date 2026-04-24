import Link from "next/link";
import { notFound } from "next/navigation";
import { AIReviewPanel } from "@/components/app/ai-review-panel";
import { DocumentUploadForm } from "@/components/app/document-upload-form";
import { PageHeader } from "@/components/app/page-header";
import { Timeline } from "@/components/app/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAgreementById, getPlaybooks } from "@/lib/data";
import { formatDate, sentenceCase } from "@/lib/utils";

export default async function AgreementDetailsPage({
  params
}: {
  params: { agreementId: string };
}) {
  const agreement = await getAgreementById(params.agreementId);
  const playbooks = await getPlaybooks();

  if (!agreement) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={agreement.agreementNumber}
        title={agreement.title}
        description={agreement.summary}
        actions={
          <>
            <Link href={`/agreements/${agreement.id}/versions/compare`}>
              <Button variant="secondary">Compare versions</Button>
            </Link>
            <Button>Send for approval</Button>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{sentenceCase(agreement.status)}</Badge>
            <Badge tone={agreement.riskLevel === "High" || agreement.riskLevel === "Critical" ? "danger" : "default"}>
              {agreement.riskLevel} risk
            </Badge>
            <Badge tone={agreement.complianceStatus === "Healthy" ? "success" : "warning"}>
              {agreement.complianceStatus}
            </Badge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Counterparty</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{agreement.counterparty}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Department</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{agreement.department}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Effective date</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(agreement.effectiveDate)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Expiration date</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(agreement.expirationDate)}</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-100 p-5">
            <p className="text-sm font-semibold text-slate-900">Renewal terms</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{agreement.renewalTerms}</p>
          </div>
          <div className="mt-6">
            <p className="text-lg font-semibold text-slate-950">Clause extraction</p>
            <div className="mt-4 space-y-4">
              {agreement.clauses.map((clause) => (
                <div className="rounded-[1.25rem] border border-border p-4" key={clause.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-950">{clause.heading}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {clause.sourceAnchor}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{clause.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <DocumentUploadForm agreementId={agreement.id} />
          <Card className="p-6">
            <p className="text-lg font-semibold text-slate-950">Workflow</p>
            <div className="mt-4 space-y-4">
              {agreement.approvalSteps.map((step) => (
                <div className="rounded-[1.25rem] border border-border p-4" key={step.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{step.assignee}</p>
                      <p className="text-sm text-slate-500">
                        Stage {step.stageOrder} • {step.role}
                      </p>
                    </div>
                    <Badge tone={step.status === "APPROVED" ? "success" : step.status === "CHANGES_REQUESTED" ? "warning" : "default"}>
                      {sentenceCase(step.status)}
                    </Badge>
                  </div>
                  {step.note ? <p className="mt-3 text-sm leading-6 text-slate-600">{step.note}</p> : null}
                </div>
              ))}
            </div>
          </Card>
          <AIReviewPanel agreementId={agreement.id} playbookId={playbooks[0].id} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Obligations</p>
          <div className="mt-4 space-y-4">
            {agreement.obligations.map((obligation) => (
              <div className="rounded-[1.25rem] border border-border p-4" key={obligation.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{obligation.party}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {obligation.sourceAnchor}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{obligation.obligation}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Comments and notes</p>
          <div className="mt-4 space-y-4">
            {agreement.comments.map((comment) => (
              <div className="rounded-[1.25rem] border border-border p-4" key={comment.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {comment.sectionAnchor}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{comment.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <div>
        <p className="mb-4 text-lg font-semibold text-slate-950">Activity timeline</p>
        <Timeline items={agreement.timeline} />
      </div>
    </div>
  );
}
