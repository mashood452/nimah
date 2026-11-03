export type FaqItem = { q: string; a: string };

// General eyewear knowledge only. Add store-specific answers (delivery, returns, warranty) once they are confirmed.
export const faqs: FaqItem[] = [
  {
    q: "What are blue-cut lenses and do I need them?",
    a: "Blue-cut (blue-light filtering) lenses reduce the amount of high-energy blue light that passes through the lens, mainly the light that comes from phones, laptops and other screens. Many people find them more comfortable during long screen sessions. Research on eye strain is still mixed, so think of them as a comfort option rather than a medical treatment.",
  },
  {
    q: "What does UV400 mean on sunglasses?",
    a: "UV400 lenses block light with wavelengths up to 400 nanometres, which covers both UVA and UVB rays. It is the standard to look for when buying sunglasses. UV400 describes UV protection, not how dark the lens looks.",
  },
  {
    q: "What is the difference between polarized and non-polarized lenses?",
    a: "Polarized lenses have a filter that cuts glare reflected from flat surfaces such as water, roads and car windscreens. They are a great choice for driving, boating and the beach. They can make some digital screens harder to read, so many people keep a non-polarized pair for everyday use.",
  },
  {
    q: "Do darker lenses give better UV protection?",
    a: "No. UV protection comes from the lens material or a UV coating, not from the tint. A light lens with UV400 protection can protect your eyes as well as a very dark one. Darker lenses simply reduce brightness, which can make bright days more comfortable.",
  },
  {
    q: "How do I choose a frame shape for my face?",
    a: "Contrast is a good rule. Round faces tend to suit angular frames such as square or wayfarer styles. Square or angular faces tend to suit softer round or aviator shapes. Oval faces suit most shapes. Use our shop by style guide as a starting point, then choose the pair that feels comfortable and looks like you.",
  },
  {
    q: "How should I clean and look after my glasses?",
    a: "Rinse the lenses with lukewarm water to remove dust, then clean them with a microfibre cloth and a lens-safe cleaner. Avoid wiping dry lenses with clothing or paper towels, because they can leave fine scratches. Store your glasses in their case when you are not wearing them and avoid leaving them in a hot car.",
  },
];
