import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { embedText } from "@/lib/ai/ollama";
import {
  chunkSections,
  extractKeyFacts,
  splitIntoSections,
  summarizeParsedDocument
} from "@/lib/documents/parser";

export async function enqueueJob(input: {
  organizationId: string;
  workspaceId: string;
  type: string;
  payload: Record<string, unknown>;
}) {
  return prisma.job.create({
    data: {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      type: input.type,
      payload: input.payload as Prisma.InputJsonValue
    }
  });
}

export async function processNextJob() {
  const job = await prisma.job.findFirst({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" }
  });

  if (!job) {
    return null;
  }

  await prisma.job.update({
    where: { id: job.id },
    data: { status: "RUNNING" }
  });

  try {
    if (job.type === "INDEX_DOCUMENT") {
      const payload = job.payload as { documentId: string };
      const document = await prisma.document.findUnique({
        where: { id: payload.documentId }
      });

      if (!document?.extractedText) {
        throw new Error("Document not ready for indexing.");
      }

      const sections = splitIntoSections(document.extractedText);
      const chunks = chunkSections(sections);
      await prisma.documentChunk.deleteMany({ where: { documentId: document.id } });

      for (const chunk of chunks) {
        let embedding: number[] | null = null;

        try {
          embedding = await embedText(chunk.text);
        } catch {
          embedding = null;
        }

        await prisma.documentChunk.create({
          data: {
            documentId: document.id,
            ordinal: chunk.ordinal,
            sectionTitle: chunk.sectionTitle,
            sourceAnchor: chunk.sourceAnchor,
            text: chunk.text,
            embedding: (embedding ?? Prisma.JsonNull) as Prisma.InputJsonValue
          }
        });
      }

      const facts = extractKeyFacts(document.extractedText);
      await prisma.document.update({
        where: { id: document.id },
        data: {
          parseStatus: "indexed",
          extractedMeta: {
            summary: summarizeParsedDocument(document.extractedText),
            facts
          } as Prisma.InputJsonValue
        }
      });
    }

    await prisma.job.update({
      where: { id: job.id },
      data: { status: "COMPLETED" }
    });

    return job;
  } catch (error) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown job error"
      }
    });

    throw error;
  }
}
