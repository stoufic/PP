import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordAuditEvent } from "@/lib/audit";
import { runAgreementReview } from "@/lib/ai/review";
import { aiReviewSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = aiReviewSchema.parse(await request.json());
    const result = await runAgreementReview(body.agreementId, body.playbookId);

    await recordAuditEvent({
      organizationId: user.organizationId,
      agreementId: body.agreementId,
      actorEmail: user.email,
      action: "AI_REVIEW_RUN",
      entityType: "Agreement",
      entityId: body.agreementId,
      metadata: {
        playbookId: body.playbookId
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "AI review failed."
      },
      { status: 400 }
    );
  }
}
