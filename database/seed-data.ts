// Initial content only. The application reads MySQL, never this file.
import type { Product } from "../src/components/products/products-data";
import type { ProductInfo } from "../src/lib/product-info";
import type { Post } from "../src/lib/blog-types";
export const products: Product[] = [
  { slug: "aurelia-aviator", name: "Aurelia", subtitle: "Gold aviator, polarized", category: "Sunglasses", price: 690, shape: "aviator", swatches: ["#c9a96a", "#2b2b2b", "#8a8f94"], badge: "Best seller", image: "/images/products/aurelia-aviator.webp" },
  { slug: "sierra-wayfarer", name: "Sierra", subtitle: "Tortoise wayfarer, UV400", category: "Sunglasses", price: 580, shape: "wayfarer", swatches: ["#6b3f26", "#1f1a1b"], badge: "New", image: "/images/products/sierra-wayfarer.webp" },
  { slug: "luna-round", name: "Luna", subtitle: "Rose-gold round, mirrored", category: "Sunglasses", price: 620, shape: "round", swatches: ["#d3a38d", "#c9a96a", "#2b2b2b"], image: "/images/products/luna-round.webp" },
  { slug: "valentina-cat-eye", name: "Valentina", subtitle: "Burgundy cat-eye, gradient", category: "Sunglasses", price: 650, shape: "cat-eye", swatches: ["#6e1f2f", "#1f1a1b"], badge: "New", image: "/images/products/valentina-cat-eye.webp" },
  { slug: "marlowe-square", name: "Marlowe", subtitle: "Black square, polarized", category: "Sunglasses", price: 550, shape: "square", swatches: ["#1f1a1b", "#6b3f26"], image: "/images/products/marlowe-square.webp" },
  { slug: "dahlia-oversized", name: "Dahlia", subtitle: "Amber oversized, gradient", category: "Sunglasses", price: 730, shape: "oversized", swatches: ["#b5702f", "#1f1a1b", "#c9a96a"], badge: "Best seller", image: "/images/products/dahlia-oversized.webp" },
  { slug: "atlas-blue-cut", name: "Atlas", subtitle: "Square frame, blue-cut lenses", category: "Blue-Cut", price: 480, shape: "square", swatches: ["#1f1a1b", "#4a5d7a"], badge: "Best seller", image: "/images/products/atlas-blue-cut.webp" },
  { slug: "nova-blue-cut", name: "Nova", subtitle: "Round frame, blue-cut lenses", category: "Blue-Cut", price: 440, shape: "round", swatches: ["#c9a96a", "#1f1a1b"], badge: "New", image: "/images/products/nova-blue-cut.webp" },
  { slug: "pixel-blue-cut", name: "Pixel", subtitle: "Wayfarer, blue-cut lenses", category: "Blue-Cut", price: 510, shape: "wayfarer", swatches: ["#1f1a1b", "#6b3f26", "#4a5d7a"], image: "/images/products/pixel-blue-cut.webp" },
  { slug: "ellis-optical", name: "Ellis", subtitle: "Browline optical frame", category: "Eyeglasses", price: 640, shape: "browline", swatches: ["#1f1a1b", "#c9a96a"], image: "/images/products/ellis-optical.webp" },
  { slug: "wren-optical", name: "Wren", subtitle: "Cat-eye optical frame", category: "Eyeglasses", price: 600, shape: "cat-eye", swatches: ["#6e1f2f", "#1f1a1b", "#d3a38d"], badge: "New", image: "/images/products/wren-optical.webp" },
  { slug: "orion-optical", name: "Orion", subtitle: "Rectangle optical frame", category: "Eyeglasses", price: 570, shape: "rectangle", swatches: ["#1f1a1b", "#8a8f94"], image: "/images/products/orion-optical.webp" },
];

