// Content for the coloured contact lenses page. Photos are picked up automatically from
// public/images/coloured-lenses/ by name, see docs/image-generation/coloured-lenses.md for the file names and sizes.

export const IMAGE_FOLDER = "coloured-lenses";

export type Shade = {
  slug: string;
  title: string;
  /** one short line that describes the look */
  text: string;
  /** who the shade usually suits, kept general on purpose */
  suits: string;
  /** photo file name (without extension) and its description, used once the photo is added */
  image: string;
  imageAlt: string;
  /** colours of the placeholder eye, and of the swatch dot beside the name */
  tone: { outer: string; inner: string };
};

export const shades: Shade[] = [
  {
    slug: "hazel",
    title: "Hazel",
    text: "A warm blend of green, gold and brown that shifts with the light. Soft, natural and easy to wear every day.",
    suits: "A first coloured lens, and a subtle, natural change",
    image: "shade-hazel",
    imageAlt: "Close-up of an eye wearing a natural hazel coloured contact lens",
    tone: { outer: "#7d5f33", inner: "#b8975a" },
  },
  {
    slug: "honey",
    title: "Honey",
    text: "A glowing golden amber that brightens the eyes. Warm in sunlight and flattering with olive and deeper skin tones.",
    suits: "Brown eyes that you would like to lighten gently",
    image: "shade-honey",
    imageAlt: "Close-up of an eye wearing a warm honey coloured contact lens in sunlight",
    tone: { outer: "#a8731f", inner: "#dcae5e" },
  },
  {
    slug: "green",
    title: "Green",
    text: "From soft sage to deep emerald. A distinctive shade that looks striking against warm skin and dark hair.",
    suits: "People who want a clear, noticeable change",
    image: "shade-green",
    imageAlt: "Close-up of an eye wearing a green coloured contact lens",
    tone: { outer: "#4a7550", inner: "#88ae84" },
  },
  {
    slug: "blue",
    title: "Blue",
    text: "A bright, clear blue, from a pale sky tone to a deeper sapphire. A bold look that draws the eye.",
    suits: "A confident, eye-catching change",
    image: "shade-blue",
    imageAlt: "Close-up of an eye wearing a blue coloured contact lens",
    tone: { outer: "#44709f", inner: "#8db4d6" },
  },
  {
    slug: "grey",
    title: "Grey",
    text: "A cool, silvery grey with a modern feel. It looks different in every light, from soft steel to pale smoke.",
    suits: "A cool-toned, understated change",
    image: "shade-grey",
    imageAlt: "Close-up of an eye wearing a grey coloured contact lens",
    tone: { outer: "#69737d", inner: "#a9b2ba" },
  },
  {
    slug: "brown",
    title: "Deep brown",
    text: "A rich, dark brown that adds depth and definition. A natural way to enhance the colour you already have.",
    suits: "Enhancing your own colour without changing it",
    image: "shade-brown",
    imageAlt: "Close-up of an eye wearing a rich dark brown coloured contact lens",
    tone: { outer: "#4e3322", inner: "#85603f" },
  },
];

/** The kinds of coloured lens, shown in the comparison table. */
export const lensKinds = [
  {
    title: "Enhancement tint",
    effect: "A see-through tint that deepens or brightens the colour you already have.",
    bestFor: "Light eyes, or a soft change on any eye colour",
    look: "Soft and natural",
  },
  {
    title: "Opaque colour",
    effect: "A solid colour layer that changes the colour, even on darker eyes.",
    bestFor: "A clear change of colour, including on dark brown eyes",
    look: "Bold and noticeable",
  },
  {
    title: "Natural-look pattern",
    effect: "A layered pattern that blends with your own eye for a more lifelike finish.",
    bestFor: "A change that still looks like your own eyes",
    look: "Realistic, with depth",
  },
];

export const steps = [
  {
    title: "Choose your look",
    text: "Tell our team the colour and the effect you have in mind, from a soft enhancement to a bold change.",
  },
  {
    title: "A fitting for your eyes",
    text: "Your eye care professional checks your eyes and measures them. Coloured lenses are fitted to your eyes, even though they are worn for fashion.",
  },
  {
    title: "Learn to wear them",
    text: "Practise putting lenses in and taking them out, and learn how to clean, store and look after them.",
  },
  {
    title: "Regular check-ups",
    text: "Keep your appointments so your eyes stay healthy and your lenses keep fitting well.",
  },
];

export const safetyTips = [
  "Always have coloured lenses fitted by an eye care professional, even though they are worn for fashion.",
  "Never share lenses with anyone, not even for a photo or a special event.",
  "Wash and dry your hands before touching your lenses, and never use tap water or saliva on them.",
  "Use fresh solution every time, and replace your lens case regularly.",
  "Follow your replacement schedule, and never sleep in your lenses unless your eye care professional has said they are made for it.",
  "Take lenses out and call your eye care professional if your eyes are red, sore or blurry.",
];

export const faqs = [
  {
    q: "What are coloured contact lenses?",
    a: "They are soft contact lenses worn for fashion, to change or enhance the colour of your eyes. They still sit on the eye like any contact lens, so they need a proper fitting and careful aftercare.",
  },
  {
    q: "Will a coloured lens work on dark brown eyes?",
    a: "Usually, yes, with the right kind of lens. Opaque lenses can change the colour of darker eyes, while a see-through enhancement tint shows best on lighter eyes. Our team can explain which kind suits you.",
  },
  {
    q: "Will coloured lenses look natural?",
    a: "They can. A softer shade that is close to your own colour looks the most natural, and a bolder shade gives a more dramatic result. Ask our team about the look you want before you decide.",
  },
  {
    q: "Do coloured lenses affect my vision?",
    a: "Coloured lenses are made to let you see clearly, but they are worn for fashion and do not correct your vision. Some people notice a small difference at first, for example in dim light, and most get used to it. Tell your eye care professional if anything feels wrong.",
  },
  {
    q: "Are coloured contact lenses safe?",
    a: "They are safe when they are properly fitted and cared for. The risks come from lenses that are not fitted, are shared, or are bought from sources that do not check your eyes. See an eye care professional before you wear any lens.",
  },
  {
    q: "How long can I wear my coloured lenses each day?",
    a: "It depends on the lens and on your eyes, so follow the wearing schedule your eye care professional gives you. Give your eyes regular breaks, and take your lenses out if they feel uncomfortable.",
  },
  {
    q: "Can I wear coloured lenses for a one-off event?",
    a: "Yes, once they have been fitted for you. Please do not borrow or share lenses for an event, and do not buy lenses without a fitting.",
  },
  {
    q: "How do I ask about coloured lenses at Nimah Opticals?",
    a: "Request a callback on this page, or message us on WhatsApp. Our team will explain the shades, the fitting and the next steps.",
  },
];
