export type NavLink = { label: string; href: string; badge?: string };
export type NavColumn = { title: string; links: NavLink[] };
export type NavFeature = {
  eyebrow: string;
  title: string;
  cta: NavLink;
  image: { src: string; alt: string };
};
export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  columns?: NavColumn[];
  feature?: NavFeature;
};

export const announcement = {
  text: "New season sunglasses. Blue-cut lenses for every screen.",
  cta: { label: "Shop now", href: "/sunglasses" },
};

export const navItems: NavItem[] = [
  { label: "New In", href: "/new-arrivals", badge: "New" },
  {
    label: "Sunglasses",
    href: "/sunglasses",
    columns: [
      {
        title: "Shop by Style",
        links: [
          { label: "Aviator", href: "/sunglasses/aviator" },
          { label: "Wayfarer", href: "/sunglasses/wayfarer" },
          { label: "Round", href: "/sunglasses/round" },
          { label: "Cat-Eye", href: "/sunglasses/cat-eye" },
          { label: "Square", href: "/sunglasses/square" },
          { label: "Oversized", href: "/sunglasses/oversized" },
        ],
      },
      {
        title: "Shop by Lens",
        links: [
          { label: "Polarized", href: "/sunglasses/polarized" },
          { label: "UV400 Protection", href: "/sunglasses/uv400" },
          { label: "Mirrored", href: "/sunglasses/mirrored" },
          { label: "Gradient", href: "/sunglasses/gradient" },
          { label: "Photochromic", href: "/sunglasses/photochromic" },
        ],
      },
      {
        title: "Shop For",
        links: [
          { label: "Men", href: "/sunglasses/men" },
          { label: "Women", href: "/sunglasses/women" },
          { label: "Unisex", href: "/sunglasses/unisex" },
          { label: "Kids", href: "/sunglasses/kids" },
          { label: "Prescription Sunglasses", href: "/sunglasses/prescription" },
        ],
      },
    ],
    feature: {
      eyebrow: "The Summer Edit",
      title: "Sun-ready, effortlessly",
      cta: { label: "Explore the edit", href: "/sunglasses" },
      image: {
        src: "/images/menu/sunglasses.webp",
        alt: "Woman wearing tortoiseshell sunglasses on a sunlit terrace",
      },
    },
  },
  {
    label: "Blue Light",
    href: "/blue-light-glasses",
    columns: [
      {
        title: "Blue-Light Glasses",
        links: [
          { label: "Computer Glasses", href: "/blue-light-glasses/computer" },
          { label: "Gaming Glasses", href: "/blue-light-glasses/gaming" },
          { label: "Kids Screen Glasses", href: "/blue-light-glasses/kids" },
          { label: "Clip-Ons", href: "/blue-light-glasses/clip-ons" },
        ],
      },
      {
        title: "Blue-Cut Lenses",
        links: [
          { label: "Add to Any Frame", href: "/lenses/blue-cut" },
          { label: "Anti-Glare Coating", href: "/lenses/anti-glare" },
          { label: "Prescription Blue-Cut", href: "/lenses/prescription-blue-cut" },
        ],
      },
      {
        title: "Learn",
        links: [
          { label: "What is blue light?", href: "/blog/what-is-blue-light" },
          { label: "Choosing screen glasses", href: "/blog/choosing-screen-glasses" },
        ],
      },
    ],
    feature: {
      eyebrow: "Screen Ready",
      title: "Built for long screen days",
      cta: { label: "Shop blue-cut", href: "/blue-light-glasses" },
      image: {
        src: "/images/menu/blue-light.webp",
        alt: "Man wearing clear-lens computer glasses while working at a laptop",
      },
    },
  },
  {
    label: "Eyeglasses",
    href: "/eyeglasses",
    columns: [
      {
        title: "Shop by Shape",
        links: [
          { label: "Round", href: "/eyeglasses/round" },
          { label: "Rectangle", href: "/eyeglasses/rectangle" },
          { label: "Cat-Eye", href: "/eyeglasses/cat-eye" },
          { label: "Aviator", href: "/eyeglasses/aviator" },
          { label: "Browline", href: "/eyeglasses/browline" },
        ],
      },
      {
        title: "Shop For",
        links: [
          { label: "Men", href: "/eyeglasses/men" },
          { label: "Women", href: "/eyeglasses/women" },
          { label: "Kids", href: "/eyeglasses/kids" },
        ],
      },
      {
        title: "Lenses",
        links: [
          { label: "Single Vision", href: "/lenses/single-vision" },
          { label: "Progressive", href: "/lenses/progressive" },
          { label: "Photochromic", href: "/lenses/photochromic" },
          { label: "Blue-Cut", href: "/lenses/blue-cut" },
        ],
      },
    ],
    feature: {
      eyebrow: "Frames",
      title: "Find the frame that is yours",
      cta: { label: "Browse eyeglasses", href: "/eyeglasses" },
      image: {
        src: "/images/menu/eyeglasses.webp",
        alt: "Woman wearing burgundy prescription eyeglasses and a beige jacket",
      },
    },
  },
  { label: "Contact Lenses", href: "/contact-lenses" },
  { label: "Coloured Lenses", href: "/coloured-lenses" },
];

export const trending = ["Aviator", "Polarized", "Blue-cut", "Cat-eye", "Kids"];
