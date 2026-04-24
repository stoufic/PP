import { NextResponse } from "next/server";
import { authenticateWithPassword, setSessionCookie } from "@/lib/auth";
import { recordAuditEvent } from "@/lib/audit";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await authenticateWithPassword(body.email, body.password);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await setSessionCookie(user);
    await recordAuditEvent({
      organizationId: user.organizationId,
      actorEmail: user.email,
      action: "LOGIN",
      entityType: "Session"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Login failed."
      },
      { status: 400 }
    );
  }
}
