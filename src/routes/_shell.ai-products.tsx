import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_shell/ai-products")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">AI 제품 · 정책 신호</h1>
        <p className="text-sm text-muted-foreground mt-1">
          주요 AI 기업의 제품 출시, 정부 정책 발표, 연구 동향을 추적합니다.
        </p>
      </header>
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
        이 섹션은 아직 데이터 소스에 연결되지 않았어요.
      </div>
    </div>
  ),
});
