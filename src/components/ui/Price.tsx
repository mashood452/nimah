import { siteConfig } from "@/lib/site";
import { Dirham } from "./Dirham";
import styles from "./Price.module.css";

const formats = new Map<number, Intl.NumberFormat>();
function numberFormat(decimals: number) {
  let f = formats.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    formats.set(decimals, f);
  }
  return f;
}

/**
 * A price shown with the Dirham symbol in the brand colour, for example "<symbol> 690".
 * Screen readers and search engines still read "AED 690", through visually hidden text.
 * For plain text (emails, WhatsApp messages) use formatPrice() from lib/format instead.
 */
export function Price({ amount, decimals = 0, className = "" }: { amount: number; decimals?: number; className?: string }) {
  return (
    <span className={`${styles.price} ${className}`}>
      <span className={styles.sr}>{siteConfig.currency} </span>
      <Dirham className={styles.symbol} />
      <span className={styles.amount}>{numberFormat(decimals).format(amount)}</span>
    </span>
  );
}
