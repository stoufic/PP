import { PageHeader } from "@/components/app/page-header";
import { Table } from "@/components/ui/table";
import { getAuditLogs } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Audit log"
        description="Every significant action is searchable, filterable, and attributable from day one."
      />

      <Table>
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            <th className="px-5 py-4">Action</th>
            <th className="px-5 py-4">Actor</th>
            <th className="px-5 py-4">Entity</th>
            <th className="px-5 py-4">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-950">{log.action}</p>
                <p className="mt-1 text-sm text-slate-500">{log.detail}</p>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{log.actorEmail}</td>
              <td className="px-5 py-4 text-sm text-slate-600">
                {log.entityType} • {log.entityId}
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{formatDate(log.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
