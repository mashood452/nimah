import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const IconInstagram = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const IconFacebook = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M13.5 21v-8h2.7l.5-3.2h-3.2V7.9c0-.9.4-1.6 1.7-1.6h1.6V3.4c-.3 0-1.3-.2-2.3-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.6V13h2.7v8h3.2Z" />
  </svg>
);

export const IconTiktok = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M16.6 3h-2.9v12.1a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.5 5.5 0 1 0 4.7 5.5V9.5a6.9 6.9 0 0 0 4 1.3V7.9a4 4 0 0 1-4-4Z" />
  </svg>
);

export const IconWhatsapp = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3.6 20.4l1.2-4.3A8.4 8.4 0 1 1 8 19.2l-4.4 1.2Z" />
    <path d="M9.2 8.9c.2 2.4 2.4 4.7 5.3 5.5l1.2-1.2-1.7-.9-.9.6c-.8-.4-1.6-1.2-2-2.1l.6-.9-.9-1.7-1.6.7Z" fill="currentColor" stroke="none" />
  </svg>
);
