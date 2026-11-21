import { PageHeader } from "@/components/app/page-header";
import { Table } from "@/components/ui/table";
import { getAuditLogs } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Administration"
        title="Audit log"
        description="Every significant action is searchable, filterable, and attributable from day one."
      />

      <Table>
        <thead>
          <tr className="border-b border-border bg-surface-raised">
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Action</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Actor</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Entity</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {logs.map((log) => (
            <tr key={log.id} className="transition-colors hover:bg-surface-raised">
              <td className="px-5 py-4">
                <p className="font-semibold text-foreground">{log.action}</p>
                <p className="mt-1 text-sm text-muted">{log.detail}</p>
              </td>
              <td className="px-5 py-4 text-sm text-muted">{log.actorEmail}</td>
              <td className="px-5 py-4 text-sm text-muted">
                {log.entityType} · {log.entityId}
              </td>
              <td className="px-5 py-4 text-sm text-muted">{formatDate(log.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