export const productInfo: Record<string, ProductInfo> = {
  "aurelia-aviator": {
    tags: ["polarized", "uv400", "unisex", "aviator"],
    description:
      "A gold-toned aviator with a slim double bridge and polarized lenses that cut glare on bright days. Light on the face and easy to wear from the first morning to the last sunset.",
    features: ["Polarized lenses to reduce glare", "UV400 protection", "Gold-tone aviator frame"],
  },
  "sierra-wayfarer": {
    tags: ["uv400", "men", "wayfarer"],
    description:
      "A tortoiseshell wayfarer with a confident brow line. Bold enough to make a statement and easy enough to wear every day.",
    features: ["UV400 protection", "Tortoiseshell wayfarer frame", "A bold, everyday shape"],
  },
  "luna-round": {
    tags: ["mirrored", "uv400", "women", "round"],
    description:
      "Soft, round lenses with a rose-gold mirror finish. A light, artistic frame that brings a little warmth to any outfit.",
    features: ["Mirrored lenses", "UV400 protection", "Rose-gold round frame"],
  },
  "valentina-cat-eye": {
    tags: ["gradient", "uv400", "women", "cat-eye"],
    description:
      "A burgundy cat-eye with an upswept edge and gradient lenses. Graphic, elegant and made to be noticed.",
    features: ["Gradient lenses", "UV400 protection", "Burgundy cat-eye frame"],
  },
  "marlowe-square": {
    tags: ["polarized", "uv400", "men", "square"],
    description:
      "A clean black square frame with polarized lenses. Sharp, modern and quietly confident from city streets to coastal roads.",
    features: ["Polarized lenses to reduce glare", "UV400 protection", "Black square frame"],
  },
  "dahlia-oversized": {
    tags: ["gradient", "uv400", "women", "oversized"],
    description:
      "Generous amber oversized frames with gradient lenses. Full coverage, plenty of presence and a warm, glamorous finish.",
    features: ["Gradient lenses", "UV400 protection", "Amber oversized frame"],
  },
  "atlas-blue-cut": {
    tags: ["computer", "men", "square"],
    description:
      "A square frame fitted with blue-cut lenses, made for long days at a laptop. Clean lines that work in the office and out of it.",
    features: ["Blue-cut lenses", "Square frame", "Suited to everyday computer use"],
  },
  "nova-blue-cut": {
    tags: ["computer", "women", "round"],
    description:
      "A light, round frame fitted with blue-cut lenses. A softer look for screen-heavy days.",
    features: ["Blue-cut lenses", "Round frame", "Suited to everyday computer use"],
  },
  "pixel-blue-cut": {
    tags: ["gaming", "computer", "unisex", "wayfarer"],
    description:
      "A wayfarer shape with blue-cut lenses, built for long sessions at a desk or a console. Comfortable to wear for hours.",
    features: ["Blue-cut lenses", "Wayfarer frame", "Comfortable for long sessions"],
  },
  "ellis-optical": {
    tags: ["browline", "men"],
    description:
      "A browline optical frame with a strong upper edge and a lighter lower rim. A classic, intellectual shape for everyday glasses.",
    features: ["Browline optical frame", "Designed for prescription lenses", "A timeless shape"],
  },
  "wren-optical": {
    tags: ["cat-eye", "women"],
    description:
      "A burgundy cat-eye optical frame with a lifted outer edge. Adds a little drama to everyday glasses.",
    features: ["Cat-eye optical frame", "Designed for prescription lenses", "Deep burgundy finish"],
  },
  "orion-optical": {
    tags: ["rectangle", "men"],
    description:
      "A slim rectangle optical frame with clean, modern lines. Understated, light and easy to wear all day.",
    features: ["Rectangle optical frame", "Designed for prescription lenses", "Slim, lightweight profile"],
  },
};


