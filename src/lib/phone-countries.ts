/**
 * Country dialling codes offered on phone fields. The UAE comes first and is the default; the rest are the
 * countries most of our customers call from. Shared by the browser form and the server check.
 */
export const phoneCountries = [
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "OM", name: "Oman", dial: "968" },
  { iso: "QA", name: "Qatar", dial: "974" },
  { iso: "KW", name: "Kuwait", dial: "965" },
  { iso: "BH", name: "Bahrain", dial: "973" },
  { iso: "IN", name: "India", dial: "91" },
  { iso: "PK", name: "Pakistan", dial: "92" },
  { iso: "BD", name: "Bangladesh", dial: "880" },
  { iso: "LK", name: "Sri Lanka", dial: "94" },
  { iso: "NP", name: "Nepal", dial: "977" },
  { iso: "PH", name: "Philippines", dial: "63" },
  { iso: "EG", name: "Egypt", dial: "20" },
  { iso: "JO", name: "Jordan", dial: "962" },
  { iso: "LB", name: "Lebanon", dial: "961" },
  { iso: "SY", name: "Syria", dial: "963" },
  { iso: "IQ", name: "Iraq", dial: "964" },
  { iso: "IR", name: "Iran", dial: "98" },
  { iso: "TR", name: "Turkey", dial: "90" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "US", name: "United States / Canada", dial: "1" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "IT", name: "Italy", dial: "39" },
  { iso: "RU", name: "Russia", dial: "7" },
  { iso: "CN", name: "China", dial: "86" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "ZA", name: "South Africa", dial: "27" },
  { iso: "NG", name: "Nigeria", dial: "234" },
  { iso: "KE", name: "Kenya", dial: "254" },
] as const;

export type PhoneCountry = (typeof phoneCountries)[number];
export const DEFAULT_PHONE_COUNTRY = "AE";

/**
 * Turns a country and a locally typed number ("050 123 4567", "50-123-4567") into an international
 * number such as "+971501234567". Returns null when the number does not look like a phone number.
 */
export function internationalPhone(iso: string, local: string): string | null {
  const country = phoneCountries.find((c) => c.iso === iso);
  if (!country || typeof local !== "string" || local.length > 40) return null;
  if (/[^\d\s().+-]/.test(local)) return null;
  let digits = local.replace(/\D/g, "");
  // People often type the country code again, or the leading trunk 0 used for local calls.
  if (local.trim().startsWith("+") || local.trim().startsWith("00")) {
    digits = digits.replace(/^00/, "");
    if (!digits.startsWith(country.dial)) return null;
    digits = digits.slice(country.dial.length);
  }
  digits = digits.replace(/^0+/, "");
  const total = country.dial.length + digits.length;
  if (digits.length < 6 || total > 15) return null;
  return `+${country.dial}${digits}`;
}
