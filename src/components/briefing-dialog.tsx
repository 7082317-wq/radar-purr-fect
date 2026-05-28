import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, Copy, FileText, Loader2, Sparkles, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Issue } from "@/lib/issues";
import { generateReport } from "@/lib/report.functions";
import { draftByIssueQueryOptions } from "@/lib/drafts";

type Props = {
  issue: Issue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BriefingDialog({ issue, open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const generate = useServerFn(generateReport);
  const existing = useQuery({ ...draftByIssueQueryOptions(issue.id), enabled: open });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 다이얼로그 열릴 때 기존 초안이 있으면 자동 표시
  useEffect(() => {
    if (open && existing.data?.content) setReport(existing.data.content);
    if (!open) {
      setReport(null);
      setCopied(false);
    }
  }, [open, existing.data?.content]);

  const onGenerate = async () => {
    setLoading(true);
    setReport(null);
    try {
      const res = await generate({
        data: {
          issue: {
            id: issue.id,
            title: issue.title,
            summary: issue.summary,
            source: issue.source,
            source_url: issue.source_url,
            category: issue.category,
            capability_tags: issue.capability_tags,
            privacy_implications: issue.privacy_implications,
          },
        },
      });
      setReport(res.report);
      qc.invalidateQueries({ queryKey: ["drafts"] });
      qc.invalidateQueries({ queryKey: ["drafts", "issue", issue.id] });
      toast.success("보고서 초안이 저장되었습니다.");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="terminal text-xs text-mint flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> AI BRIEFING DRAFT
          </div>
          <DialogTitle className="leading-snug">{issue.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 items-center">
            {issue.category && (
              <Badge variant="outline" className="border-purple/40 text-purple bg-purple/10">
                {issue.category}
              </Badge>
            )}
            {issue.source && <span className="text-xs">{issue.source}</span>}
            {issue.source_url && (
              <a
                href={issue.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-mint hover:underline inline-flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" /> 원문
              </a>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-[200px]">
          {existing.isLoading && !report ? (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> 초안 확인 중...
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-mint" />
              AI가 보고서 초안을 작성하고 있어요...
            </div>
          ) : report ? (
            <pre className="rounded-2xl bg-background/40 border border-glass-border p-5 text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
              {report}
            </pre>
          ) : (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-mint/60" />
              아직 생성된 초안이 없어요.
              <br />
              아래 버튼을 눌러 정책보고서 초안을 만들어 보세요.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {report && (
            <Button variant="outline" onClick={onCopy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "복사됨" : "복사"}
            </Button>
          )}
          <Button
            onClick={onGenerate}
            disabled={loading}
            className="bg-mint text-mint-foreground hover:bg-mint/90 gap-1.5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "생성 중..." : report ? "다시 생성" : "보고서 초안 생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
