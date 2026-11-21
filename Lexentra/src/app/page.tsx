import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Sparkles, Lock, BarChart3, FileCheck } from "lucide-react";

const capabilities = [
  {
    icon: FileCheck,
    title: "Agreement lifecycle",
    description: "Control agreements across draft, review, approval, signature, execution, and archive with structured ownership at each stage.",
  },
  {
    icon: Sparkles,
    title: "Local AI review",
    description: "Self-hosted AI returns structured findings with clause citations and playbook enforcement—no external tokens required.",
  },
  {
    icon: BarChart3,
    title: "Operational reporting",
    description: "Risk distribution, cycle time analysis, renewal pressure, and bottleneck identification in one reporting surface.",
  },
  {
    icon: Lock,
    title: "Audit-grade control",
    description: "Every action, decision, and configuration change is logged with actor, timestamp, and contextual metadata.",
  },
];

const useCases = [
  "Legal teams governing non-standard vendor terms",
  "Procurement teams coordinating review and renewal risk",
  "Finance teams enforcing approval controls and liability thresholds",
  "Operations teams auditing obligations and data use",
];

const faq = [
  {
    question: "Does Lexentra require hosted AI tokens?",
    answer: "No. The platform runs against a local inference layer such as Ollama or a self-hosted model endpoint, with local embeddings and retrieval.",
  },
  {
    question: "Is this only for signature workflows?",
    answer: "No. Signature is one stage in a broader system for drafting, policy review, approvals, coordination, search, and audit-grade traceability.",
  },
  {
    question: "Can organizations apply internal playbooks?",
    answer: "Yes. Teams can define preferred clauses, fallback language, escalation rules, and unacceptable terms, then apply them consistently during AI-assisted review.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
              LX
            </div>
            <span className="text-sm font-semibold text-foreground">Lexentra</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-foreground/80"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Enterprise contract infrastructure
            </div>
            <h1 className="text-5xl font-semibold leading-[1.15] tracking-tight text-foreground md:text-6xl">
              Precision for agreements<br />where it matters most
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
              Lexentra helps legal, procurement, finance, and operations teams create, review, approve, execute, and audit complex agreements with institutional-grade reliability.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
              >
                Start a workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
              >
                View product
              </Link>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-[#111827] p-6 shadow-elevated">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Dashboard</p>
                <p className="mt-1 text-base font-semibold text-white">Agreement operations</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["Awaiting review", "6", "text-blue-400"],
                ["Risk alerts", "2", "text-red-400"],
                ["Avg cycle time", "11.8d", "text-slate-300"],
                ["Renewals in 90d", "14", "text-yellow-400"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/8 bg-white/5 p-4"
                >
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className={`mt-3 text-2xl font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/8 p-4">
              <p className="text-xs font-semibold text-amber-300">Risk alert</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                MedAxis Cloud MSA requires escalation. Liability cap below policy threshold.
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-12 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Capabilities</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Everything the deal requires
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-xl border border-border bg-surface p-6 shadow-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                    <cap.icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="mt-4 font-semibold text-foreground">{cap.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-surface-raised">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">How it works</p>
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    Local AI with accountable contract operations
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  Documents are uploaded, parsed, sectioned, and indexed locally. Teams coordinate review, approvals, signature readiness, and audit logging in a single environment — no external dependencies on AI tokens or third-party data processing.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Upload PDF, DOCX, or TXT and preserve searchable structure.",
                  "Index clauses locally for enterprise retrieval and Q&A.",
                  "Compare drafts against playbooks with source-aware findings.",
                  "Track every approval, decision, and signature event.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-xl border border-border bg-surface p-5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                    <p className="text-sm leading-relaxed text-muted">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Who it&apos;s for</p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  Built for teams that cannot afford casual agreement handling
                </h2>
                <p className="text-sm leading-relaxed text-muted">
                  Role-based access, tenant isolation, audit logging, local model control, and secure file handling are designed in from the start.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {useCases.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-xl border border-border bg-surface p-5"
                  >
                    <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <p className="text-sm leading-relaxed text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-surface-raised">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <div className="mb-10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">FAQ</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                Questions enterprise teams ask first
              </h2>
            </div>
            <div className="space-y-4">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <p className="font-semibold text-foreground">{item.question}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="rounded-2xl bg-[#111827] px-8 py-12 md:px-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Ready to start
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">
                    Bring contract review, policy enforcement, and execution into one platform.
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
                  >
                    Create workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <p className="text-sm text-muted">
            © 2025 Lexentra. AI infrastructure for high-stakes agreements.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">Home</Link>
            <Link href="/login" className="text-sm text-muted transition-colors hover:text-foreground">Login</Link>
            <Link href="/signup" className="text-sm text-muted transition-colors hover:text-foreground">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
