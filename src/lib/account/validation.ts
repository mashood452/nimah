// Validation for profile details and delivery addresses. Pure functions with no server-only imports, so the same
// rules run in the browser (for instant hints) and on the server (which is the one that decides).

export const EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"] as const;
export const MAX_ADDRESSES = 10;

const CONTROL = /[\u0000-\u001f\u007f]/;
const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max + 1) : "";

/**
 * Turns the many ways people type a phone number into one stored form, "+971502128613".
 * Accepts UAE numbers written locally (0502128613, 502128613), with the country code (971502128613, 00971...) or with
 * a plus sign, plus other international numbers that start with a plus sign. Returns "" when it is not a phone number.
 */
export function normalizePhone(value: unknown): string {
  if (typeof value !== "string") return "";
  let digits = value.trim().replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(digits)) return "";
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (digits.startsWith("+")) return /^\+[1-9]\d{7,14}$/.test(digits) ? digits : "";
  if (/^971\d{8,9}$/.test(digits)) return `+${digits}`;
  if (/^0(5\d{8}|[2-4679]\d{7})$/.test(digits)) return `+971${digits.slice(1)}`;
  if (/^5\d{8}$/.test(digits)) return `+971${digits}`;
  return "";
}

/** "+971502128613" -> "+971 50 212 8613". Other numbers are returned as stored. */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const m = phone.match(/^\+971(5\d)(\d{3})(\d{4})$/);
  return m ? `+971 ${m[1]} ${m[2]} ${m[3]}` : phone;
}

export type ProfileErrors = Partial<Record<"name" | "phone", string>>;

export function validateProfile(input: Record<string, unknown>) {
  const errors: ProfileErrors = {};
  const name = clean(input.name, 160);
  const rawPhone = typeof input.phone === "string" ? input.phone.trim() : "";
  const phone = rawPhone ? normalizePhone(rawPhone) : "";
  if (name.length < 2 || name.length > 160 || CONTROL.test(name)) errors.name = "Enter your name using 2 to 160 characters.";
  if (rawPhone && !phone) errors.phone = "Enter a valid phone number, for example 050 123 4567 or +971 50 123 4567.";
  return { name, phone, errors, valid: Object.keys(errors).length === 0 };
}

export type AddressInput = {
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  isDefault: boolean;
};
export type AddressErrors = Partial<Record<keyof AddressInput, string>>;

export function validateAddress(input: Record<string, unknown>) {
  const errors: AddressErrors = {};
  const value: AddressInput = {
    label: clean(input.label, 80),
    recipient: clean(input.recipient, 160),
    phone: normalizePhone(input.phone),
    line1: clean(input.line1, 255),
    line2: clean(input.line2, 255),
    city: clean(input.city, 120),
    region: clean(input.region, 120),
    isDefault: input.isDefault === true,
  };
  const bad = (text: string, min: number, max: number) => text.length < min || text.length > max || CONTROL.test(text);
  if (value.label.length > 80 || CONTROL.test(value.label)) errors.label = "Keep the label to 80 characters or fewer.";
  if (bad(value.recipient, 2, 160)) errors.recipient = "Enter the name of the person receiving the order.";
  if (!value.phone) errors.phone = "Enter a phone number the courier can call, for example 050 123 4567.";
  if (bad(value.line1, 3, 255)) errors.line1 = "Enter the building, street and apartment or villa number.";
  if (value.line2.length > 255 || CONTROL.test(value.line2)) errors.line2 = "Keep this to 255 characters or fewer.";
  if (bad(value.city, 2, 120)) errors.city = "Enter your area or city, for example Jumeirah.";
  if (!(EMIRATES as readonly string[]).includes(value.region)) errors.region = "Choose an emirate.";
  return { value, errors, valid: Object.keys(errors).length === 0 };
}

export type AddressRecord = AddressInput & { id: string };

/** One line for lists and emails, for example "Villa 12, Street 4, Jumeirah, Dubai". */
export function addressLine(a: Pick<AddressInput, "line1" | "line2" | "city" | "region">): string {
  return [a.line1, a.line2, a.city, a.region].filter(Boolean).join(", ");
}
