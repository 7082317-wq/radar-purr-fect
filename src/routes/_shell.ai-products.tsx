import { createFileRoute } from "@tanstack/react-router";
import { signals } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/ai-products")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">AI 제품 · 정책 신호</h1>
        <p className="text-sm text-muted-foreground mt-1">
          주요 AI 기업의 제품 출시, 정부 정책 발표, 연구 동향을 추적합니다.
        </p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center justify-between">
              <span className="terminal text-[10px] uppercase text-mint">{s.type}</span>
              <span className="text-xs text-muted-foreground">{s.date}</span>
            </div>
            <h3 className="mt-2 font-semibold leading-snug">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
            <div className="mt-3 text-sm text-purple">{s.org}</div>
          </div>
        ))}
      </div>
    </div>
  ),
});
