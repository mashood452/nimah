// Content for the contact lenses page. Photos are picked up automatically from public/images/contact-lenses/
// by name, see docs/image-generation/contact-lenses.md for the file names, sizes and prompts.

export const IMAGE_FOLDER = "contact-lenses";

export type LensType = {
  slug: string;
  title: string;
  text: string;
  /** one line for the card */
  bestFor: string;
  /** shown in the comparison table */
  replaced: string;
  care: string;
  /** photo file name (without extension) and its description, used once the photo is added */
  image: string;
  imageAlt: string;
};

export const lensTypes: LensType[] = [
  {
    slug: "daily-disposables",
    title: "Daily disposable lenses",
    text: "A fresh pair every day, with no cleaning or storage. Convenient and hygienic, and a popular choice for occasional wear, travel and sport.",
    bestFor: "Occasional wear, travel and sport",
    replaced: "Every day",
    care: "None. Wear once and throw away",
    image: "type-daily-v2",
    imageAlt: "Daily disposable contact lens in an opened single-use blister beside sealed individual packs",
  },
  {
    slug: "monthly-lenses",
    title: "Two-weekly and monthly lenses",
    text: "Worn for a set period, then replaced. They need cleaning and storing each night, and they suit regular, everyday wearers.",
    bestFor: "Regular, everyday wear",
    replaced: "Every two weeks or every month",
    care: "Clean and store in fresh solution every night",
    image: "type-monthly",
    imageAlt: "Monthly contact lens in a lens case with fresh solution",
  },
  {
    slug: "toric-lenses",
    title: "Toric lenses for astigmatism",
    text: "Designed to correct astigmatism. They are shaped to stay in the right position on the eye so that vision stays clear and steady.",
    bestFor: "Astigmatism",
    replaced: "Daily, two-weekly or monthly options",
    care: "Depends on the lens type",
    image: "type-toric",
    imageAlt: "Toric contact lens for astigmatism shown from the side",
  },
  {
    slug: "multifocal-lenses",
    title: "Multifocal lenses",
    text: "Give clear vision at several distances, for people who need help both near and far, such as reading and driving.",
    bestFor: "Clear vision at near and far",
    replaced: "Daily or monthly options",
    care: "Depends on the lens type",
    image: "type-multifocal",
    imageAlt: "Clear contact lens in saline with an open book softly blurred in the background",
  },
  {
    slug: "coloured-lenses",
    title: "Coloured contact lenses",
    text: "Change or enhance your eye colour. Some are made with a prescription, and all of them need a proper fitting, even when they do not correct vision.",
    bestFor: "Changing or enhancing eye colour",
    replaced: "Daily or monthly options",
    care: "The same as a clear lens of that type",
    image: "type-coloured",
    imageAlt: "Close-up of an eye wearing a natural-looking coloured contact lens",
  },
  {
    slug: "specialist-lenses",
    title: "Specialist lenses",
    text: "For complex prescriptions and some eye conditions. These need a specialist assessment and a careful, individual fitting.",
    bestFor: "Complex prescriptions and some eye conditions",
    replaced: "As advised by your specialist",
    care: "As advised by your specialist",
    image: "type-specialist",
    imageAlt: "Gloved hands inspecting a specialist contact lens in an optometry room",
  },
];

export const fittingSteps = [
  {
    title: "An eye examination",
    text: "Your eye care professional checks the health of your eyes and your vision, and talks to you about how you want to wear lenses.",
  },
  {
    title: "A contact lens fitting",
    text: "The lens size, curve and shape are matched to your eyes. This is different from a glasses prescription and needs its own measurements.",
  },
  {
    title: "Learn to handle them",
    text: "Practise putting lenses in and taking them out, and learn how to clean, store and look after them.",
  },
  {
    title: "Regular check-ups",
    text: "Keep your appointments so your eyes stay healthy and your prescription stays up to date.",
  },
];

export const safetyTips = [
  "Wash and dry your hands before touching your lenses.",
  "Never use tap water on lenses or a lens case, and never put saliva on them.",
  "Use fresh solution every time, and replace your lens case regularly.",
  "Follow your replacement schedule, and take lenses out before swimming or showering.",
  "Never sleep in your lenses unless your eye care professional has said they are made for it.",
  "Take lenses out and call your eye care professional if your eyes are red, sore or blurry.",
];

/** The two before and after sliders. `blur` is the strength in px applied to the "before" photo. */
export const comparisons = [
  {
    key: "clarity",
    title: "Everyday clarity",
    text: "Streets, signs, faces and screens, sharp from edge to edge. Contact lenses sit on the eye, so the whole field of view stays clear.",
    before: { image: "clarity-before", label: "Without correction", alt: "Everyday street scene blurred, as seen without vision correction" },
    after: { image: "clarity-after", label: "With contact lenses", alt: "The same street scene, sharp and clear with contact lenses" },
    art: "chart" as const,
    blur: 6,
  },
  {
    key: "active",
    title: "Freedom to move",
    text: "No frames to slip, fog up or get in the way. Lenses move with you, which many people like for sport, travel and busy days.",
    before: { image: "active-before", label: "Without correction", alt: "Outdoor activity scene blurred, as seen without vision correction" },
    after: { image: "active-after", label: "With contact lenses", alt: "The same outdoor scene, sharp and clear with contact lenses" },
    art: "chart" as const,
    blur: 6,
  },
];

export const faqs = [
  {
    q: "Is a contact lens prescription the same as a glasses prescription?",
    a: "No. A contact lens prescription includes extra measurements, such as the curve and diameter of the lens, because the lens sits on the eye. You need a contact lens fitting, not just a glasses prescription.",
  },
  {
    q: "Can I wear contact lenses if I have astigmatism?",
    a: "Often, yes. Toric contact lenses are designed for astigmatism and are shaped to stay in the right position on the eye. Your eye care professional will check whether they suit you and fit them carefully.",
  },
  {
    q: "Are coloured contact lenses safe?",
    a: "Coloured lenses are safe when they are properly fitted and cared for, even when they do not correct your vision. They should always be fitted by an eye care professional, and they should never be shared.",
  },
  {
    q: "How long can I wear my contact lenses each day?",
    a: "It depends on your lens type and your eyes, so follow the wearing schedule your eye care professional gives you. Give your eyes regular breaks, and take your lenses out if they feel uncomfortable.",
  },
  {
    q: "Can I sleep in my contact lenses?",
    a: "Only if your eye care professional has told you that your lenses are designed for it. Sleeping in lenses that are not made for overnight wear raises the risk of eye infections.",
  },
  {
    q: "How often should I replace my lenses?",
    a: "Follow the schedule for your lens type and the advice of your eye care professional. Wearing lenses beyond their replacement date can cause discomfort and infections.",
  },
  {
    q: "Can I wear sunglasses over my contact lenses?",
    a: "Yes, and it is a good idea. Some contact lenses block a little UV light, but they do not cover the whole eye area, so sunglasses with UV400 protection still add valuable protection from sun and glare.",
  },
  {
    q: "Can I switch between contact lenses and glasses?",
    a: "Yes. Many people wear contact lenses for sport and social occasions and glasses at home or when their eyes need a rest. It is helpful to keep an up-to-date pair of glasses ready.",
  },
  {
    q: "What should I do if my eye is red, painful or blurry?",
    a: "Take the lens out and see an eye care professional promptly. Do not put the lens back in until you have been checked.",
  },
  {
    q: "How do I ask about contact lenses at Nimah Opticals?",
    a: "Get in touch through our contact page or on WhatsApp. Our team will explain the next steps, including fittings, availability and ordering.",
  },
];
