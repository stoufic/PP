import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="System and AI settings"
        description="Configure local model endpoints, storage roots, prompts, retention posture, and organization-wide controls from a single admin surface."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Local AI settings</p>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <p>Base URL: {process.env.LOCAL_LLM_BASE_URL || "http://localhost:11434"}</p>
            <p>Chat model: {process.env.LOCAL_LLM_CHAT_MODEL || "local-instruct-model"}</p>
            <p>Embedding model: {process.env.LOCAL_LLM_EMBED_MODEL || "local-embed-model"}</p>
            <p>Storage path: {process.env.LOCAL_STORAGE_PATH || "./uploads"}</p>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-lg font-semibold text-slate-950">Controls in scope</p>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-600">
            <li>Prompt governance and model swappability</li>
            <li>Tenant-aware file storage policy</li>
            <li>Audit retention and searchable activity review</li>
            <li>Role configuration and route protection</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
