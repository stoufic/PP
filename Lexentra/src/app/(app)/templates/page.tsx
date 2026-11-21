import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { getTemplates } from "@/lib/data";

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Template library"
        title="Reusable agreement templates"
        description="Standardize document generation with default metadata, clause blocks, and workflow routing tailored to each agreement type."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {templates.map((template) => (
          <Card className="p-6" key={template.id}>
            <p className="text-base font-semibold text-foreground">{template.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{template.description}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Default metadata</p>
                <div className="mt-3 space-y-2 text-sm text-muted">
                  {Object.entries(template.defaultMetadata).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold text-foreground">{key}</span>: {value}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Workflow defaults</p>
                <div className="mt-3 space-y-2 text-sm text-muted">
                  <p>Reviewers: {template.workflowDefaults.reviewers.join(", ")}</p>
                  <p>Approvers: {template.workflowDefaults.approvers.join(", ")}</p>
                  <p>Signers: {template.workflowDefaults.signers.join(", ")}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
