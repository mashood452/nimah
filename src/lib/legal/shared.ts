import { siteConfig } from "../site";

const { legal, contact, policies } = siteConfig;

export const company = legal.companyName;
export const jurisdiction = legal.jurisdiction;
export const lastUpdated = legal.lastUpdated;
export const returnDays = policies.returnWindowDays;
export const refundDays = policies.refundBusinessDays;
export const deliversTo = policies.deliversTo;

/** How a visitor reaches us, written to read naturally inside a sentence. */
export const reach = contact.email
  ? `email us at [${contact.email}](mailto:${contact.email})`
  : "contact us through the form on our [Contact page](/contact)";

/** Optional line with the registered address, only when one is configured. */
export const addressLine = contact.address ? ` Our address is ${contact.address}.` : "";

export const siteHost = new URL(siteConfig.url).host;
