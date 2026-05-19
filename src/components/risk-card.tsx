import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Risk } from "@/lib/mock-data";
import { FileText, ArrowUpRight } from "lucide-react";

function scoreColor(s: number) {
  if (s >= 80) return "text-danger border-danger/40 bg-danger/10";
  if (s >= 60) return "text-purple border-purple/40 bg-purple/10";
  return "text-mint border-mint/40 bg-mint/10";
}

export function RiskCard({ risk }: { risk: Risk }) {
  return (
    <div className="glass rounded-2xl p-5 hover:border-mint/40 transition-all hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-base leading-snug flex-1">{risk.title}</h3>
        <div className={`shrink-0 rounded-xl border px-2.5 py-1.5 text-center ${scoreColor(risk.score)}`}>
          <div className="terminal text-[10px] opacity-70">RISK</div>
          <div className="text-lg font-bold leading-none">{risk.score}</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{risk.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {risk.tags.map((t) => (
          <Badge key={t} variant="outline" className="border-mint/30 text-mint/90 bg-mint/5">
            #{t}
          </Badge>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="terminal text-xs text-muted-foreground">
          {risk.source} · {risk.date}
        </div>
        <Button asChild size="sm" variant="secondary" className="gap-1.5">
          <Link to="/drafts/$id" params={{ id: risk.id }}>
            <FileText className="h-3.5 w-3.5" /> 초안 생성
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
