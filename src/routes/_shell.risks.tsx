import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { IssueCard } from "@/components/issue-card";
import { issuesQueryOptions } from "@/lib/issues";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/risks")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: RisksPage,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-danger">데이터를 불러오지 못했어요: {error.message}</p>
        <Button size="sm" onClick={() => router.invalidate()}>다시 시도</Button>
      </div>
    );
  },
});

function RisksPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">신규 위험</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Supabase `issues` 테이블에서 실시간으로 가져온 프라이버시 리스크 목록입니다.
        </p>
      </header>
      <Suspense fallback={<div className="glass rounded-2xl p-6 text-sm text-muted-foreground">불러오는 중…</div>}>
        <IssuesList />
      </Suspense>
    </div>
  );
}

function IssuesList() {
  const { data: issues } = useSuspenseQuery(issuesQueryOptions());
  if (issues.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
        아직 수집된 이슈가 없어요. 모니터링 잡이 실행되면 자동으로 표시됩니다.
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {issues.map((i) => (
        <IssueCard key={i.id} issue={i} />
      ))}
    </div>
  );
}
