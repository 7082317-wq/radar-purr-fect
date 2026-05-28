import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { issueQueryOptions, type Issue } from "@/lib/issues";
import { generateReport } from "@/lib/report.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Check, Copy, Download, ExternalLink, FileText, Loader2, Printer, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_shell/drafts/$id")({
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(issueQueryOptions(params.id));
  },
  component: DraftReport,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="glass rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-danger">{error.message}</p>
        <Button size="sm" onClick={() => router.invalidate()}>다시 시도</Button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="glass rounded-2xl p-8 text-center">
      <p>초안을 찾을 수 없어요.</p>
      <Link to="/drafts" className="text-mint underline">목록으로</Link>
    </div>
  ),
});

function downloadDocx(title: string, sections: { h: string; body: string }[]) {
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

function formatIssueText(value: string | string[] | null | undefined, fallback = "") {
  if (Array.isArray(value)) return value.join("\n");
  return value ?? fallback;
}

function DraftReport() {
  return (
    <Suspense fallback={<div className="glass rounded-2xl p-6 text-sm text-muted-foreground">불러오는 중…</div>}>
      <DraftContent />
    </Suspense>
  );
}

function DraftContent() {
  const { id } = Route.useParams();
  const { data: issue } = useSuspenseQuery(issueQueryOptions(id));

  if (!issue) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p>해당 이슈를 찾을 수 없어요.</p>
        <Link to="/drafts" className="text-mint underline">목록으로</Link>
      </div>
    );
  }

  return <DraftBody issue={issue} />;
}

function DraftBody({ issue }: { issue: Issue }) {
  const collectedAt = new Date(issue.created_at).toLocaleDateString("ko-KR");
  const sections = [
    {
      h: "1. 개요 (Overview)",
      body: `최근 ${issue.source ?? "외부 소스"}를 통해 보고된 사안에 대한 내부 검토용 초안. 신규성 ${issue.novelty_score ?? "—"}/100 · 관련성 ${issue.relevance_score ?? "—"}/100.`,
    },
    { h: "2. 핵심 이슈 (Key Issue)", body: formatIssueText(issue.summary, "요약 정보가 제공되지 않았습니다.") },
    {
      h: "3. 프라이버시 리스크 분석",
      body:
        formatIssueText(
          issue.privacy_implications,
          "• 수집 단계: 동의 메커니즘의 명확성 부족 가능성.\n• 처리 단계: 목적 외 이용 및 추론 위험.\n• 제공 단계: 제3자 공유 및 국외 이전 시 적정성 확보 필요.\n• 보존·파기: 학습 데이터의 삭제권 행사 가능성 검토 필요.",
        ),
    },
    {
      h: "4. 국내 규제 시사점",
      body:
        "개인정보보호법 제15·17·22조의2 적용 가능성 검토. AI 기본법(가칭)의 고위험 영역 분류 및 영향평가 의무와의 정합성 확인 필요. 자동화 결정 거부권의 실효적 보장 방안 모색.",
    },
    {
      h: "5. 검토 포인트 (Suggested Review Points)",
      body:
        "1) 국내 사업자 적용 범위 확정\n2) 기존 가이드라인 개정 필요 여부\n3) 산업계 영향 및 대외 커뮤니케이션 전략\n4) 후속 모니터링 항목 등록",
    },
    {
      h: "6. 출처 (Sources)",
      body: `${issue.source ?? "—"}${issue.source_url ? `\n${issue.source_url}` : ""}\n수집일: ${collectedAt}`,
    },
  ];

  return (
    <article className="space-y-6 max-w-4xl mx-auto print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link to="/drafts"><ArrowLeft className="h-4 w-4 mr-1.5" /> 초안 목록</Link>
        </Button>
        <div className="flex gap-2">
          {issue.source_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(issue.source_url!, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" /> Open Source
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1.5" /> 인쇄
          </Button>
          <Button
            size="sm"
            onClick={() => downloadDocx(issue.title, sections)}
            className="bg-mint text-mint-foreground hover:bg-mint/90"
          >
            <Download className="h-4 w-4 mr-1.5" /> DOCX 다운로드
          </Button>
        </div>
      </div>

      <header className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-2 terminal text-xs text-mint">
          <FileText className="h-3.5 w-3.5" /> INTERNAL DRAFT · CONFIDENTIAL
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold tracking-tight">
          {issue.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
          {issue.category && (
            <Badge variant="outline" className="border-purple/40 text-purple bg-purple/10">
              {issue.category}
            </Badge>
          )}
          <Badge variant="outline" className="border-danger/40 text-danger bg-danger/10">
            신규성 {issue.novelty_score ?? "—"}
          </Badge>
          <Badge variant="outline" className="border-mint/40 text-mint bg-mint/10">
            관련성 {issue.relevance_score ?? "—"}
          </Badge>
          <span>·</span>
          {issue.source_url ? (
            <a
              href={issue.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mint underline-offset-2 hover:underline"
            >
              {issue.source ?? issue.source_url}
            </a>
          ) : (
            <span>{issue.source ?? "—"}</span>
          )}
          <span>·</span>
          <span>{collectedAt}</span>
        </div>
        {issue.capability_tags && issue.capability_tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {issue.capability_tags.map((t) => (
              <Badge key={t} variant="outline" className="border-mint/30 text-mint/90 bg-mint/5">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <AiReportPanel issue={issue} />

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

function AiReportPanel({ issueId }: { issueId: string }) {
  const generate = useServerFn(generateReport);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    setReport(null);
    try {
      const res = await generate({ data: { issueId } });
      setReport(res.report);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "보고서 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      toast.success("보고서를 복사했습니다.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-6 print:hidden">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="terminal text-xs text-mint flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> AI 보고서 초안 생성
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Gemini 기반으로 중앙행정기관 정책보고서 양식의 초안을 생성합니다.
          </p>
        </div>
        <div className="flex gap-2">
          {report && (
            <Button size="sm" variant="outline" onClick={onCopy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "복사됨" : "복사"}
            </Button>
          )}
          <Button
            size="sm"
            onClick={onGenerate}
            disabled={loading}
            className="bg-mint text-mint-foreground hover:bg-mint/90 gap-1.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "생성 중..." : report ? "다시 생성" : "보고서 초안 생성"}
          </Button>
        </div>
      </div>

      {report && (
        <pre className="mt-5 rounded-2xl bg-background/40 border border-glass-border p-5 text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90 max-h-[600px] overflow-auto">
          {report}
        </pre>
      )}
    </div>
  );
}
