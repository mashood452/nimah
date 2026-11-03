import type { ProductCategory } from "@/components/products/products-data";

export type GroupSlug = "sunglasses" | "blue-light-glasses" | "eyeglasses";

export type Collection = {
  slug: string;
  /** short label used on chips and breadcrumbs */
  label: string;
  /** page heading */
  title: string;
  intro: string;
  /** products with this tag (inside the group's category) belong to the collection */
  tag: string;
  guideTitle: string;
  guide: string[];
  /** shown when the collection has no products yet */
  emptyNote?: string;
  /** an extra helpful link for empty or service-led collections */
  related?: { label: string; href: string };
};

export type Group = {
  slug: GroupSlug;
  label: string;
  title: string;
  category: ProductCategory;
  intro: string;
  metaDescription: string;
  guideTitle: string;
  guide: string[];
  /** chip rows shown on the group page and on each collection page */
  rows: { label: string; slugs: string[] }[];
  collections: Collection[];
};

const sunglasses: Collection[] = [
  {
    slug: "polarized",
    label: "Polarized",
    title: "Polarized Sunglasses",
    intro:
      "Polarized lenses cut the glare that bounces off water, roads and car windscreens, so bright days feel clearer and more comfortable.",
    tag: "polarized",
    guideTitle: "What polarization does",
    guide: [
      "A polarized filter blocks the light that reflects off flat surfaces. The result is less glare, richer contrast and less squinting, which is why polarized lenses are popular for driving, boating and the beach.",
      "They can make some digital screens look dim or patchy, so check your phone or dashboard display when you try a pair.",
    ],
  },
  {
    slug: "uv400",
    label: "UV400",
    title: "UV400 Sunglasses",
    intro:
      "UV400 lenses block light with wavelengths up to 400 nanometres, covering both UVA and UVB rays. It is the standard to look for in any pair of sunglasses.",
    tag: "uv400",
    guideTitle: "Why UV protection matters",
    guide: [
      "Long-term exposure to ultraviolet light is linked to eye conditions including cataracts, and to damage to the eyelids and the skin around the eyes. Sunglasses are one of the simplest ways to reduce that exposure.",
      "Lens darkness is not a guide to protection. A light-tinted lens with UV400 can protect as well as a very dark one, so always check the label rather than the tint.",
    ],
  },
  {
    slug: "mirrored",
    label: "Mirrored",
    title: "Mirrored Sunglasses",
    intro:
      "A reflective coating on the outside of the lens bounces extra light away, adding a bold, modern finish and reducing the brightness that reaches your eyes.",
    tag: "mirrored",
    guideTitle: "Choosing mirrored lenses",
    guide: [
      "Mirror finishes range from subtle silver and gold to rose and blue tones. They look striking and suit very bright conditions such as sand, snow and open water.",
      "Because the coating sits on the front surface, clean it gently with a microfibre cloth and a lens-safe cleaner rather than rubbing it dry.",
    ],
  },
  {
    slug: "gradient",
    label: "Gradient",
    title: "Gradient Sunglasses",
    intro:
      "Gradient lenses are darker at the top and lighter toward the bottom, giving shade from overhead sun while keeping your view clear when you look down at a map, phone or dashboard.",
    tag: "gradient",
    guideTitle: "Who gradient lenses suit",
    guide: [
      "A gentle, flattering choice for city days and driving. Brown and grey gradients are the most versatile, while softer tints add a fashion-led finish.",
      "If you want the most light reduction in very bright conditions, a solid tint or a mirrored lens is usually the stronger choice.",
    ],
  },
  {
    slug: "photochromic",
    label: "Photochromic",
    title: "Photochromic Sunglasses",
    intro:
      "Photochromic lenses adjust their tint to the light around you, clearer indoors and darker in bright sun, so one pair can do more of the work.",
    tag: "photochromic",
    guideTitle: "How photochromic lenses behave",
    guide: [
      "The tint responds to ultraviolet light, so lenses darken outdoors and fade back indoors. Temperature affects how dark and how quickly they change.",
      "Car windscreens block most UV, so photochromic lenses usually stay lighter while you drive. Learn more in our photochromic lens guide.",
    ],
    emptyNote:
      "We are adding photochromic sunglasses to the collection. In the meantime, our team can talk you through photochromic lens options for your favourite frame.",
    related: { label: "Read the photochromic lens guide", href: "/lenses/photochromic" },
  },
  {
    slug: "men",
    label: "Men",
    title: "Men's Sunglasses",
    intro: "Confident shapes and classic materials, chosen for everyday wear from the office to the weekend.",
    tag: "men",
    guideTitle: "Finding the right pair",
    guide: [
      "Start with the shape that suits your face, then choose the lens for how you spend your day. Wayfarer and square frames add structure, while aviators keep things light.",
      "Look for UV400 protection on every pair, and consider polarized lenses if you drive often.",
    ],
  },
  {
    slug: "women",
    label: "Women",
    title: "Women's Sunglasses",
    intro: "From soft round frames to dramatic cat-eyes, sunglasses that finish a look and protect your eyes.",
    tag: "women",
    guideTitle: "Finding the right pair",
    guide: [
      "Round and cat-eye frames add softness and lift, while oversized styles give full coverage and plenty of presence.",
      "Look for UV400 protection on every pair, and choose a gradient or mirrored lens for the finish you prefer.",
    ],
  },
  {
    slug: "unisex",
    label: "Unisex",
    title: "Unisex Sunglasses",
    intro: "Frames that look at home on anyone, built on timeless shapes that never go out of style.",
    tag: "unisex",
    guideTitle: "Finding the right pair",
    guide: [
      "Classic aviator and wayfarer shapes work across faces and wardrobes. Try a few to see which feels most like you.",
      "Look for UV400 protection on every pair.",
    ],
  },
  {
    slug: "kids",
    label: "Kids",
    title: "Kids' Sunglasses",
    intro: "Children spend a lot of time outdoors, so reliable UV protection matters from an early age.",
    tag: "kids",
    guideTitle: "Choosing sunglasses for children",
    guide: [
      "Look for UV400 protection, a comfortable fit that stays put during play, and durable, flexible frames.",
      "If your child already wears glasses, ask our team about prescription sunglasses or clip-ons.",
    ],
    emptyNote:
      "We are building our kids' collection. If you would like a recommendation in the meantime, our team is happy to help.",
    related: { label: "Contact our team", href: "/contact" },
  },
  {
    slug: "prescription",
    label: "Prescription",
    title: "Prescription Sunglasses",
    intro:
      "Sunglasses made with your own prescription, so you get UV protection and clear vision in one pair.",
    tag: "prescription",
    guideTitle: "How prescription sunglasses work",
    guide: [
      "Your prescription is built into tinted lenses that fit your chosen frame. You will need an up-to-date prescription from an eye test.",
      "Single vision and progressive lenses can both be tinted. Read our lens guides to see which suits you.",
    ],
    emptyNote:
      "Prescription sunglasses are made to order. Speak to our team about turning your favourite frame into a prescription pair.",
    related: { label: "Read the single vision lens guide", href: "/lenses/single-vision" },
  },
];

