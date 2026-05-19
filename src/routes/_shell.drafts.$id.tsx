import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { risks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";

export const Route = createFileRoute("/_shell/drafts/$id")({
  loader: ({ params }) => {
    const risk = risks.find((r) => r.id === params.id);
    if (!risk) throw notFound();
    return { risk };
  },
  component: DraftReport,
  notFoundComponent: () => (
    <div className="glass rounded-2xl p-8 text-center">
      <p>초안을 찾을 수 없어요.</p>
      <Link to="/drafts" className="text-mint underline">목록으로</Link>
    </div>
  ),
});

function downloadDocx(title: string, sections: { h: string; body: string }[]) {
  // Minimal HTML-as-.doc — opens in MS Word & Google Docs
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body{font-family:'Malgun Gothic','Pretendard',sans-serif;color:#111;max-width:780px;margin:40px auto;line-height:1.7;}
    h1{font-size:22pt;border-bottom:2px solid #0a4;padding-bottom:8px;}
    h2{font-size:14pt;margin-top:28px;color:#0a4;}
    .meta{color:#555;font-size:10pt;margin-bottom:24px;}
    p{font-size:11pt;}
    .footer{margin-top:40px;border-top:1px solid #ccc;padding-top:8px;font-size:9pt;color:#666;}
  </style></head><body>
  <h1>${title}</h1>
  <div class="meta">Privacy Radar · 내부 검토용 초안 · ${new Date().toLocaleDateString("ko-KR")}</div>
  ${sections.map((s) => `<h2>${s.h}</h2><p>${s.body.replace(/\n/g, "<br/>")}</p>`).join("")}
  <div class="footer">본 문서는 AI가 자동 생성한 초안이며, 정식 검토 전 외부 공유를 금합니다.</div>
  </body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^가-힣A-Za-z0-9]+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function DraftReport() {
  const { risk } = Route.useLoaderData();

  const sections = [
    { h: "1. 개요 (Overview)", body: `최근 ${risk.source}를 통해 보고된 사안에 대한 내부 검토용 초안. 위험 점수 ${risk.score}/100.` },
    { h: "2. 핵심 이슈 (Key Issue)", body: risk.summary },
    {
      h: "3. 프라이버시 리스크 분석",
      body: "• 수집 단계: 동의 메커니즘의 명확성 부족 가능성.\n• 처리 단계: 목적 외 이용 및 추론 위험.\n• 제공 단계: 제3자 공유 및 국외 이전 시 적정성 확보 필요.\n• 보존·파기: 학습 데이터의 삭제권 행사 가능성 검토 필요.",
    },
    {
      h: "4. 관련 해외 가이던스",
      body: "• ICO (영국): 생성형 AI 학습 데이터의 합법처리근거 가이던스\n• EDPB: 의견서 2/2026 — 모델 익명성 평가\n• CNIL: 공공부문 얼굴인식 비례성 판단",
    },
    {
      h: "5. 국내 규제 시사점",
      body: "개인정보보호법 제15·17·22조의2 적용 가능성 검토. AI 기본법(가칭)의 고위험 영역 분류 및 영향평가 의무와의 정합성 확인 필요. 자동화 결정 거부권의 실효적 보장 방안 모색.",
    },
    {
      h: "6. 검토 포인트 (Suggested Review Points)",
      body: "1) 국내 사업자 적용 범위 확정\n2) 기존 가이드라인 개정 필요 여부\n3) 산업계 영향 및 대외 커뮤니케이션 전략\n4) 후속 모니터링 항목 등록",
    },
    {
      h: "7. 출처 (Sources)",
      body: `${risk.source}\n수집일: ${risk.date}`,
    },
  ];

  return (
    <article className="space-y-6 max-w-4xl mx-auto print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link to="/drafts"><ArrowLeft className="h-4 w-4 mr-1.5" /> 초안 목록</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1.5" /> 인쇄
          </Button>
          <Button size="sm" onClick={() => downloadDocx(risk.title, sections)} className="bg-mint text-mint-foreground hover:bg-mint/90">
            <Download className="h-4 w-4 mr-1.5" /> DOCX 다운로드
          </Button>
        </div>
      </div>

      <header className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-2 terminal text-xs text-mint">
          <FileText className="h-3.5 w-3.5" /> INTERNAL DRAFT · CONFIDENTIAL
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold tracking-tight">
          {risk.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          <Badge variant="outline" className="border-danger/40 text-danger bg-danger/10">위험 {risk.score}</Badge>
          <span>·</span>
          <span>{risk.source}</span>
          <span>·</span>
          <span>{risk.date}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {risk.tags.map((t: string) => (
            <Badge key={t} variant="outline" className="border-mint/30 text-mint/90 bg-mint/5">#{t}</Badge>
          ))}
        </div>
      </header>

      <div className="glass rounded-3xl p-8 space-y-7 leading-relaxed">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-display font-semibold text-mint">{s.h}</h2>
            <p className="mt-2 text-sm text-foreground/90 whitespace-pre-line">{s.body}</p>
          </section>
        ))}
        <footer className="border-t border-glass-border pt-4 terminal text-[11px] text-muted-foreground">
          본 문서는 AI가 자동 생성한 초안이며, 정식 검토 전 외부 공유를 금합니다. · Privacy Radar v0.4.2
        </footer>
      </div>
    </article>
  );
}
