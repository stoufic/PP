import { NextResponse } from "next/server";
import { localAiAvailable } from "@/lib/ai/ollama";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "lexentra",
    localAiAvailable: await localAiAvailable(),
    timestamp: new Date().toISOString()
  });
}
