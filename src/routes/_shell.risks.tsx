import { createFileRoute } from "@tanstack/react-router";
import { RiskCard } from "@/components/risk-card";
import { risks } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/risks")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">신규 위험</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI가 자동 분석한 프라이버시 리스크 목록. 점수가 높을수록 우선 검토 권장.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {risks.map((r) => <RiskCard key={r.id} risk={r} />)}
      </div>
    </div>
  ),
});
