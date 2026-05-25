import { Suspense, useMemo } from "react";
import { useRouter } from "@tanstack/react-router";
import { IssueCard } from "@/components/issue-card";
import { useLiveIssues, type Issue } from "@/lib/issues";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function CategoryPage({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: string | string[];
}) {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </header>
      <Suspense
        fallback={
          <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            불러오는 중…
          </div>
        }
      >
        <CategoryList category={category} />
      </Suspense>
    </div>
  );
}

function CategoryList({ category }: { category: string | string[] }) {
  const { issues, newIds, lastUpdated, isFetching, refetch } = useLiveIssues();
  const cats = Array.isArray(category) ? category : [category];
  const filtered = useMemo<Issue[]>(
    () =>
      issues.filter((i) => {
        const c = (i.category ?? "").toLowerCase().trim();
        return cats.some((target) => target.toLowerCase().trim() === c);
      }),
    [issues, cats.join("|")],
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap glass rounded-xl px-4 py-2.5">
        <span className="terminal text-[11px] text-muted-foreground flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isFetching ? "bg-purple animate-pulse-glow" : "bg-mint"
            }`}
          />
          Last updated ·{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString("ko-KR", { hour12: false })
            : "—"}{" "}
          · {filtered.length}건
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-mint hover:text-mint gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
          해당 카테고리의 이슈가 아직 없어요.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((i) => (
            <IssueCard key={i.id} issue={i} isNew={newIds.has(i.id)} />
          ))}
        </div>
      )}
    </>
  );
}

export function CategoryErrorComponent({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <div className="glass rounded-2xl p-6 text-center space-y-3">
      <p className="text-sm text-danger">
        데이터를 불러오지 못했어요: {error.message}
      </p>
      <Button size="sm" onClick={() => router.invalidate()}>
        다시 시도
      </Button>
    </div>
  );
}
