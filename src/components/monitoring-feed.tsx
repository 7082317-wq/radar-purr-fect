import { feedItems } from "@/lib/mock-data";

const dot = {
  info: "bg-mint/60",
  warn: "bg-purple",
  alert: "bg-danger",
  ok: "bg-mint",
} as const;

export function MonitoringFeed() {
  const loop = [...feedItems, ...feedItems];
  return (
    <div className="glass rounded-2xl p-5 h-[420px] overflow-hidden relative">
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
        <ul className="animate-marquee-up space-y-2.5">
          {loop.map((f, i) => (
            <li key={i} className="flex items-start gap-3 terminal">
              <span className={`mt-1 h-2 w-2 rounded-full ${dot[f.level]} shrink-0`} />
              <span className="text-muted-foreground w-[68px] shrink-0">{f.time}</span>
              <span className="text-foreground/90">{f.message}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
