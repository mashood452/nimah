import type { FrameShape } from "@/components/products/products-data";

export type FrameStyle = {
  /** also the URL segment: /sunglasses/<shape> */
  shape: FrameShape;
  label: string;
  note: string;
  best: string;
  /** shown under the page heading */
  intro: string;
  /** shown in the guide at the bottom of the page */
  guide: string;
};

export const frameStyles: FrameStyle[] = [
  {
    shape: "aviator",
    label: "Aviator",
    note: "Classic teardrop",
    best: "Oval and square faces",
    intro:
      "Born in the cockpit and refined for the city, the aviator pairs a teardrop lens with a slim metal frame. Light, balanced and endlessly wearable.",
    guide:
      "Aviators sit well on oval and square faces, where the rounded lens softens strong angles. Look for a double bridge for stability and a tint that suits your day, such as green for natural colour or gradient brown for a softer look.",
  },
  {
    shape: "wayfarer",
    label: "Wayfarer",
    note: "Bold and timeless",
    best: "Oval and round faces",
    intro:
      "A trapezoid shape with a confident brow line. The wayfarer is the everyday icon, bold enough to make a statement and easy enough to wear with anything.",
    guide:
      "Wayfarers flatter oval and round faces by adding structure and definition. Tortoiseshell adds warmth, while black gives a sharp, graphic finish.",
  },
  {
    shape: "round",
    label: "Round",
    note: "Soft and refined",
    best: "Square and angular faces",
    intro:
      "Soft, circular lenses with a quiet, artistic feel. Round frames bring a light, vintage character to a modern wardrobe.",
    guide:
      "Round frames balance square and angular faces by softening the jawline. Thin metal frames feel airy, while acetate rounds feel more substantial.",
  },
  {
    shape: "cat-eye",
    label: "Cat-Eye",
    note: "Upswept, elegant",
    best: "Heart and oval faces",
    intro:
      "An upswept outer edge that lifts the face and adds instant glamour. The cat-eye is graphic, feminine and unmistakably elegant.",
    guide:
      "Cat-eye frames suit heart and oval faces, drawing the eye upward along the cheekbones. A deep colour such as burgundy makes a quiet statement.",
  },
  {
    shape: "square",
    label: "Square",
    note: "Clean and sharp",
    best: "Round and oval faces",
    intro: "Clean lines and a defined shape. Square frames read as modern, confident and sharp.",
    guide:
      "Square frames add structure to round and oval faces. A slightly oversized square gives a fashion-forward look without feeling heavy.",
  },
  {
    shape: "oversized",
    label: "Oversized",
    note: "Full coverage",
    best: "Heart and oval faces",
    intro:
      "Generous lenses with full coverage and plenty of presence. Oversized sunglasses are as practical in strong sun as they are dramatic.",
    guide:
      "Oversized frames suit heart and oval faces and give extra coverage around the eyes. Choose a lighter acetate for comfort over a long day.",
  },
];

export const getFrameStyle = (shape: string) => frameStyles.find((s) => s.shape === shape);
