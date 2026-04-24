import { Permission, UserRole } from "@/lib/types";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "agreements:view",
    "agreements:create",
    "agreements:review",
    "agreements:approve",
    "agreements:sign",
    "templates:manage",
    "playbooks:manage",
    "reports:view",
    "admin:manage-users",
    "admin:view-audit",
    "settings:manage-ai"
  ],
  LEGAL_MANAGER: [
    "agreements:view",
    "agreements:create",
    "agreements:review",
    "agreements:approve",
    "templates:manage",
    "playbooks:manage",
    "reports:view"
  ],
  REVIEWER: ["agreements:view", "agreements:review", "reports:view"],
  APPROVER: ["agreements:view", "agreements:approve", "reports:view"],
  SIGNER: ["agreements:view", "agreements:sign"],
  VIEWER: ["agreements:view", "reports:view"]
};

export function getPermissions(role: UserRole) {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}
