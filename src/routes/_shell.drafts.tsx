import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { issuesQueryOptions } from "@/lib/issues";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_shell/drafts")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: DraftsPage,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-danger">{error.message}</p>
        <Button size="sm" onClick={() => router.invalidate()}>다시 시도</Button>
      </div>
    );
  },
});

function DraftsPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">생성된 초안</h1>
        <p className="text-sm text-muted-foreground mt-1">
          수집된 이슈마다 정부 보고서 형식의 초안을 생성할 수 있습니다.
        </p>
      </header>
      <Suspense fallback={<div className="glass rounded-2xl p-6 text-sm text-muted-foreground">불러오는 중…</div>}>
        <List />
      </Suspense>
    </div>
  );
}

function List() {
  const { data: issues } = useSuspenseQuery(issuesQueryOptions());
  if (issues.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
        초안으로 만들 이슈가 아직 없어요.
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {issues.map((r, i) => (
        <div key={r.id} className="glass rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-2 terminal text-xs text-mint">
            <FileText className="h-3.5 w-3.5" /> Draft #{String(i + 1).padStart(3, "0")} ·{" "}
            {new Date(r.created_at).toLocaleDateString("ko-KR")}
          </div>
          <h3 className="mt-2 font-semibold leading-snug">{r.title}</h3>
          {r.summary && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.summary}</p>
          )}
          <div className="mt-auto pt-4">
            <Button asChild size="sm" variant="secondary">
              <Link to="/drafts/$id" params={{ id: r.id }}>리포트 열기</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
