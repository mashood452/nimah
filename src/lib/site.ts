export const siteConfig = {
  name: "Nimah Opticals",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nimahopticals.com",
  description: "Shop luxury sunglasses, blue-cut glasses, eyeglasses and contact lenses at Nimah Opticals. UV400 protection, premium frames and lenses made for every light.",
  locale: "en_US",
  ogImage: "/og-image.jpg",
  /** ISO 4217 code used to format every price on the site */
  currency: "AED",

  /** Shown in the footer and on the Contact page. Leave a value empty and it is simply not rendered. */
  contact: {
    email: "",
    phone: "",
    address: "",
    hours: "",
  },
  /** Full profile URLs, for example "https://www.instagram.com/yourhandle". Empty ones are hidden. */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp: "",
  },

  /**
   * Facts that the legal pages (privacy, terms, cookies, shipping, returns) read.
   * Review every value with the business owner, and have a lawyer review the policy text before launch.
   */
  legal: {
    /** the registered trading name that appears in the policies */
    companyName: "Nimah Opticals",
    /** the place whose laws govern the terms of service */
    jurisdiction: "the United Arab Emirates",
    /** shown in the policies as "Last updated" */
    lastUpdated: "3 November 2026",
  },
  policies: {
    /** days a customer has to return an unworn, unused item */
    returnWindowDays: 14,
    /** how long refunds take to reach the customer once a return is approved */
    refundBusinessDays: 10,
    /** where orders ship to */
    deliversTo: "the United Arab Emirates",
  },
};