const blueLight: Collection[] = [
  {
    slug: "computer",
    label: "Computer",
    title: "Computer Glasses",
    intro:
      "Comfortable glasses for long hours at a desk, with blue-cut lenses that suit the way you work.",
    tag: "computer",
    guideTitle: "Glasses for desk work",
    guide: [
      "Screens put your eyes to work at a fixed distance for hours. Blue-cut lenses, an anti-glare coating and a well-fitted frame can all add comfort.",
      "Remember the basics too: take regular breaks, blink often and keep your screen at a comfortable distance.",
    ],
  },
  {
    slug: "gaming",
    label: "Gaming",
    title: "Gaming Glasses",
    intro: "Lightweight frames and blue-cut lenses, designed to stay comfortable through long sessions.",
    tag: "gaming",
    guideTitle: "Comfort for long sessions",
    guide: [
      "Look for a frame that is light and does not slip, since you may wear it for hours. A light frame with soft nose pads helps.",
      "Take a short break every 20 minutes or so to rest your eyes.",
    ],
  },
  {
    slug: "kids",
    label: "Kids",
    title: "Kids Screen Glasses",
    intro: "Comfortable, durable frames with blue-cut lenses for young people who spend time on screens.",
    tag: "kids",
    guideTitle: "Screens and young eyes",
    guide: [
      "Healthy screen habits matter most: regular breaks, good lighting and time outdoors. Glasses can add comfort on top.",
      "If your child squints or complains of tired eyes, an eye test is the best first step.",
    ],
    emptyNote: "We are building our kids' collection. Our team can recommend options in the meantime.",
    related: { label: "Contact our team", href: "/contact" },
  },
  {
    slug: "clip-ons",
    label: "Clip-ons",
    title: "Blue-Cut Clip-Ons",
    intro: "Clip-on lenses attach to the glasses you already own, adding a blue-cut filter without a new pair.",
    tag: "clip-on",
    guideTitle: "How clip-ons work",
    guide: [
      "A clip-on sits in front of your existing frame and can be removed when you do not need it. They need a frame with a suitable shape, so ask our team to check the fit.",
    ],
    emptyNote: "Clip-ons are coming soon. If you would like to add blue-cut protection to your current frames, our team can help.",
    related: { label: "Learn about blue-cut lenses", href: "/lenses/blue-cut" },
  },
];

