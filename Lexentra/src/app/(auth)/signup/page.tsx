import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/app/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <Card className="grid w-full max-w-5xl gap-10 overflow-hidden p-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#111827] px-8 py-10 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
              LX
            </div>
            <span className="text-sm font-semibold text-white">Lexentra</span>
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-slate-400">Create workspace</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Launch a controlled environment for legal, procurement, and finance teams.
          </h1>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-300">
            <p>Organizations start with a secure admin account, a primary workspace, and seed-ready policy structures for templates, playbooks, users, and audit logs.</p>
            <p>Local AI settings can be configured after onboarding, with model endpoints kept fully self-hosted.</p>
          </div>
        </div>
        <div className="px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Workspace setup</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Create your Lexentra organization
          </h2>
          <div className="mt-8">
            <SignupForm />
          </div>
        </div>
      </Card>
    </div>
  );
}
