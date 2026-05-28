import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { draftsQueryOptions, type Draft } from "@/lib/drafts";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { BriefingDialog } from "@/components/briefing-dialog";
import type { Issue } from "@/lib/issues";

export const Route = createFileRoute("/_shell/drafts")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(draftsQueryOptions());
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
          AI로 생성·저장된 정책보고서 초안 목록입니다. 카드를 누르면 내용을 확인할 수 있어요.
        </p>
      </header>
      <Suspense fallback={<div className="glass rounded-2xl p-6 text-sm text-muted-foreground">불러오는 중…</div>}>
        <List />
      </Suspense>
    </div>
  );
}

function draftToIssue(d: Draft): Issue {
  return {
    id: d.issue_id,
    title: d.issue_title,
    summary: d.issue_summary,
    source: null,
    source_url: null,
    category: null,
    novelty_score: null,
    relevance_score: null,
    capability_tags: null,
    privacy_implications: null,
    created_at: d.created_at,
  };
}

function List() {
  const { data: drafts } = useSuspenseQuery(draftsQueryOptions());
  const [selected, setSelected] = useState<Draft | null>(null);

  if (drafts.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
        아직 생성된 초안이 없어요. 대시보드 카드의 <strong>Generate Briefing</strong> 버튼으로 초안을 만들어 보세요.
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {drafts.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setSelected(d)}
            className="glass rounded-2xl p-5 flex flex-col text-left transition-all hover:-translate-y-0.5 hover:border-mint/40"
          >
            <div className="flex items-center gap-2 terminal text-xs text-mint">
              <FileText className="h-3.5 w-3.5" /> Draft #{String(i + 1).padStart(3, "0")} ·{" "}
              {new Date(d.created_at).toLocaleDateString("ko-KR")}
            </div>
            <h3 className="mt-2 font-semibold leading-snug">{d.issue_title}</h3>
            {d.issue_summary && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.issue_summary}</p>
            )}
            <p className="mt-3 text-xs text-mint/80 terminal">→ 보고서 열기</p>
          </button>
        ))}
      </div>

      {selected && (
        <BriefingDialog
          issue={draftToIssue(selected)}
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
        />
      )}
    </>
  );
}
