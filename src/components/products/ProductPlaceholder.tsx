import type { FrameShape } from "./products-data";

/* One lens on the left half of a 240x100 canvas. The right lens is its mirror image. */
const lens: Record<FrameShape, string> = {
  aviator: "M34 30 Q68 22 102 30 Q108 60 86 76 Q64 84 46 68 Q30 52 34 30 Z",
  wayfarer: "M30 32 Q66 26 104 32 L102 62 Q100 74 86 74 L48 74 Q34 74 31 60 Z",
  round: "M104 52 A36 36 0 1 1 32 52 A36 36 0 1 1 104 52 Z",
  "cat-eye": "M28 26 Q62 38 104 38 Q106 66 88 75 Q62 82 42 70 Q26 56 28 26 Z",
  square: "M30 30 H102 Q106 30 106 34 V68 Q106 74 100 74 H36 Q30 74 30 68 Z",
  oversized: "M22 22 H106 Q112 22 112 28 V62 Q112 86 78 86 H54 Q22 86 22 58 Z",
  browline: "M30 34 Q66 24 104 34 L100 58 Q96 76 70 76 Q38 76 32 56 Z",
  rectangle: "M28 36 H102 Q106 36 106 40 V62 Q106 66 102 66 H32 Q28 66 28 62 Z",
};

const bridge: Record<FrameShape, string> = {
  aviator: "M104 36 Q120 28 136 36 M106 44 Q120 38 134 44",
  wayfarer: "M104 38 Q120 32 136 38",
  round: "M104 44 Q120 34 136 44",
  "cat-eye": "M104 42 Q120 36 136 42",
  square: "M106 40 Q120 34 134 40",
  oversized: "M112 38 Q120 34 128 38",
  browline: "M104 38 Q120 30 136 38",
  rectangle: "M106 42 Q120 36 134 42",
};

/** Shown until a real photo is set on the product. */
export function ProductPlaceholder({ shape }: { shape: FrameShape }) {
  return (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={lens[shape] ?? lens.square} fill="currentColor" fillOpacity="0.06" />
      <g transform="translate(240 0) scale(-1 1)">
        <path d={lens[shape] ?? lens.square} fill="currentColor" fillOpacity="0.06" />
      </g>
      <path d={bridge[shape] ?? bridge.square} />
      <path d="M26 38 L6 34 M214 38 L234 34" />
    </svg>
  );
}
