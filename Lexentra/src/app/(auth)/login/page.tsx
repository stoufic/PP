import Link from "next/link";
import { LoginForm } from "@/components/app/login-form";
import { demoCredentials } from "@/lib/fixtures";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Local AI review with playbook enforcement and source citations",
  "Structured workflows across reviewers, approvers, and signers",
  "Searchable audit trail for all actions, changes, and policy outcomes",
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Form side */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
                LX
              </div>
              <span className="text-sm font-semibold text-foreground">Lexentra</span>
            </Link>
            <h1 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
              Sign in to your workspace
            </h1>
            <p className="mt-2 text-sm text-muted">
              Access review queues, approvals, playbooks, and audit-grade activity.
            </p>
          </div>

          <LoginForm demoHint={`${demoCredentials.email} / ${demoCredentials.password}`} />

          <p className="text-sm text-muted">
            Need a workspace?{" "}
            <Link className="font-medium text-accent hover:underline" href="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Panel side */}
      <div className="hidden w-[480px] flex-shrink-0 bg-[#111827] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Why Lexentra
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Contract infrastructure for organizations where precision is operational.
          </h2>
        </div>

        <div className="space-y-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-xl border border-white/8 bg-white/5 p-5"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <p className="text-sm leading-relaxed text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
