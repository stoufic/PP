"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationName: formData.get("organizationName"),
        workspaceName: formData.get("workspaceName"),
        departmentName: formData.get("departmentName"),
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error || "Unable to create workspace.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Input name="organizationName" placeholder="Organization name" required />
      <Input name="workspaceName" placeholder="Workspace name" required />
      <Input name="departmentName" placeholder="Primary department" required />
      <Input name="name" placeholder="Your full name" required />
      <Input name="email" placeholder="Work email" required type="email" />
      <Input name="password" placeholder="Create a strong password" required type="password" />
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <Button className="h-11 w-full" disabled={loading} type="submit">
        {loading ? "Creating workspace..." : "Create organization"}
      </Button>
    </form>
  );
}