const eyeglasses: Collection[] = [
  {
    slug: "round",
    label: "Round",
    title: "Round Eyeglasses",
    intro: "Soft, circular frames with a quiet, artistic feel. Round glasses add gentle contrast to angular faces.",
    tag: "round",
    guideTitle: "Wearing round frames",
    guide: ["Round frames balance square and angular faces by softening the jawline. Thin metal rounds feel airy, while acetate rounds feel more substantial."],
    emptyNote: "More round frames are on the way. Browse all eyeglasses in the meantime.",
  },
  {
    slug: "rectangle",
    label: "Rectangle",
    title: "Rectangle Eyeglasses",
    intro: "Clean, modern lines in a slim rectangular shape. Understated frames that suit most faces.",
    tag: "rectangle",
    guideTitle: "Wearing rectangle frames",
    guide: ["Rectangle frames add structure to rounder faces and look sharp in the office. A slim profile keeps them light and discreet."],
  },
  {
    slug: "cat-eye",
    label: "Cat-Eye",
    title: "Cat-Eye Eyeglasses",
    intro: "An upswept outer edge that lifts the face and adds a touch of drama to everyday glasses.",
    tag: "cat-eye",
    guideTitle: "Wearing cat-eye frames",
    guide: ["Cat-eye frames draw the eye upward along the cheekbones and suit heart and oval faces. Deep colours make a quiet statement."],
  },
  {
    slug: "aviator",
    label: "Aviator",
    title: "Aviator Eyeglasses",
    intro: "A teardrop shape with a slim metal frame. Light, balanced and endlessly wearable.",
    tag: "aviator",
    guideTitle: "Wearing aviator frames",
    guide: ["Aviator frames sit well on oval and square faces, where the rounded lens softens strong angles."],
    emptyNote: "Aviator eyeglasses are coming soon. Browse all eyeglasses in the meantime.",
  },
  {
    slug: "browline",
    label: "Browline",
    title: "Browline Eyeglasses",
    intro: "A strong upper edge and a lighter lower rim. A classic, thoughtful shape for everyday glasses.",
    tag: "browline",
    guideTitle: "Wearing browline frames",
    guide: ["The bold brow line adds definition and suits oval and round faces. Pair it with a lens that keeps the profile slim."],
  },
  {
    slug: "men",
    label: "Men",
    title: "Men's Eyeglasses",
    intro: "Considered frames in classic shapes and materials, made for everyday wear.",
    tag: "men",
    guideTitle: "Finding the right frame",
    guide: ["Choose a shape that suits your face, then check the fit: the frame should sit comfortably on your nose and not pinch at the temples."],
  },
  {
    slug: "women",
    label: "Women",
    title: "Women's Eyeglasses",
    intro: "From delicate metals to bold acetates, frames that suit your style and your day.",
    tag: "women",
    guideTitle: "Finding the right frame",
    guide: ["Choose a shape that suits your face, then check the fit: the frame should sit comfortably and the lenses should be centred in front of your eyes."],
  },
  {
    slug: "kids",
    label: "Kids",
    title: "Kids' Eyeglasses",
    intro: "Durable, flexible, comfortable frames for young wearers.",
    tag: "kids",
    guideTitle: "Choosing glasses for children",
    guide: ["Look for flexible hinges, soft nose pads and a secure fit that stays put during play. An up-to-date prescription from an eye test comes first."],
    emptyNote: "We are building our kids' collection. Our team can recommend frames in the meantime.",
    related: { label: "Contact our team", href: "/contact" },
  },
];

