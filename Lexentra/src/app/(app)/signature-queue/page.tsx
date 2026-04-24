import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPendingSignatures } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function SignatureQueuePage() {
  const items = await getPendingSignatures();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Signature readiness"
        title="Signature queue"
        description="Prepare agreements for future e-sign integrations while tracking signing order, internal completion, and audit history today."
      />

      <div className="grid gap-5">
        {items.map((item) => (
          <Card className="p-6" key={item.signature.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{item.agreementTitle}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {item.counterparty} • Signer {item.signature.signer}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={item.signature.status === "SENT" ? "warning" : "default"}>
                  {item.signature.status}
                </Badge>
                <p className="text-sm text-slate-500">
                  Requested {formatDate(item.signature.requestedAt)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
