export function RadarAnimation({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full border border-mint/30" />
      <div className="absolute inset-[14%] rounded-full border border-mint/20" />
      <div className="absolute inset-[30%] rounded-full border border-mint/15" />
      <div className="absolute inset-[46%] rounded-full border border-mint/10" />
      {/* sweep */}
      <div
        className="absolute inset-0 rounded-full animate-radar"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.16 165 / 0.55) 40deg, transparent 80deg)",
          maskImage: "radial-gradient(circle, black 60%, transparent 100%)",
        }}
      />
      {/* blips */}
      <span className="absolute left-[28%] top-[34%] h-2 w-2 rounded-full bg-mint shadow-[0_0_12px_var(--color-mint)] animate-pulse-glow" />
      <span className="absolute left-[68%] top-[58%] h-2 w-2 rounded-full bg-purple shadow-[0_0_12px_var(--color-purple)] animate-pulse-glow" />
      <span className="absolute left-[54%] top-[24%] h-1.5 w-1.5 rounded-full bg-mint/80" />
      {/* crosshair */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-mint/10" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-mint/10" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-mint shadow-[0_0_18px_var(--color-mint)]" />
    </div>
  );
}
