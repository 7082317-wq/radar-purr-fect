import { createFileRoute, Link } from "@tanstack/react-router";
import { RadarAnimation } from "@/components/radar-animation";
import { RiskCard } from "@/components/risk-card";
import { MonitoringFeed } from "@/components/monitoring-feed";
import { dpaUpdates, risks, signals } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Sparkles, Globe2, Cpu } from "lucide-react";

export const Route = createFileRoute("/_shell/")({
  component: Dashboard,
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
      {/* Header */}
      <header className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div
          className="absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-30"
          style={{ background: "var(--gradient-radar)" }}
        />
        <div className="flex flex-col md:flex-row md:items-center gap-6 relative">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 terminal text-xs text-mint">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse-glow" />
              SYSTEM ONLINE · 2026-05-19 09:42 KST
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-bold tracking-tight">
              <span className="text-gradient">Privacy Radar</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              떠오르는 AI 프라이버시 리스크를 실시간으로 모니터링합니다.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-mint/40 text-mint bg-mint/5">
                <Activity className="h-3 w-3 mr-1" /> Monitoring 42 sources
              </Badge>
              <Badge variant="outline" className="border-purple/40 text-purple bg-purple/5">
                <Sparkles className="h-3 w-3 mr-1" /> AI agent · active
              </Badge>
              <Badge variant="outline" className="border-glass-border">
                다음 스캔까지 03:14
              </Badge>
            </div>
          </div>
          <RadarAnimation />
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="신규 위험" value="12" hint="+3 since last cycle" icon={Activity} tone="danger" />
        <StatCard label="해외 DPA 업데이트" value="6" hint="ICO · EDPB · CNIL …" icon={Globe2} tone="mint" />
        <StatCard label="AI 제품·정책 신호" value="18" hint="Meta · OpenAI · WH" icon={Cpu} tone="purple" />
        <StatCard label="생성된 초안" value="128" hint="누적 · 이번 주 +14" icon={Sparkles} tone="mint" />
      </section>

      {/* Risks */}
      <section>
        <SectionHeader title="신규 위험 (Emerging Risks)" subtitle="AI 자동 분석 · 위험 점수순" to="/risks" />
        <div className="grid md:grid-cols-2 gap-4">
          {risks.map((r) => (
            <RiskCard key={r.id} risk={r} />
          ))}
        </div>
      </section>

      {/* DPA + feed */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionHeader title="해외 DPA 업데이트" subtitle="6개 기관 · 최근 7일" to="/foreign-dpa" />
          <div className="grid sm:grid-cols-2 gap-3">
            {dpaUpdates.slice(0, 4).map((d) => (
              <div key={d.id} className="glass rounded-2xl p-4 hover:border-purple/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="terminal text-xs px-2 py-0.5 rounded-md bg-purple/15 text-purple border border-purple/30">
                    {d.agency}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.country}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold leading-snug">{d.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{d.excerpt}</p>
                <div className="terminal text-[10px] text-muted-foreground mt-2">{d.date}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="모니터링 피드" subtitle="" />
          <MonitoringFeed />
        </div>
      </section>

      {/* Signals */}
      <section>
        <SectionHeader title="AI 제품·정책 신호" subtitle="제품 출시 · 정책 발표 · 연구" to="/ai-products" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {signals.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-4 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between">
                <span className="terminal text-[10px] uppercase text-mint">{s.type}</span>
                <span className="text-xs text-muted-foreground">{s.date}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold leading-snug">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
              <div className="mt-3 text-xs">
                <span className="text-purple">{s.org}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  to,
}: {
  title: string;
  subtitle: string;
  to?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h2 className="text-xl font-display font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {to && (
        <Button asChild variant="ghost" size="sm" className="text-mint hover:text-mint">
          <Link to={to as "/risks"}>
            모두 보기 <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
}
