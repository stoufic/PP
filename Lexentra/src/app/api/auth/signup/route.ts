import { NextResponse } from "next/server";
import { createOrganizationAdmin, setSessionCookie } from "@/lib/auth";
import { signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = signupSchema.parse(await request.json());
    const admin = await createOrganizationAdmin(body);
    await setSessionCookie(admin);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create organization."
      },
      { status: 400 }
    );
  }
}
