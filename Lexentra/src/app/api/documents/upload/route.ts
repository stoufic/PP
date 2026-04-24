import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordAuditEvent } from "@/lib/audit";
import { enqueueJob } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";
import { extractTextFromBuffer } from "@/lib/documents/parser";
import { saveLocalFile } from "@/lib/storage/local";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const agreementId = String(formData.get("agreementId") || "");
    const file = formData.get("file");

    if (!agreementId || !(file instanceof File)) {
      return NextResponse.json({ error: "Agreement and file are required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = await saveLocalFile({
      organizationId: user.organizationId,
      agreementId,
      fileName: file.name,
      buffer
    });

    const extractedText = await extractTextFromBuffer({
      fileName: file.name,
      mimeType: file.type,
      buffer
    });

    const document = await prisma.document.create({
      data: {
        organizationId: user.organizationId,
        agreementId,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        filePath,
        format: file.name.toLowerCase().endsWith(".pdf")
          ? "PDF"
          : file.name.toLowerCase().endsWith(".docx")
            ? "DOCX"
            : "TXT",
        sizeBytes: file.size,
        extractedText,
        parseStatus: "queued"
      }
    });

    await enqueueJob({
      organizationId: user.organizationId,
      workspaceId: user.workspaceId,
      type: "INDEX_DOCUMENT",
      payload: {
        documentId: document.id
      }
    });

    await recordAuditEvent({
      organizationId: user.organizationId,
      agreementId,
      actorEmail: user.email,
      action: "DOCUMENT_UPLOADED",
      entityType: "Document",
      entityId: document.id
    });

    return NextResponse.json({ ok: true, documentId: document.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload document. Verify storage and database configuration."
      },
      { status: 400 }
    );
  }
}
