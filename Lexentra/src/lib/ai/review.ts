import { demoAgreements, demoPlaybooks } from "@/lib/fixtures";
import { generateJson, generateText, localAiAvailable } from "@/lib/ai/ollama";
import { rankByQuery } from "@/lib/vector/search";

type ReviewResponse = {
  summary: string;
  confidence: number;
  findings: Array<{
    title: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    summary: string;
    recommendation: string;
    sourceAnchor: string;
    confidence: number;
  }>;
};

export async function runAgreementReview(agreementId: string, playbookId: string) {
  const agreement = demoAgreements.find((item) => item.id === agreementId);
  const playbook = demoPlaybooks.find((item) => item.id === playbookId);

  if (!agreement || !playbook) {
    throw new Error("Agreement or playbook not found.");
  }

  if (!(await localAiAvailable())) {
    throw new Error("Local AI service is unavailable. Start your Ollama or vLLM endpoint and retry.");
  }

  const sources = agreement.clauses
    .map((clause) => `${clause.sourceAnchor} | ${clause.heading}: ${clause.body}`)
    .join("\n");

  return generateJson<ReviewResponse>({
    system:
      "You are a contract review system. Be precise, cite clause anchors, and prefer conservative legal risk analysis.",
    prompt: `
Agreement title: ${agreement.title}
Agreement summary: ${agreement.summary}
Playbook: ${playbook.name}
Playbook rules:
${playbook.rules
  .map(
    (rule) =>
      `- ${rule.category} | preferred=${rule.preferredText} | fallback=${rule.fallbackText} | unacceptable=${rule.unacceptable}`
  )
  .join("\n")}

Agreement clauses:
${sources}

Return JSON with this exact shape:
{
  "summary": "string",
  "confidence": 0.0,
  "findings": [
    {
      "title": "string",
      "severity": "Low|Medium|High|Critical",
      "summary": "string",
      "recommendation": "string",
      "sourceAnchor": "string",
      "confidence": 0.0
    }
  ]
}
    `
  });
}

export async function answerAgreementQuestion(agreementId: string, question: string) {
  const agreement = demoAgreements.find((item) => item.id === agreementId);

  if (!agreement) {
    throw new Error("Agreement not found.");
  }

  if (!(await localAiAvailable())) {
    throw new Error("Local AI service is unavailable. Start your local inference service and retry.");
  }

  const clauseCorpus = agreement.clauses.map((clause) => ({
    text: `${clause.sourceAnchor} ${clause.heading} ${clause.body}`
  }));

  const context = rankByQuery(question, clauseCorpus)
    .slice(0, 5)
    .map((chunk) => chunk.text)
    .join("\n");

  const answer = await generateText({
    system:
      "You answer questions about agreements. Cite source anchors inline and be explicit when the agreement does not contain the requested information.",
    prompt: `
Question: ${question}

Agreement: ${agreement.title}

Relevant source material:
${context}
    `
  });

  return {
    answer,
    sources: agreement.clauses.slice(0, 3).map((clause) => ({
      sourceAnchor: clause.sourceAnchor,
      heading: clause.heading
    }))
  };
}
