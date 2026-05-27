import mascotImg from "@/assets/mascot.png";

type Props = { state?: "idle" | "alert" | "typing" | "coffee"; size?: number };

/** Mascot character — uses the rocker key-cat image with state overlays */
export function CatMascot({ state = "idle", size = 96 }: Props) {
  return (
    <div
      className="relative inline-block drop-shadow-[0_8px_24px_oklch(0.82_0.16_165/0.35)]"
      style={{ width: size, height: size }}
    >
      <img
        src={mascotImg}
        alt="mascot"
        width={size}
        height={size}
        className={`h-full w-full object-contain animate-float ${
          state === "idle" ? "opacity-90" : ""
        }`}
        style={state === "idle" ? { filter: "saturate(0.9)" } : undefined}
      />

      {/* Eye glow for alert — two red dots positioned over the eyes */}
      {state === "alert" && (
        <>
          <span
            className="absolute rounded-full bg-[oklch(0.7_0.21_25)] animate-pulse-glow"
            style={{
              width: size * 0.07,
              height: size * 0.07,
              left: size * 0.36,
              top: size * 0.38,
              boxShadow: `0 0 ${size * 0.08}px oklch(0.7 0.21 25)`,
            }}
          />
          <span
            className="absolute rounded-full bg-[oklch(0.7_0.21_25)] animate-pulse-glow"
            style={{
              width: size * 0.07,
              height: size * 0.07,
              left: size * 0.55,
              top: size * 0.38,
              boxShadow: `0 0 ${size * 0.08}px oklch(0.7 0.21 25)`,
            }}
          />
          {/* alert badge */}
          <span
            className="absolute grid place-items-center rounded-full bg-[oklch(0.7_0.21_25)] text-white font-bold animate-pulse-glow"
            style={{
              width: size * 0.22,
              height: size * 0.22,
              right: 0,
              top: 0,
              fontSize: size * 0.14,
            }}
          >
            !
          </span>
        </>
      )}

      {/* Coffee cup for briefing */}
      {state === "coffee" && (
        <span
          className="absolute grid place-items-center rounded-md bg-card border border-mint/60"
          style={{
            width: size * 0.22,
            height: size * 0.2,
            right: size * 0.02,
            bottom: size * 0.08,
            fontSize: size * 0.14,
          }}
          aria-hidden
        >
          ☕
        </span>
      )}

      {/* Typing dots */}
      {state === "typing" && (
        <div
          className="absolute flex gap-1"
          style={{ left: "50%", bottom: -size * 0.05, transform: "translateX(-50%)" }}
        >
          {[0, 0.2, 0.4].map((d, i) => (
            <span
              key={i}
              className="rounded-full bg-mint"
              style={{
                width: size * 0.05,
                height: size * 0.05,
                animation: `pulse 1.2s ${d}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Smile / idle: small sparkle to indicate "smiling/happy" */}
      {state === "idle" && (
        <span
          className="absolute text-mint"
          style={{
            right: size * 0.05,
            top: size * 0.05,
            fontSize: size * 0.16,
          }}
          aria-hidden
        >
          ✨
        </span>
      )}
    </div>
  );
}
