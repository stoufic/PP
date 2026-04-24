"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function DocumentUploadForm({ agreementId }: { agreementId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(event.currentTarget);
    formData.set("agreementId", agreementId);

    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setMessage(payload.error || "Upload failed.");
      return;
    }

    setMessage("Document uploaded and queued for parsing/indexing.");
  }

  return (
    <form
      className="space-y-4 rounded-[1.25rem] border border-dashed border-border p-5"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">Upload source document</p>
        <p className="mt-1 text-sm text-slate-600">Supports PDF, DOCX, and TXT. Uploads are stored locally and queued for indexing.</p>
      </div>
      <input
        accept=".pdf,.docx,.txt"
        className="block w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
        name="file"
        required
        type="file"
      />
      <Button disabled={loading} type="submit">
        {loading ? "Uploading..." : "Upload document"}
      </Button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
