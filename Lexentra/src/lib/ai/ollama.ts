type GenerateOptions = {
  prompt: string;
  system?: string;
};

const baseUrl = process.env.LOCAL_LLM_BASE_URL || "http://localhost:11434";
const chatModel = process.env.LOCAL_LLM_CHAT_MODEL || "local-instruct-model";
const embedModel = process.env.LOCAL_LLM_EMBED_MODEL || "local-embed-model";

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Local model request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

function extractJson(text: string) {
  const fenced = text.match(/```json([\s\S]*?)```/i);
  if (fenced) {
    return fenced[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace >= 0) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text.trim();
}

export async function localAiAvailable() {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function generateText(options: GenerateOptions) {
  const response = await postJson<{ response: string }>("/api/generate", {
    model: chatModel,
    prompt: options.system
      ? `${options.system}\n\nUser request:\n${options.prompt}`
      : options.prompt,
    stream: false
  });

  return response.response;
}

export async function generateJson<T>(options: GenerateOptions) {
  const response = await postJson<{ response: string }>("/api/generate", {
    model: chatModel,
    prompt: `${options.system || ""}\n\nReturn only valid JSON.\n\n${options.prompt}`.trim(),
    format: "json",
    stream: false
  });

  return JSON.parse(extractJson(response.response)) as T;
}

export async function embedText(text: string) {
  try {
    const modern = await postJson<{ embeddings: number[][] }>("/api/embed", {
      model: embedModel,
      input: text
    });

    return modern.embeddings[0] || [];
  } catch {
    const legacy = await postJson<{ embedding: number[] }>("/api/embeddings", {
      model: embedModel,
      prompt: text
    });

    return legacy.embedding || [];
  }
}
