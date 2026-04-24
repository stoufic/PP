"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ demoHint }: { demoHint: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error || "Unable to sign in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Work email
        </label>
        <Input id="email" name="email" placeholder="legal@company.com" required type="email" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <Input id="password" name="password" placeholder="Enter password" required type="password" />
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <Button className="h-11 w-full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <p className="rounded-3xl bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-600">
        Demo access: {demoHint}
      </p>
    </form>
  );
}
