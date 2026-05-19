import { createFileRoute } from "@tanstack/react-router";

const cases = [
  { id: "c1", court: "CJEU C-203/24", date: "2026-04-12", title: "생성형 AI 학습 데이터의 GDPR 제6조 적용 범위", summary: "정당한 이익 근거의 한계와 데이터 주체 권리의 균형에 관한 판단." },
  { id: "c2", court: "서울행정법원", date: "2026-03-28", title: "AI 채용 알고리즘 공개 청구 사건", summary: "영업비밀과 자동화 결정 설명 요구권의 충돌." },
  { id: "c3", court: "US 9th Circuit", date: "2026-02-15", title: "Clearview AI 집단소송 항소심", summary: "BIPA 위반 손해배상 인정 범위 확대." },
];

export const Route = createFileRoute("/_shell/cases")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">판례 · 결정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI · 프라이버시 관련 국내외 주요 판결 및 행정 결정.
        </p>
      </header>
      <div className="space-y-3">
        {cases.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="terminal text-xs text-mint">{c.court}</span>
              <span className="text-xs text-muted-foreground">{c.date}</span>
            </div>
            <h3 className="mt-2 font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.summary}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
