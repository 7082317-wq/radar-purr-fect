import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Issue } from "@/lib/issues";
import { FileText, ExternalLink, ShieldAlert } from "lucide-react";
import { BriefingDialog } from "@/components/briefing-dialog";

function scoreColor(s: number | null | undefined) {
  const v = s ?? 0;
  if (v >= 80) return "text-danger border-danger/40 bg-danger/10";
  if (v >= 60) return "text-purple border-purple/40 bg-purple/10";
  return "text-mint border-mint/40 bg-mint/10";
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatText(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) return value.join("\n");
  return value ?? "";
}

export function IssueCard({ issue, isNew = false }: { issue: Issue; isNew?: boolean }) {
  const [open, setOpen] = useState(false);

  const openSource = () => {
    if (issue.source_url) window.open(issue.source_url, "_blank", "noopener,noreferrer");
  };

  const isHighNovelty = (issue.novelty_score ?? 0) >= 80;

  return (
    <div
      className={`glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 flex flex-col gap-3 relative ${
        isHighNovelty ? "border-danger/50 animate-high-glow" : "hover:border-mint/40"
      } ${isNew ? "animate-new-issue ring-1 ring-mint/50" : ""}`}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 terminal text-[10px] uppercase bg-mint text-mint-foreground px-2 py-0.5 rounded-full shadow-elegant animate-bounce-in">
          NEW
        </span>
      )}
      {isHighNovelty && (
        <span className="absolute -top-2 left-4 terminal text-[10px] uppercase bg-danger text-white px-2 py-0.5 rounded-full">
          HIGH NOVELTY
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {issue.category && (
            <span className="terminal text-[10px] uppercase text-mint">
              {issue.category}
            </span>
          )}
          <h3 className="mt-1 font-semibold text-base leading-snug">{issue.title}</h3>
        </div>
        <div className="shrink-0 flex gap-1.5">
          <div className={`rounded-xl border px-2.5 py-1.5 text-center ${scoreColor(issue.novelty_score)}`}>
            <div className="terminal text-[9px] opacity-70">NOV</div>
            <div className="text-base font-bold leading-none">{issue.novelty_score ?? "—"}</div>
          </div>
          <div className={`rounded-xl border px-2.5 py-1.5 text-center ${scoreColor(issue.relevance_score)}`}>
            <div className="terminal text-[9px] opacity-70">REL</div>
            <div className="text-base font-bold leading-none">{issue.relevance_score ?? "—"}</div>
          </div>
        </div>
      </div>

      {issue.summary && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {issue.summary}
        </p>
      )}

      {issue.privacy_implications && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-3">
          <div className="flex items-center gap-1.5 terminal text-[10px] uppercase text-danger">
            <ShieldAlert className="h-3 w-3" /> Privacy Implications
          </div>
          <p className="mt-1 text-xs text-foreground/85 leading-relaxed line-clamp-3">
            {formatText(issue.privacy_implications)}
          </p>
        </div>
      )}

      {issue.capability_tags && issue.capability_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {issue.capability_tags.map((t) => (
            <Badge key={t} variant="outline" className="border-mint/30 text-mint/90 bg-mint/5">
              #{t}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="terminal truncate">
          {issue.source_url ? (
            <a
              href={issue.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mint underline-offset-2 hover:underline truncate"
            >
              {issue.source ?? issue.source_url}
            </a>
          ) : (
            <span>{issue.source ?? "—"}</span>
          )}
        </div>
        <span className="shrink-0">{formatDate(issue.created_at)}</span>
      </div>

      <div className="flex gap-2 pt-1">
        <Button asChild size="sm" variant="secondary" className="flex-1 gap-1.5">
          <Link to="/drafts/$id" params={{ id: issue.id }}>
            <FileText className="h-3.5 w-3.5" /> Generate Briefing
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={!issue.source_url}
          onClick={openSource}
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open Source
        </Button>
      </div>
    </div>
  );
}
