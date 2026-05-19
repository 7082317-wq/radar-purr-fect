import { useEffect, useState } from "react";
import { CatMascot } from "./cat-mascot";

const bubbles = [
  { state: "alert" as const, text: "새로운 프라이버시 신호가 감지되었어요." },
  { state: "typing" as const, text: "초안 리포트를 작성하고 있어요…" },
  { state: "coffee" as const, text: "오전 브리핑 준비 중이에요 ☕" },
  { state: "idle" as const, text: "현재 큰 위험은 감지되지 않았어요. 😴" },
  { state: "alert" as const, text: "2건의 해외 DPA 업데이트가 도착했어요." },
];

export function CatAgent() {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % bubbles.length), 5200);
    return () => clearInterval(t);
  }, []);

  const b = bubbles[idx];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 animate-fade-in">
      {open && (
        <div className="glass-strong max-w-[260px] rounded-2xl px-4 py-3 text-sm shadow-elegant relative">
          <div className="font-medium text-foreground">{b.text}</div>
          <div className="mt-1 terminal text-mint/80">cat-agent · v0.4.2</div>
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
        className="relative glass-strong rounded-full p-2 hover:scale-105 transition-transform"
        aria-label="고양이 에이전트"
      >
        <CatMascot state={b.state} size={96} />
        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-mint animate-pulse-glow" />
      </button>
    </div>
  );
}
