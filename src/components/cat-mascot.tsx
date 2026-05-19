type Props = { state?: "idle" | "alert" | "typing" | "coffee"; size?: number };

/** Cute inline SVG cat — no external assets */
export function CatMascot({ state = "idle", size = 96 }: Props) {
  const eyeClosed = state === "idle";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className="drop-shadow-[0_8px_24px_oklch(0.82_0.16_165/0.35)]"
    >
      {/* body */}
      <ellipse cx="60" cy="92" rx="34" ry="14" fill="oklch(0.28 0.06 270)" opacity="0.6" />
      {/* head */}
      <g className="animate-float" style={{ transformOrigin: "60px 60px" }}>
        <path
          d="M28 56 L36 30 L52 48 Q60 44 68 48 L84 30 L92 56 Q92 86 60 88 Q28 86 28 56 Z"
          fill="oklch(0.96 0.01 240)"
          stroke="oklch(0.82 0.16 165)"
          strokeWidth="1.5"
        />
        {/* inner ears */}
        <path d="M40 38 L46 46 L42 48 Z" fill="oklch(0.7 0.18 295)" />
        <path d="M80 38 L74 46 L78 48 Z" fill="oklch(0.7 0.18 295)" />
        {/* eyes */}
        {eyeClosed ? (
          <>
            <path d="M48 62 q4 -4 8 0" stroke="oklch(0.17 0.04 260)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M64 62 q4 -4 8 0" stroke="oklch(0.17 0.04 260)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : state === "alert" ? (
          <>
            <circle cx="52" cy="62" r="4.5" fill="oklch(0.7 0.21 25)" />
            <circle cx="68" cy="62" r="4.5" fill="oklch(0.7 0.21 25)" />
            <circle cx="53" cy="61" r="1.2" fill="white" />
            <circle cx="69" cy="61" r="1.2" fill="white" />
          </>
        ) : (
          <>
            <ellipse cx="52" cy="62" rx="3" ry="4" fill="oklch(0.17 0.04 260)" />
            <ellipse cx="68" cy="62" rx="3" ry="4" fill="oklch(0.17 0.04 260)" />
            <circle cx="53" cy="60.5" r="1" fill="white" />
            <circle cx="69" cy="60.5" r="1" fill="white" />
          </>
        )}
        {/* nose + mouth */}
        <path d="M58 70 L62 70 L60 73 Z" fill="oklch(0.7 0.18 295)" />
        <path d="M60 73 q-3 3 -6 1 M60 73 q3 3 6 1" stroke="oklch(0.17 0.04 260)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* whiskers */}
        <path d="M30 68 L46 70 M30 72 L46 73 M90 68 L74 70 M90 72 L74 73" stroke="oklch(0.72 0.03 250)" strokeWidth="1" />
        {/* blush */}
        <circle cx="44" cy="72" r="3" fill="oklch(0.7 0.18 295)" opacity="0.4" />
        <circle cx="76" cy="72" r="3" fill="oklch(0.7 0.18 295)" opacity="0.4" />
      </g>
      {/* coffee cup */}
      {state === "coffee" && (
        <g>
          <rect x="78" y="76" width="14" height="12" rx="2" fill="oklch(0.96 0.01 240)" stroke="oklch(0.82 0.16 165)" />
          <path d="M82 72 q2 -4 0 -8 M86 72 q2 -4 0 -8" stroke="oklch(0.82 0.16 165)" strokeWidth="1" fill="none" />
        </g>
      )}
      {/* alert badge */}
      {state === "alert" && (
        <g>
          <circle cx="92" cy="34" r="8" fill="oklch(0.7 0.21 25)" className="animate-pulse-glow" />
          <text x="92" y="38" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">!</text>
        </g>
      )}
      {/* typing dots */}
      {state === "typing" && (
        <g fill="oklch(0.82 0.16 165)">
          <circle cx="48" cy="100" r="2"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" /></circle>
          <circle cx="58" cy="100" r="2"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.2s" repeatCount="indefinite" /></circle>
          <circle cx="68" cy="100" r="2"><animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin="0.4s" repeatCount="indefinite" /></circle>
        </g>
      )}
    </svg>
  );
}
