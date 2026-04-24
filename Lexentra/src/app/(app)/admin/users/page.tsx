import { PageHeader } from "@/components/app/page-header";
import { Table } from "@/components/ui/table";
import { getUsers } from "@/lib/data";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="User management"
        description="Manage workspace access, roles, departments, and approval responsibilities with clear tenant boundaries."
      />

      <Table>
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            <th className="px-5 py-4">User</th>
            <th className="px-5 py-4">Role</th>
            <th className="px-5 py-4">Department</th>
            <th className="px-5 py-4">Title</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-950">{user.name}</p>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              </td>
              <td className="px-5 py-4 text-sm text-slate-600">{user.role}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{user.departmentName}</td>
              <td className="px-5 py-4 text-sm text-slate-600">{user.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
