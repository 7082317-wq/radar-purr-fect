import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_shell/cases")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">판례 · 결정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI · 프라이버시 관련 국내외 주요 판결 및 행정 결정.
        </p>
      </header>
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
        이 섹션은 아직 데이터 소스에 연결되지 않았어요.
      </div>
    </div>
  ),
});
