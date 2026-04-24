"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookCopy,
  FileText,
  History,
  LayoutDashboard,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Signature,
  Users
} from "lucide-react";
import { hasPermission } from "@/lib/rbac";
import { SessionUser } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "agreements:view" as const
  },
  {
    href: "/agreements",
    label: "Agreements",
    icon: FileText,
    permission: "agreements:view" as const
  },
  {
    href: "/review-center",
    label: "Review Center",
    icon: ShieldCheck,
    permission: "agreements:review" as const
  },
  {
    href: "/approval-queue",
    label: "Approval Queue",
    icon: Activity,
    permission: "agreements:approve" as const
  },
  {
    href: "/signature-queue",
    label: "Signature Queue",
    icon: Signature,
    permission: "agreements:sign" as const
  },
  {
    href: "/templates",
    label: "Templates",
    icon: BookCopy,
    permission: "templates:manage" as const
  },
  {
    href: "/playbooks",
    label: "Playbooks",
    icon: Scale,
    permission: "playbooks:manage" as const
  },
  {
    href: "/search",
    label: "Search",
    icon: Search,
    permission: "agreements:view" as const
  },
  {
    href: "/reports",
    label: "Reports",
    icon: Activity,
    permission: "reports:view" as const
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    permission: "admin:manage-users" as const
  },
  {
    href: "/admin/audit-logs",
    label: "Audit Log",
    icon: History,
    permission: "admin:view-audit" as const
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    permission: "settings:manage-ai" as const
  }
];

export function AppShell({
  user,
  children
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f2ed]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex flex-col rounded-panel border border-white/70 bg-[#111827] px-5 py-6 text-slate-200 shadow-panel">
          <Link className="block border-b border-slate-800 pb-6" href="/dashboard">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent px-3 py-2 text-sm font-bold text-slate-950">
                LX
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Lexentra</p>
                <p className="text-base font-semibold text-white">
                  AI infrastructure for agreements
                </p>
              </div>
            </div>
          </Link>

          <nav className="mt-6 space-y-1">
            {navItems
              .filter((item) => hasPermission(user.role, item.permission))
              .map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                      active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="mt-8 rounded-[1.25rem] border border-slate-800 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
            <p className="mt-2 text-sm font-semibold text-white">Enterprise Legal</p>
            <p className="mt-1 text-sm text-slate-400">Northbridge Health</p>
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-center gap-3 rounded-[1.25rem] border border-slate-800 bg-white/5 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">
                {initials(user.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.title}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="rounded-panel border border-white/70 bg-[#fbfaf7] p-6 shadow-panel">
          {children}
        </main>
      </div>
    </div>
  );
}
