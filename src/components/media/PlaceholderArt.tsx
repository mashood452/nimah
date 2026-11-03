/**
 * Quiet artwork that stands in for a photo until the real one is added. It is drawn so that the before and after
 * slider already shows its blur effect: the "chart" art is an eye chart, so it reads as sharp or blurred.
 */
export type ArtKind = "chart" | "iris" | "scene";

const ink = "#3c252a";
const champagne = "#e3c4a4";

export function PlaceholderArt({ kind = "scene" }: { kind?: ArtKind }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true" focusable="false" style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width="400" height="300" fill="#f6eeea" />

      {kind === "chart" && (
        <g fill={ink} fontFamily="var(--font-sans), system-ui, sans-serif" fontWeight="700" textAnchor="middle">
          <text x="200" y="88" fontSize="78">E</text>
          <text x="200" y="136" fontSize="46" letterSpacing="14">F P</text>
          <text x="200" y="172" fontSize="30" letterSpacing="12">T O Z</text>
          <text x="200" y="202" fontSize="21" letterSpacing="10">L P E D</text>
          <text x="200" y="226" fontSize="15" letterSpacing="9">P E C F D</text>
          <text x="200" y="246" fontSize="11" letterSpacing="7">E D F C Z P</text>
        </g>
      )}

      {kind === "iris" && (
        <g>
          <ellipse cx="200" cy="150" rx="168" ry="86" fill="#fff" stroke={ink} strokeOpacity="0.25" />
          <circle cx="200" cy="150" r="78" fill="#9a6b43" stroke={ink} strokeOpacity="0.5" strokeWidth="2" />
          <circle cx="200" cy="150" r="60" fill="#c9996a" />
          <circle cx="200" cy="150" r="44" fill={champagne} />
          <g stroke={ink} strokeOpacity="0.22" strokeWidth="1.5">
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return <line key={i} x1={200 + Math.cos(a) * 30} y1={150 + Math.sin(a) * 30} x2={200 + Math.cos(a) * 76} y2={150 + Math.sin(a) * 76} />;
            })}
          </g>
          <circle cx="200" cy="150" r="30" fill={ink} />
          <circle cx="182" cy="132" r="9" fill="#fff" fillOpacity="0.85" />
        </g>
      )}

      {kind === "scene" && (
        <g fill="none" stroke={ink} strokeOpacity="0.28" strokeWidth="2">
          <circle cx="200" cy="150" r="74" />
          <circle cx="200" cy="150" r="48" />
          <circle cx="200" cy="150" r="22" fill={champagne} fillOpacity="0.55" />
          <path d="M40 232 Q200 200 360 232" />
        </g>
      )}
    </svg>
  );
}
