import { NextResponse } from "next/server";
import { answerAgreementQuestion } from "@/lib/ai/review";
import { askAgreementSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = askAgreementSchema.parse(await request.json());
    const result = await answerAgreementQuestion(body.agreementId, body.question);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to answer question."
      },
      { status: 400 }
    );
  }
}
