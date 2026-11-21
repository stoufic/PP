import { PageHeader } from "@/components/app/page-header";
import { Table } from "@/components/ui/table";
import { getUsers } from "@/lib/data";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Administration"
        title="User management"
        description="Manage workspace access, roles, departments, and approval responsibilities with clear tenant boundaries."
      />

      <Table>
        <thead>
          <tr className="border-b border-border bg-surface-raised">
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">User</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Role</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Department</th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-widest text-muted">Title</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-surface-raised">
              <td className="px-5 py-4">
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="mt-1 text-sm text-muted">{user.email}</p>
              </td>
              <td className="px-5 py-4 text-sm text-muted">{user.role}</td>
              <td className="px-5 py-4 text-sm text-muted">{user.departmentName}</td>
              <td className="px-5 py-4 text-sm text-muted">{user.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
