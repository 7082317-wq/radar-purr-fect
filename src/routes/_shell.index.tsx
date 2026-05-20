import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { RadarAnimation } from "@/components/radar-animation";
import { IssueCard } from "@/components/issue-card";
import { MonitoringFeed } from "@/components/monitoring-feed";
import { issuesQueryOptions, type Issue } from "@/lib/issues";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Sparkles, ShieldAlert, Database } from "lucide-react";

export const Route = createFileRoute("/_shell/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: Dashboard,
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

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "mint",
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "mint" | "purple" | "danger";
}) {
  const toneCls =
    tone === "mint"
      ? "text-mint border-mint/30 bg-mint/5"
      : tone === "purple"
      ? "text-purple border-purple/30 bg-purple/5"
      : "text-danger border-danger/30 bg-danger/5";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`h-8 w-8 rounded-lg border grid place-items-center ${toneCls}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-display font-bold">{value}</div>
      <div className="terminal text-xs text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div
          className="absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-30"
          style={{ background: "var(--gradient-radar)" }}
        />
        <div className="flex flex-col md:flex-row md:items-center gap-6 relative">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 terminal text-xs text-mint">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse-glow" />
              SYSTEM ONLINE · LIVE DATA
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-bold tracking-tight">
              <span className="text-gradient">Privacy Radar</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              떠오르는 AI 프라이버시 리스크를 실시간으로 모니터링합니다.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-mint/40 text-mint bg-mint/5">
                <Activity className="h-3 w-3 mr-1" /> Live feed
              </Badge>
              <Badge variant="outline" className="border-purple/40 text-purple bg-purple/5">
                <Sparkles className="h-3 w-3 mr-1" /> AI agent · active
              </Badge>
            </div>
          </div>
          <RadarAnimation />
        </div>
      </header>

      <Suspense fallback={<div className="glass rounded-2xl p-6 text-sm text-muted-foreground">불러오는 중…</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardContent() {
  const { data: issues } = useSuspenseQuery(issuesQueryOptions());

  const total = issues.length;
  const highRisk = issues.filter((i) => (i.novelty_score ?? 0) >= 80 || (i.relevance_score ?? 0) >= 80).length;
  const categories = new Set(issues.map((i) => i.category).filter(Boolean)).size;
  const latest = issues[0]?.created_at
    ? new Date(issues[0].created_at).toLocaleDateString("ko-KR")
    : "—";

  return (
    <>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="수집된 이슈" value={String(total)} hint="issues 테이블 전체" icon={Database} tone="mint" />
        <StatCard label="고위험 신호" value={String(highRisk)} hint="score ≥ 80" icon={ShieldAlert} tone="danger" />
        <StatCard label="카테고리" value={String(categories)} hint="distinct categories" icon={Sparkles} tone="purple" />
        <StatCard label="최신 수집" value={latest} hint="most recent created_at" icon={Activity} tone="mint" />
      </section>

      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-xl font-display font-semibold">신규 이슈 (Latest Issues)</h2>
            <p className="text-xs text-muted-foreground mt-0.5">최신순 · Supabase live</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-mint hover:text-mint">
            <Link to="/risks">
              모두 보기 <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        {issues.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {issues.slice(0, 4).map((i: Issue) => (
              <IssueCard key={i.id} issue={i} />
            ))}
          </div>
        )}
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h2 className="text-lg font-display font-semibold mb-3">모니터링 피드</h2>
          <MonitoringFeed />
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="text-lg font-display font-semibold mb-3">데이터 소스</h2>
          <p className="text-xs text-muted-foreground">
            Lovable Cloud (Supabase) 의 <code className="terminal text-mint">issues</code> 테이블에서 실시간으로 가져옵니다.
            새로운 모니터링 사이클이 행을 추가하면 자동으로 반영됩니다.
          </p>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <p className="text-sm text-muted-foreground">
        아직 수집된 이슈가 없어요. 모니터링 잡이 <code className="terminal text-mint">issues</code> 테이블에 행을 추가하면 여기에 표시됩니다.
      </p>
    </div>
  );
}
