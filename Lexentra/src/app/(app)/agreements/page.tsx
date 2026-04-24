import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { getAgreements } from "@/lib/data";
import { formatDate, sentenceCase } from "@/lib/utils";

export default async function AgreementsPage() {
  const agreements = await getAgreements();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Agreement register"
        title="Agreement lifecycle management"
        description="Track agreements across draft, review, approval, signature, execution, expiration, and archive states with structured ownership."
        actions={
          <Link href="/agreements/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New agreement
            </Button>
          </Link>
        }
      />

      <Table>
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            <th className="px-5 py-4">Agreement</th>
            <th className="px-5 py-4">Counterparty</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Risk</th>
            <th className="px-5 py-4">Effective</th>
            <th className="px-5 py-4 text-right">Open</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {agreements.map((agreement) => (
            <tr key={agreement.id}>
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-950">{agreement.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {agreement.agreementNumber} • {agreement.agreementType}
                </p>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{agreement.counterparty}</td>
              <td className="px-5 py-4">
                <Badge tone={agreement.status === "NEEDS_CHANGES" ? "warning" : agreement.status === "EXECUTED" ? "success" : "default"}>
                  {sentenceCase(agreement.status)}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <Badge tone={agreement.riskLevel === "High" || agreement.riskLevel === "Critical" ? "danger" : agreement.riskLevel === "Medium" ? "warning" : "success"}>
                  {agreement.riskLevel}
                </Badge>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{formatDate(agreement.effectiveDate)}</td>
              <td className="px-5 py-4 text-right">
                <Link className="text-sm font-semibold text-slate-900" href={`/agreements/${agreement.id}`}>
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
