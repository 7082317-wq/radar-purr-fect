import { useQuery } from "@tanstack/react-query";
import { issuesQueryOptions } from "@/lib/issues";

function levelFor(score: number): keyof typeof dot {
  if (score >= 80) return "alert";
  if (score >= 60) return "warn";
  if (score > 0) return "info";
  return "ok";
}

const dot = {
  info: "bg-mint/60",
  warn: "bg-purple",
  alert: "bg-danger",
  ok: "bg-mint",
} as const;

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("ko-KR", { hour12: false });
  } catch {
    return "--:--:--";
  }
}

export function MonitoringFeed() {
  const { data: issues = [] } = useQuery(issuesQueryOptions());
  const items = issues.slice(0, 12).map((i) => ({
    id: i.id,
    time: fmtTime(i.created_at),
    level: levelFor(Math.max(i.novelty_score ?? 0, i.relevance_score ?? 0)),
    message: i.title,
  }));
  const loop = items.length > 0 ? [...items, ...items] : [];

  return (
    <div className="h-[420px] overflow-hidden relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold">실시간 모니터링 피드</h3>
          <p className="terminal text-mint/70">stream · live</p>
        </div>
        <span className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-mint animate-pulse-glow" />
          연결됨
        </span>
      </div>
      <div className="scroll-mask h-[330px] overflow-hidden">
        {loop.length === 0 ? (
          <p className="text-xs text-muted-foreground">수신된 이벤트가 없어요.</p>
        ) : (
          <ul className="animate-marquee-up space-y-2.5">
            {loop.map((f, i) => (
              <li key={`${f.id}-${i}`} className="flex items-start gap-3 terminal text-xs">
                <span className={`mt-1 h-2 w-2 rounded-full ${dot[f.level]} shrink-0`} />
                <span className="text-muted-foreground w-[68px] shrink-0">{f.time}</span>
                <span className="text-foreground/90 truncate">{f.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
