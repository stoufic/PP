import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAgreementSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";
import { recordAuditEvent } from "@/lib/audit";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = createAgreementSchema.parse(await request.json());
    const counterparty = await prisma.counterparty.upsert({
      where: {
        organizationId_name: {
          organizationId: user.organizationId,
          name: body.counterparty
        }
      },
      update: {},
      create: {
        organizationId: user.organizationId,
        name: body.counterparty
      }
    });

    const agreement = await prisma.agreement.create({
      data: {
        organizationId: user.organizationId,
        workspaceId: user.workspaceId,
        departmentId: user.departmentId,
        ownerId: user.id,
        counterpartyId: counterparty.id,
        title: body.title,
        agreementType: body.agreementType,
        status: body.status,
        summary: `${body.agreementType} agreement created in Lexentra.`,
        effectiveDate: body.effectiveDate ? new Date(body.effectiveDate) : undefined,
        expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
        renewalTerms: body.renewalTerms,
        tags: body.tags,
        metadata: {
          departmentName: body.department
        }
      }
    });

    await recordAuditEvent({
      organizationId: user.organizationId,
      agreementId: agreement.id,
      actorEmail: user.email,
      action: "AGREEMENT_CREATED",
      entityType: "Agreement",
      entityId: agreement.id
    });

    return NextResponse.json({ id: agreement.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create agreement. Check database connectivity and retry."
      },
      { status: 400 }
    );
  }
}
