export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "Sunglasses", href: "/sunglasses" },
      { label: "Blue-Cut Glasses", href: "/blue-light-glasses" },
      { label: "Eyeglasses", href: "/eyeglasses" },
      { label: "Contact Lenses", href: "/contact-lenses" },
      { label: "New Arrivals", href: "/new-arrivals" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Eyewear FAQs", href: "/#faq" },
      { label: "Lens guides", href: "/lenses" },
      { label: "Shipping and delivery", href: "/shipping" },
      { label: "Returns and exchanges", href: "/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Nimah", href: "/about" },
      { label: "Journal", href: "/blog" },
      { label: "Lookbook", href: "/lookbook" },
    ],
  },
];

export const legalLinks: FooterLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Cookie policy", href: "/cookies" },
];
