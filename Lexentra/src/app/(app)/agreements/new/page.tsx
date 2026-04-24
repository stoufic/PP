import { PageHeader } from "@/components/app/page-header";
import { NewAgreementForm } from "@/components/app/new-agreement-form";
import { Card } from "@/components/ui/card";

export default function NewAgreementPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create agreement"
        title="Start a new agreement record"
        description="Create from scratch, attach ownership and workflow metadata, then upload source documents for parsing and AI-assisted review."
      />

      <Card className="p-6">
        <NewAgreementForm />
      </Card>
    </div>
  );
}
