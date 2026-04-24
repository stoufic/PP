import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function recordAuditEvent(input: {
  organizationId: string;
  agreementId?: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: input.organizationId,
        agreementId: input.agreementId,
        actorEmail: input.actorEmail,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata as Prisma.InputJsonValue | undefined
      }
    });
  } catch {
    // The UI can still function in demo mode without a backing database.
  }
}
