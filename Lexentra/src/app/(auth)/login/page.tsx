import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/app/login-form";
import { demoCredentials } from "@/lib/fixtures";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-[#f4f2ed] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Lexentra</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            Sign in to your agreement workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Access review queues, approvals, playbooks, and audit-grade activity from one secure workspace.
          </p>
          <div className="mt-8">
            <LoginForm
              demoHint={`${demoCredentials.email} / ${demoCredentials.password}`}
            />
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Need a workspace?{" "}
            <Link className="font-semibold text-slate-900" href="/signup">
              Create one
            </Link>
          </p>
        </Card>
      </div>

      <div className="hidden bg-[#111827] px-10 py-12 text-slate-200 lg:block">
        <div className="mx-auto flex h-full max-w-xl flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Why Lexentra</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
              Contract infrastructure for organizations where precision is operational.
            </h2>
          </div>
          <div className="space-y-4">
            {[
              "Local AI review with playbook enforcement and source citations",
              "Structured workflows across reviewers, approvers, and signers",
              "Searchable audit trail for actions, changes, and policy outcomes"
            ].map((item) => (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5" key={item}>
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
