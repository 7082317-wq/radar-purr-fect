import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_shell/foreign-dpa")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">해외 DPA 업데이트</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ICO · EDPB · OPC · PDPC · CNIL · FTC 등 주요 감독기관의 최신 가이던스 및 결정.
        </p>
      </header>
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
        이 섹션은 아직 데이터 소스에 연결되지 않았어요. <br />
        전용 테이블을 추가하면 여기에 실시간으로 표시됩니다.
      </div>
    </div>
  ),
});
