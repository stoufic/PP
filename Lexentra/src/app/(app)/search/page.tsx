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
    <div className="space-y-10">
      <PageHeader
        eyebrow="Search"
        title="Keyword and semantic retrieval"
        description="Search agreements, clauses, risk issues, and metadata using standard filters today and local semantic retrieval as the indexing service runs."
      />

      <Card className="p-6">
        <form className="flex flex-col gap-3 md:flex-row">
          <input
            className="h-11 flex-1 rounded-lg border border-border bg-surface px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
            defaultValue={query}
            name="q"
            placeholder="Search clauses, counterparties, statuses, owners..."
          />
          <button
            className="rounded-lg bg-foreground px-5 text-sm font-medium text-white transition-colors hover:bg-foreground/80"
            type="submit"
          >
            Search
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        {results.map((result) => (
          <Card className="p-6" key={result.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-foreground">{result.title}</p>
                <p className="mt-2 text-sm text-muted">
                  {result.kind} · {result.status}
                  {result.sourceAnchor ? ` · ${result.sourceAnchor}` : ""}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{result.matchSummary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
