"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NewAgreementForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/agreements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        agreementType: formData.get("agreementType"),
        counterparty: formData.get("counterparty"),
        department: formData.get("department"),
        status: formData.get("status"),
        effectiveDate: formData.get("effectiveDate"),
        expirationDate: formData.get("expirationDate"),
        renewalTerms: formData.get("renewalTerms"),
        tags: String(formData.get("tags") || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      })
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error || "Unable to create agreement.");
      return;
    }

    const payload = (await response.json()) as { id: string };
    router.push(`/agreements/${payload.id}`);
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="title" placeholder="Agreement title" required />
        <Input name="agreementType" placeholder="Agreement type" required />
        <Input name="counterparty" placeholder="Counterparty" required />
        <Input name="department" placeholder="Department" required />
        <Input name="effectiveDate" type="date" />
        <Input name="expirationDate" type="date" />
      </div>
      <select
        className="h-11 rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        defaultValue="DRAFT"
        name="status"
      >
        <option value="DRAFT">Draft</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="NEEDS_CHANGES">Needs Changes</option>
      </select>
      <Textarea name="renewalTerms" placeholder="Renewal terms" />
      <Input name="tags" placeholder="Tags, comma separated" />
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <div className="flex justify-end">
        <Button disabled={loading} type="submit">
          {loading ? "Creating..." : "Create agreement"}
        </Button>
      </div>
    </form>
  );
}