export const groups: Record<GroupSlug, Group> = {
  sunglasses: {
    slug: "sunglasses",
    label: "Sunglasses",
    title: "Sunglasses",
    category: "Sunglasses",
    intro:
      "Sunglasses made for bright days and long evenings. Browse polarized and UV400 lenses in six classic shapes, then find the frame that suits your face.",
    metaDescription:
      "Shop luxury sunglasses at Nimah Opticals. Polarized and UV400 lenses in aviator, wayfarer, round, cat-eye, square and oversized shapes.",
    guideTitle: "How to choose your sunglasses",
    guide: [
      "Start with protection. Look for UV400 lenses, which block UVA and UVB rays, and consider polarized lenses if you drive often or spend time near water, because they cut reflected glare.",
      "Then choose a shape. Contrast is a good rule: angular frames soften round faces, and rounder frames soften angular ones. Use the filters above, or read our eyewear FAQs for more detail.",
    ],
    rows: [
      { label: "Shop by lens", slugs: ["polarized", "uv400", "mirrored", "gradient", "photochromic"] },
      { label: "Shop for", slugs: ["men", "women", "unisex", "kids", "prescription"] },
    ],
    collections: sunglasses,
  },
  "blue-light-glasses": {
    slug: "blue-light-glasses",
    label: "Blue-Cut Glasses",
    title: "Blue-Cut Glasses",
    category: "Blue-Cut",
    intro:
      "Glasses with blue-cut lenses, designed for long days at a laptop, phone or console. Comfortable frames, clear lenses and a clean look.",
    metaDescription:
      "Shop blue-cut glasses at Nimah Opticals. Computer, gaming and everyday screen glasses with blue-cut lenses.",
    guideTitle: "Choosing glasses for screen time",
    guide: [
      "Blue-cut lenses filter part of the blue light that screens emit. Many people find them more comfortable during long sessions, although research on eye strain is mixed, so think of them as a comfort option.",
      "For the best results, combine your glasses with good habits: take regular breaks, blink often and keep your screen at a comfortable distance. Our guide to blue light explains more.",
    ],
    rows: [{ label: "Shop by use", slugs: ["computer", "gaming", "kids", "clip-ons"] }],
    collections: blueLight,
  },
  eyeglasses: {
    slug: "eyeglasses",
    label: "Eyeglasses",
    title: "Eyeglasses",
    category: "Eyeglasses",
    intro:
      "Refined optical frames for a look you can wear from morning to evening. Choose a shape, then add the lenses that suit you.",
    metaDescription:
      "Shop eyeglasses and optical frames at Nimah Opticals. Round, rectangle, cat-eye, aviator and browline frames for men, women and kids.",
    guideTitle: "How to choose your frames",
    guide: [
      "Start with the shape that suits your face, then check the fit. A good frame sits comfortably on your nose, does not pinch at the temples and keeps your eyes centred in the lenses.",
      "Once you have chosen a frame, our lens guides explain the options: single vision, progressive, photochromic and blue-cut.",
    ],
    rows: [
      { label: "Shop by shape", slugs: ["round", "rectangle", "cat-eye", "aviator", "browline"] },
      { label: "Shop for", slugs: ["men", "women", "kids"] },
    ],
    collections: eyeglasses,
  },
};

export const getGroup = (slug: string) => (slug in groups ? groups[slug as GroupSlug] : undefined);

export const getCollection = (group: GroupSlug, slug: string) =>
  groups[group].collections.find((c) => c.slug === slug);
