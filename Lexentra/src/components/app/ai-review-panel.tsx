"use client";

import { useState } from "react";
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
  playbookId
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
      body: JSON.stringify({ agreementId, playbookId })
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
        <div>
          <p className="text-lg font-semibold text-slate-950">Local AI review</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Runs against the configured self-hosted model and returns structured findings with clause citations.
          </p>
        </div>
        <Button disabled={loading} onClick={runReview}>
          {loading ? "Running review..." : "Run review"}
        </Button>
      </div>
      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      {result ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-[1.25rem] bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-900">Summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{result.summary}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
              Confidence {Math.round(result.confidence * 100)}%
            </p>
          </div>
          {result.findings.map((finding) => (
            <div className="rounded-[1.25rem] border border-border p-4" key={finding.title}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950">{finding.title}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {finding.severity} • {finding.sourceAnchor}
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{finding.summary}</p>
              <p className="mt-3 text-sm font-medium text-slate-900">{finding.recommendation}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
