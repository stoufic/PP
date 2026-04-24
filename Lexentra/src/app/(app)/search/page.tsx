import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { getSearchResults } from "@/lib/data";

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "payment terms";
  const results = await getSearchResults(query);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Search"
        title="Keyword and semantic retrieval"
        description="Search agreements, clauses, risk issues, and metadata using standard filters today and local semantic retrieval as the indexing service runs."
      />

      <Card className="p-6">
        <form className="flex flex-col gap-3 md:flex-row">
          <input
            className="h-11 flex-1 rounded-2xl border border-border bg-white px-4 text-sm outline-none"
            defaultValue={query}
            name="q"
            placeholder="Search clauses, counterparties, statuses, owners..."
          />
          <button className="rounded-full bg-foreground px-5 text-sm font-semibold text-white" type="submit">
            Search
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        {results.map((result) => (
          <Card className="p-6" key={result.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">{result.title}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {result.kind} • {result.status}
                  {result.sourceAnchor ? ` • ${result.sourceAnchor}` : ""}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{result.matchSummary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
