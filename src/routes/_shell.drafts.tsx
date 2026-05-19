import { createFileRoute, Link } from "@tanstack/react-router";
import { risks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_shell/drafts")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">생성된 초안</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI가 자동 생성한 정부 보고서 형식의 초안 목록.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {risks.map((r, i) => (
          <div key={r.id} className="glass rounded-2xl p-5 flex flex-col">
            <div className="flex items-center gap-2 terminal text-xs text-mint">
              <FileText className="h-3.5 w-3.5" /> Draft #{120 + i} · {r.date}
            </div>
            <h3 className="mt-2 font-semibold leading-snug">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.summary}</p>
            <div className="mt-auto pt-4">
              <Button asChild size="sm" variant="secondary">
                <Link to="/drafts/$id" params={{ id: r.id }}>리포트 열기</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});
