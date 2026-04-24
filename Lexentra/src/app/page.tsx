import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const capabilities = [
  "Agreement lifecycle control across review, approval, signature, and audit.",
  "Self-hosted AI review with clause citations, playbook checks, and local RAG.",
  "Version comparison, redline visibility, and accountable approval routing.",
  "Operational reporting for risk, cycle time, renewals, and bottlenecks."
];

const useCases = [
  "Legal teams governing non-standard vendor terms",
  "Procurement teams coordinating review and renewal risk",
  "Finance teams enforcing approval controls and liability thresholds",
  "Healthcare and regulated operations teams auditing obligations and data use"
];

const faq = [
  {
    question: "Does Lexentra require hosted AI tokens?",
    answer:
      "No. The platform is designed to run against a local inference layer such as Ollama or a self-hosted model endpoint, with local embeddings and retrieval."
  },
  {
    question: "Is this only for signature workflows?",
    answer:
      "No. Signature is one stage in a broader system for drafting, policy review, approvals, coordination, search, and audit-grade traceability."
  },
  {
    question: "Can organizations apply internal playbooks?",
    answer:
      "Yes. Teams can define preferred clauses, fallback language, escalation rules, and unacceptable terms, then apply them consistently during AI-assisted review."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f2ed]">
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Lexentra</p>
          <p className="text-sm text-slate-700">AI infrastructure for high-stakes agreements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Create workspace</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-16 px-4 pb-20">
        <section className="grid gap-8 rounded-[2rem] border border-white/80 bg-[#fbfaf7] px-8 py-10 shadow-panel lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-14">
          <div className="space-y-6">
            <Badge>Enterprise contract infrastructure</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-slate-950 md:text-6xl">
                Precision for agreements where policy, risk, and execution all matter.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Lexentra helps legal, procurement, finance, and operations teams create,
                review, approve, execute, track, and audit complex agreements with the calm
                reliability expected of institutional software.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button className="h-12 px-5">
                  Start a workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="h-12 px-5" variant="secondary">
                  View product shell
                </Button>
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden border-slate-200 bg-[#121722] p-0 text-white">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Dashboard preview</p>
              <p className="mt-2 text-xl font-semibold">Risk, workflow, and execution in one operating view</p>
            </div>
            <div className="grid gap-4 px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Awaiting review", "6"],
                  ["Risk alerts", "2"],
                  ["Approval cycle time", "11.8d"],
                  ["Renewals in 90 days", "14"]
                ].map(([label, value]) => (
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4" key={label}>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.25rem] border border-amber-200/20 bg-amber-300/10 p-4 text-sm leading-6 text-slate-200">
                MedAxis Cloud MSA requires escalation. Liability cap remains below policy despite improved security notification language.
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          {capabilities.map((item) => (
            <Card className="p-6" key={item}>
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm leading-7 text-slate-700">{item}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">How it works</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Local AI with accountable contract operations
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Documents are uploaded, parsed, sectioned, indexed locally, and reviewed against
              internal playbooks. Teams then coordinate review, approvals, signature readiness,
              and audit logging in a single environment.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Upload PDF, DOCX, or TXT agreements and preserve searchable structure.",
              "Index clauses and embeddings locally for enterprise retrieval and Q&A.",
              "Compare drafts against playbooks with source-aware findings and confidence.",
              "Track every approval, decision, signature event, and configuration change."
            ].map((item) => (
              <Card className="p-5" key={item}>
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="mt-4 text-sm leading-7 text-slate-700">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-[2rem] border border-white/70 bg-[#fbfaf7] px-8 py-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Enterprise trust</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Built for teams that cannot afford casual agreement handling
            </h2>
            <div className="space-y-3 text-sm leading-7 text-slate-600">
              <p>Role-based access, tenant isolation, audit logging, local model control, secure file handling, and background indexing are designed in from the start.</p>
              <p>This is not a generic workflow wrapper. Lexentra is structured around high-stakes agreements where operational discipline matters as much as drafting quality.</p>
            </div>
          </div>
          <div className="grid gap-4">
            {useCases.map((item) => (
              <Card className="flex items-center gap-4 p-5" key={item}>
                <Shield className="h-5 w-5 text-accent" />
                <p className="text-sm text-slate-700">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">FAQ</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Questions enterprise teams ask first
            </h2>
          </div>
          <div className="grid gap-4">
            {faq.map((item) => (
              <Card className="p-6" key={item.question}>
                <p className="text-base font-semibold text-slate-950">{item.question}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#d4c4a9] bg-[#141b27] px-8 py-10 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Call to action</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                Bring contract review, policy enforcement, and execution into one serious platform.
              </h2>
            </div>
            <Link href="/signup">
              <Button className="h-12 px-5">Create Lexentra workspace</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
