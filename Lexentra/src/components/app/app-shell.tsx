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
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { hasPermission } from "@/lib/rbac";
import { SessionUser } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "agreements:view" as const },
  { href: "/agreements", label: "Agreements", icon: FileText, permission: "agreements:view" as const },
  { href: "/review-center", label: "Review Center", icon: ShieldCheck, permission: "agreements:review" as const },
  { href: "/approval-queue", label: "Approval Queue", icon: Activity, permission: "agreements:approve" as const },
  { href: "/signature-queue", label: "Signature Queue", icon: Signature, permission: "agreements:sign" as const },
  { href: "/templates", label: "Templates", icon: BookCopy, permission: "templates:manage" as const },
  { href: "/playbooks", label: "Playbooks", icon: Scale, permission: "playbooks:manage" as const },
  { href: "/search", label: "Search", icon: Search, permission: "agreements:view" as const },
  { href: "/reports", label: "Reports", icon: Activity, permission: "reports:view" as const },
  { href: "/admin/users", label: "Users", icon: Users, permission: "admin:manage-users" as const },
  { href: "/admin/audit-logs", label: "Audit Log", icon: History, permission: "admin:view-audit" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings, permission: "settings:manage-ai" as const },
];

export function AppShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const pathname = usePathname();
  const visible = navItems.filter((item) => hasPermission(user.role, item.permission));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar spacer */}
      <div className="w-16 flex-shrink-0" />

      {/* Fixed sidebar */}
      <aside className="group fixed left-0 top-0 z-40 flex h-full w-16 flex-col overflow-hidden border-r border-border bg-surface transition-[width] duration-300 ease-in-out hover:w-60">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex h-16 flex-shrink-0 items-center border-b border-border px-4"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
            LX
          </div>
          <div className="ml-3 min-w-0 overflow-hidden">
            <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Lexentra
            </p>
            <p className="whitespace-nowrap text-sm font-semibold text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Agreement ops
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
          {visible.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-10 items-center rounded-lg mx-2 my-0.5 transition-colors",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface-raised hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
                )}
                <div className="flex w-10 flex-shrink-0 items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-border p-2">
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-foreground">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="whitespace-nowrap text-sm font-semibold text-foreground">{user.name}</p>
              <p className="whitespace-nowrap text-xs text-muted">{user.title}</p>
            </div>
            <div className="flex-shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="mx-auto max-w-[1400px] px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
