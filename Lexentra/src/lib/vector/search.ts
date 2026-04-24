import { clamp } from "@/lib/utils";

export function cosineSimilarity(a: number[], b: number[]) {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] * a[index];
    normB += b[index] * b[index];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return clamp(dot / (Math.sqrt(normA) * Math.sqrt(normB)));
}

export function rankByQuery(query: string, chunks: Array<{ text: string }>) {
  const tokens = query
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  return chunks
    .map((chunk) => ({
      ...chunk,
      score: tokens.reduce(
        (acc, token) => acc + (chunk.text.toLowerCase().includes(token) ? 1 : 0),
        0
      )
    }))
    .sort((left, right) => right.score - left.score);
}
