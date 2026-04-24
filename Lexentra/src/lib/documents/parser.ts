import { extname } from "node:path";

type Section = {
  title: string;
  text: string;
};

export async function extractTextFromBuffer(params: {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}) {
  const extension = extname(params.fileName).toLowerCase();

  if (extension === ".txt" || params.mimeType === "text/plain") {
    return params.buffer.toString("utf8");
  }

  if (extension === ".docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: params.buffer });
    return result.value;
  }

  if (extension === ".pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(params.buffer);
    return result.text;
  }

  throw new Error(`Unsupported file type for ${params.fileName}`);
}

export function splitIntoSections(text: string): Section[] {
  const cleaned = text.replace(/\r/g, "").trim();
  const blocks = cleaned.split(/\n{2,}/);
  const sections: Section[] = [];

  for (const block of blocks) {
    const [firstLine, ...rest] = block.split("\n");
    const titleLike =
      /^[0-9]+[.)]\s+/.test(firstLine) ||
      /^[A-Z][A-Z\s/-]{4,}$/.test(firstLine.trim()) ||
      /section/i.test(firstLine);

    sections.push({
      title: titleLike ? firstLine.trim() : `Section ${sections.length + 1}`,
      text: titleLike ? rest.join(" ").trim() || firstLine.trim() : block.trim()
    });
  }

  return sections.filter((section) => section.text.length > 0);
}

export function chunkSections(sections: Section[], maxCharacters = 900) {
  const chunks: Array<{
    sectionTitle: string;
    text: string;
    sourceAnchor: string;
    ordinal: number;
  }> = [];

  for (const section of sections) {
    const sentences = section.text.split(/(?<=[.?!])\s+/);
    let current = "";

    for (const sentence of sentences) {
      const candidate = current ? `${current} ${sentence}` : sentence;

      if (candidate.length > maxCharacters && current) {
        chunks.push({
          sectionTitle: section.title,
          text: current.trim(),
          sourceAnchor: section.title,
          ordinal: chunks.length
        });
        current = sentence;
      } else {
        current = candidate;
      }
    }

    if (current.trim()) {
      chunks.push({
        sectionTitle: section.title,
        text: current.trim(),
        sourceAnchor: section.title,
        ordinal: chunks.length
      });
    }
  }

  return chunks;
}

export function extractKeyFacts(text: string) {
  const paymentMatch = text.match(/pay(?:ment)?[^.]{0,120}(?:within|net)\s+\d+\s+days/i);
  const terminationMatch = text.match(/terminate[^.]{0,200}/i);
  const renewalMatch = text.match(/renew[^.]{0,200}/i);
  const dates = Array.from(text.matchAll(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/gi)).map(
    (match) => match[0]
  );

  return {
    paymentTerms: paymentMatch?.[0] || null,
    terminationRights: terminationMatch?.[0] || null,
    renewalTerms: renewalMatch?.[0] || null,
    dates
  };
}

export function summarizeParsedDocument(text: string) {
  const sections = splitIntoSections(text).slice(0, 4);
  return sections.map((section) => `${section.title}: ${section.text.slice(0, 120)}`).join(" ");
}
