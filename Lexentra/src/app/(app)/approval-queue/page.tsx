import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPendingApprovals } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function ApprovalQueuePage() {
  const items = await getPendingApprovals();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Approval queue"
        title="Pending approvals"
        description="Track staged approvers, enforce order, and surface agreements blocked on required sign-off."
      />

      <div className="grid gap-5">
        {items.map((item) => (
          <Card className="p-6" key={item.step.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{item.agreementTitle}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {item.counterparty} • Assigned to {item.step.assignee}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="warning">Pending</Badge>
                <p className="text-sm text-slate-500">Due {formatDate(item.step.dueAt)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
