import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { VersionDiff } from "@/components/app/version-diff";
import { Card } from "@/components/ui/card";
import { getAgreementById } from "@/lib/data";

export default async function AgreementComparePage({
  params
}: {
  params: { agreementId: string };
}) {
  const agreement = await getAgreementById(params.agreementId);

  if (!agreement || agreement.versions.length < 2) {
    notFound();
  }

  const [left, right] = agreement.versions;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Version comparison"
        title={`${agreement.title} changes`}
        description="Review inserted, deleted, and updated language across agreement versions and reconcile AI change summaries with stakeholder comments."
      />

      <Card className="p-6">
        <p className="text-sm text-slate-600">
          Comparing version {left.versionNumber} and version {right.versionNumber}. The current draft tightens security notice, shortens cure periods, and expands liability carve-outs.
        </p>
      </Card>

      <VersionDiff left={left.content} right={right.content} />
    </div>
  );
}
