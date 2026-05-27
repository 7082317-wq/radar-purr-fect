import { useEffect, useRef, useState } from "react";
import { CatMascot } from "./cat-mascot";
import { NEW_ISSUE_EVENT, type Issue } from "@/lib/issues";

type Bubble = { state: "idle" | "alert" | "typing" | "coffee"; text: string };

const idleBubbles: Bubble[] = [
  { state: "alert", text: "새로운 프라이버시 신호가 감지되었어요." },
  { state: "typing", text: "초안 리포트를 작성하고 있어요…" },
  { state: "coffee", text: "오전 브리핑 준비 중이에요 ☕" },
  { state: "idle", text: "현재 큰 위험은 감지되지 않았어요. 😴" },
  { state: "alert", text: "2건의 해외 DPA 업데이트가 도착했어요." },
];

function buildNewIssueBubble(issues: Issue[]): Bubble {
  const n = issues.length;
  const dpa = issues.filter((i) => /dpa|foreign|규제|감독/i.test(i.category ?? "")).length;
  const gov = issues.some((i) => /governance|policy|정책|거버넌스/i.test(i.category ?? ""));
  const cap = issues.some((i) => (i.capability_tags ?? []).length > 0 || /capability|모델|capability/i.test(i.title));

  if (dpa >= 2) return { state: "alert", text: `${dpa} new foreign DPA updates found.` };
  if (gov) return { state: "alert", text: "New AI governance signal detected." };
  if (cap) return { state: "alert", text: "Potential privacy-relevant capability shift identified." };
  return {
    state: "alert",
    text: n === 1 ? "새 이슈 1건이 감지되었어요." : `새 이슈 ${n}건이 감지되었어요.`,
  };
}

export function CatAgent() {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(true);
  const [override, setOverride] = useState<Bubble | null>(null);
  const [pulse, setPulse] = useState(false);
  const overrideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % idleBubbles.length), 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ issues: Issue[] }>).detail;
      if (!detail?.issues?.length) return;
      const bubble = buildNewIssueBubble(detail.issues);
      setOverride(bubble);
      setOpen(true);
      setPulse(true);
      if (overrideTimer.current) clearTimeout(overrideTimer.current);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      overrideTimer.current = setTimeout(() => setOverride(null), 8000);
      pulseTimer.current = setTimeout(() => setPulse(false), 8000);
    }
    window.addEventListener(NEW_ISSUE_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(NEW_ISSUE_EVENT, handler as EventListener);
      if (overrideTimer.current) clearTimeout(overrideTimer.current);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  const b: Bubble = override ?? idleBubbles[idx];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 animate-fade-in">
      {open && (
        <div
          className={`glass-strong max-w-[280px] rounded-2xl px-4 py-3 text-sm shadow-elegant relative ${
            override ? "animate-bounce-in border border-mint/50" : ""
          }`}
        >
          <div className="font-medium text-foreground">{b.text}</div>
          <div className="mt-1 terminal text-mint/80">
            lockstar-agent · {override ? "alert · live" : "v0.4.2"}
          </div>
          <span className="absolute -right-2 bottom-4 h-3 w-3 rotate-45 bg-card/60 border-r border-b border-glass-border backdrop-blur-xl" />
          <button
            onClick={() => setOpen(false)}
            className="absolute top-1 right-2 text-muted-foreground hover:text-foreground text-xs"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative glass-strong rounded-full p-2 hover:scale-105 transition-transform ${
          pulse ? "animate-bounce-in" : ""
        }`}
        aria-label="고양이 에이전트"
      >
        <CatMascot state={b.state} size={96} />
        <span
          className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full animate-pulse-glow ${
            pulse ? "bg-danger" : "bg-mint"
          }`}
        />
      </button>
    </div>
  );
}
