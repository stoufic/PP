"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ReviewPayload = {
  summary: string;
  confidence: number;
  findings: Array<{
    title: string;
    severity: string;
    summary: string;
    recommendation: string;
    sourceAnchor: string;
    confidence: number;
  }>;
};

export function AIReviewPanel({
  agreementId,
  playbookId,
}: {
  agreementId: string;
  playbookId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReviewPayload | null>(null);

  async function runReview() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/ai/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agreementId, playbookId }),
    });
    setLoading(false);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error || "Unable to run AI review.");
      return;
    }
    setResult((await response.json()) as ReviewPayload);
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Local AI review</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Runs against your self-hosted model. Returns structured findings with clause citations.
            </p>
          </div>
        </div>
        <Button disabled={loading} onClick={runReview} variant="secondary">
          {loading ? "Running…" : "Run review"}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-surface-raised p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">Summary</p>
              <span className="text-xs font-medium text-muted">
                {Math.round(result.confidence * 100)}% confidence
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{result.summary}</p>
          </div>
          {result.findings.map((finding) => (
            <div className="rounded-lg border border-border p-4" key={finding.title}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{finding.title}</p>
                <p className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-muted">
                  {finding.severity} · {finding.sourceAnchor}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{finding.summary}</p>
              <p className="mt-3 text-sm font-medium text-foreground">{finding.recommendation}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
