import { siteConfig } from "./site";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number) => money.format(amount);
