import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/app/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f2ed] px-6 py-10">
      <Card className="grid w-full max-w-5xl gap-10 overflow-hidden p-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#111827] px-8 py-10 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Create workspace</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
            Launch a controlled environment for legal, procurement, and finance teams.
          </h1>
          <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
            <p>Organizations start with a secure admin account, a primary workspace, and seed-ready policy structures for templates, playbooks, users, and audit logs.</p>
            <p>Local AI settings can be configured after onboarding, with model endpoints kept fully self-hosted.</p>
          </div>
        </div>
        <div className="px-8 py-10">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Workspace setup</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
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