export const posts: Post[] = [
  {
    slug: "what-is-blue-light",
    title: "What is blue light, and do blue-cut glasses help?",
    excerpt:
      "Blue light is everywhere, from the sun to your phone. Here is what it is, what the research says and how to look after your eyes on screen-heavy days.",
    category: "Eye comfort",
    date: "2026-10-20",
    readMinutes: 5,
    image: "/images/blogs/what-is-blue-light.webp",
    imageAlt: "Man wearing glasses while working on a laptop",
    takeaways: [
      "Blue light is part of normal visible light, and the sun is our biggest source of it.",
      "Screens give off far less blue light than sunlight does.",
      "Most screen-related eye strain comes from how we use screens, not from blue light alone.",
      "Blue-cut lenses are a comfort option, not a medical treatment.",
    ],
    productTag: { category: "Blue-Cut" },
    sections: [
      {
        id: "what-is-blue-light",
        title: "What is blue light?",
        body: [
          {
            p: "Visible light is made of many colours, each with a different wavelength. Blue light sits at the short-wavelength end of the visible range. It carries a little more energy than the light at the red end, which is why it is often talked about.",
          },
          {
            p: "Blue light is not a modern invention or a sign that something is wrong. It is a normal part of daylight, and it helps regulate our body clock by telling us when it is day.",
          },
        ],
      },
      {
        id: "where-it-comes-from",
        title: "Where does it come from?",
        body: [
          {
            ul: [
              "**The sun**, by a very wide margin.",
              "**LED and fluorescent lighting**, which many homes and offices use.",
              "**Screens**, including phones, laptops, tablets, televisions and consoles.",
            ],
          },
          {
            p: "A few hours outdoors exposes your eyes to far more blue light than a day at a screen.",
          },
        ],
      },
      {
        id: "is-screen-light-harmful",
        title: "Is blue light from screens harmful?",
        body: [
          {
            p: "Leading eye health organisations say there is no clear evidence that the light from screens damages healthy eyes. Studies have also not shown clearly that blue-light filtering lenses prevent eye strain or protect against eye disease.",
          },
          {
            note: {
              title: "Evening light and sleep",
              text: "Bright light in the evening, including from screens, can make it harder to wind down. Lowering your screen brightness, using a night mode and putting devices away before bed will usually help more than glasses alone.",
            },
          },
        ],
      },
      {
        id: "why-eyes-feel-tired",
        title: "Why do my eyes feel tired after screen time?",
        body: [
          {
            p: "The most common cause is what eye care professionals call digital eye strain. It is linked to how we use screens rather than to the colour of the light:",
          },
          {
            ul: [
              "We blink less when we concentrate, which can leave eyes dry and uncomfortable.",
              "Focusing at one close distance for hours tires the eye’s focusing muscles.",
              "Glare and reflections force the eyes to work harder.",
              "Poor posture and screen position add neck and shoulder strain.",
            ],
          },
        ],
      },
      {
        id: "what-can-help",
        title: "What can help",
        body: [
          {
            ol: [
              "Follow the 20-20-20 rule: every 20 minutes, look at something about 20 feet (6 metres) away for 20 seconds.",
              "Blink often, and consciously during long sessions.",
              "Position your screen slightly below eye level and at a comfortable arm’s length.",
              "Reduce glare with good lighting and, if you wear glasses, an [anti-glare coating](/lenses/anti-glare).",
              "Increase text size if you find yourself leaning in.",
              "Have regular eye tests, because an out-of-date prescription is a common cause of tired eyes.",
            ],
          },
        ],
      },
      {
        id: "are-blue-cut-glasses-worth-it",
        title: "So, are blue-cut glasses worth it?",
        body: [
          {
            p: "Many people like how blue-cut lenses feel during long days at a screen, and for them the comfort is reason enough. Just remember that they are an extra rather than a cure. Good habits do most of the work.",
          },
          {
            p: "If you are curious, explore our [blue-cut glasses](/blue-light-glasses) and read our [blue-cut lens guide](/lenses/blue-cut). Our team can also talk you through the options.",
          },
        ],
      },
    ],
  },
  {
    slug: "choosing-screen-glasses",
    title: "How to choose glasses for long screen days",
    excerpt:
      "From an eye test to the right lenses, coatings and fit, here is a simple guide to glasses that stay comfortable at your desk.",
    category: "Buying guide",
    date: "2026-10-27",
    readMinutes: 6,
    image: "/images/blogs/choosing-screen-glasses.webp",
    imageAlt: "Man in a cream knit polo wearing clear-lens gold glasses at a studio desk",
    takeaways: [
      "Start with an up-to-date eye test.",
      "Choose lenses for your working distance, not just for the frame you like.",
      "An anti-glare coating is one of the most useful additions for screen work.",
      "A light, well-fitted frame makes the biggest difference to comfort.",
    ],
    productTag: { category: "Blue-Cut", tag: "computer" },
    sections: [
      {
        id: "start-with-an-eye-test",
        title: "Start with an eye test",
        body: [
          {
            p: "If your eyes feel tired by the end of the day, the first step is an eye test. A small change in prescription, or a need for reading help that you have not noticed, can cause the same symptoms people blame on screens.",
          },
        ],
      },
      {
        id: "choose-lenses-for-how-you-work",
        title: "Choose lenses for how you work",
        body: [
          {
            ul: [
              "**Single vision:** if you need one distance of correction, a [single vision lens](/lenses/single-vision) set for your screen distance can be very comfortable.",
              "**Progressive or office lenses:** if you need help at several distances, [progressive lenses](/lenses/progressive) cover more of the range. Lenses designed for office use have a wider zone for screens.",
              "**No prescription:** if you do not need vision correction, you can still add lens options to a frame you love.",
            ],
          },
        ],
      },
      {
        id: "add-an-anti-glare-coating",
        title: "Add an anti-glare coating",
        body: [
          {
            p: "Reflections from screens and overhead lighting make your eyes work harder. An [anti-glare coating](/lenses/anti-glare) cuts them, which many people find the most noticeable improvement for desk work.",
          },
        ],
      },
      {
        id: "consider-blue-cut",
        title: "Consider blue-cut lenses",
        body: [
          {
            p: "[Blue-cut lenses](/lenses/blue-cut) filter part of the blue light from screens. The research on eye strain is mixed, so treat them as a comfort choice. If you like the idea, they pair well with an anti-glare coating.",
          },
        ],
      },
      {
        id: "pick-a-frame-that-fits",
        title: "Pick a frame that fits",
        body: [
          {
            p: "You may wear these glasses for hours, so fit matters as much as style:",
          },
          {
            ul: [
              "Choose a light frame, especially if your lenses are strong.",
              "The frame should sit comfortably on your nose without slipping when you look down.",
              "It should not pinch at your temples or behind your ears.",
              "Your eyes should sit near the centre of each lens.",
            ],
          },
          {
            p: "Browse our [computer glasses](/blue-light-glasses/computer) or [eyeglasses](/eyeglasses) for ideas.",
          },
        ],
      },
      {
        id: "build-good-habits",
        title: "Build good screen habits",
        body: [
          {
            p: "Even the best glasses cannot replace habits. Take regular breaks, blink often, keep your screen at a comfortable distance and make sure your room lighting is not much brighter or darker than your screen.",
          },
        ],
      },
    ],
  },
  {
    slug: "choose-sunglasses",
    title: "How to choose sunglasses for your face shape and lifestyle",
    excerpt:
      "UV protection, polarized lenses, lens colour and shape: a simple guide to finding sunglasses that look good and protect your eyes.",
    category: "Style guide",
    date: "2026-11-02",
    readMinutes: 5,
    image: "/images/blogs/choose-sunglasses.webp",
    imageAlt: "Woman in an ivory suit wearing tortoiseshell sunglasses on a sunlit rooftop",
    takeaways: [
      "Check for UV400 protection first, whatever the style.",
      "Polarized lenses reduce glare, which helps for driving and the water.",
      "Contrast is a good rule for shape: angular frames soften round faces and the reverse.",
      "Fit and coverage matter as much as looks.",
    ],
    productTag: { category: "Sunglasses" },
    sections: [
      {
        id: "protection-first",
        title: "Protection comes first",
        body: [
          {
            p: "Look for lenses labelled **UV400**, which block UVA and UVB light up to 400 nanometres. This is about the lens treatment, not how dark the lens looks. A light tint with UV400 protects as well as a very dark one. See our [UV400 collection](/sunglasses/uv400).",
          },
        ],
      },
      {
        id: "polarized-or-not",
        title: "Polarized or not?",
        body: [
          {
            p: "Polarized lenses cut the glare that reflects off water, wet roads and car windscreens, so they are popular for driving, boating and the beach. They can make some digital screens look dim, so test your phone or dashboard when you try a pair. Browse [polarized sunglasses](/sunglasses/polarized).",
          },
        ],
      },
      {
        id: "pick-a-lens-colour",
        title: "Pick a lens colour",
        body: [
          {
            ul: [
              "**Grey:** reduces brightness while keeping colours true.",
              "**Brown or amber:** adds warmth and contrast, useful in changing light.",
              "**Green:** a natural, balanced view with good clarity.",
              "**Gradient:** darker at the top for sun overhead, clearer below for looking at a map or phone.",
              "**Mirrored:** reflects extra light for very bright conditions and adds a bold finish.",
            ],
          },
        ],
      },
      {
        id: "find-your-shape",
        title: "Find your shape",
        body: [
          {
            p: "A reliable rule is contrast. Angular frames soften round faces, and rounder frames soften angular ones. Oval faces suit most shapes.",
          },
          {
            ul: [
              "**Round face:** try [wayfarer](/sunglasses/wayfarer) or [square](/sunglasses/square) frames.",
              "**Square face:** try [round](/sunglasses/round) or [aviator](/sunglasses/aviator) frames.",
              "**Heart-shaped face:** try [cat-eye](/sunglasses/cat-eye) or [oversized](/sunglasses/oversized) frames.",
              "**Oval face:** most shapes work, so choose the one you love.",
            ],
          },
        ],
      },
      {
        id: "check-the-fit",
        title: "Check the fit",
        body: [
          {
            p: "Good sunglasses sit comfortably on your nose and do not slide when you move your head. The arms should rest gently behind your ears without pinching. For the most protection, look for lenses that are large enough, or wrap far enough around, to shield the sides of your eyes.",
          },
        ],
      },
      {
        id: "look-after-them",
        title: "Look after them",
        body: [
          {
            p: "Rinse with lukewarm water, clean with a microfibre cloth and keep your sunglasses in their case. Avoid leaving them in a hot car, where heat can damage coatings and frames.",
          },
        ],
      },
    ],
  },
];

