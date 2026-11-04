"use client";

import { useState, type FormEvent } from "react";
import { postJson } from "@/lib/api-client";
import { EMIRATES, validateAddress, type AddressErrors, type AddressRecord } from "@/lib/account/validation";
import account from "./Account.module.css";
import area from "./AccountArea.module.css";

const LABELS = ["Home", "Work", "Other"];

/** Add or edit a delivery address. Used on the address book and inside checkout. */
export function AddressForm({
  initial,
  defaultRecipient = "",
  defaultPhone = "",
  forceDefault = false,
  submitLabel = "Save address",
  onSaved,
  onCancel,
}: {
  initial?: AddressRecord;
  /** pre-fills a new address with the customer's name and phone */
  defaultRecipient?: string;
  defaultPhone?: string;
  /** the first address is always the default */
  forceDefault?: boolean;
  submitLabel?: string;
  onSaved: (addresses: AddressRecord[], savedId?: string) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState({
    label: initial?.label ?? "Home",
    recipient: initial?.recipient ?? defaultRecipient,
    phone: initial?.phone ?? defaultPhone,
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    city: initial?.city ?? "",
    region: initial?.region ?? "",
    isDefault: initial?.isDefault ?? forceDefault,
  });
  const [errors, setErrors] = useState<AddressErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const set = (key: keyof typeof values) => (value: string | boolean) => setValues((v) => ({ ...v, [key]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setMessage("");
    const check = validateAddress(values);
    setErrors(check.errors);
    if (!check.valid) return;
    setPending(true);
    const { ok, data } = await postJson<{ addresses?: AddressRecord[] }>("/api/account/addresses", { action: initial ? "update" : "create", id: initial?.id, ...values });
    setPending(false);
    if (!ok || !data.addresses) {
      setErrors((data.errors as AddressErrors) ?? {});
      setMessage(data.message ?? "We could not save that address. Please try again.");
      return;
    }
    // A new address is the one with the highest id, which the list returns first only when it is also the default.
    const savedId = initial?.id ?? [...data.addresses].sort((a, b) => Number(b.id) - Number(a.id))[0]?.id;
    onSaved(data.addresses, savedId);
  }

  const field = (id: keyof AddressErrors, label: string, input: React.ReactNode, hint?: string) => (
    <div className={account.field}>
      <label htmlFor={`addr-${id}`}>{label}</label>
      {input}
      {hint && !errors[id] && <span className={account.hint}>{hint}</span>}
      {errors[id] && <span id={`addr-${id}-error`} className={account.fieldError}>{errors[id]}</span>}
    </div>
  );
  const common = (id: keyof AddressErrors) => ({ id: `addr-${id}`, "aria-invalid": !!errors[id], "aria-describedby": errors[id] ? `addr-${id}-error` : undefined });

  return (
    <form className={area.addressForm} onSubmit={submit} noValidate>
      {message && <div className={account.error} role="alert">{message}</div>}

      <div className={account.field}>
        <label htmlFor="addr-label">Save as</label>
        <div className={area.chips}>
          {LABELS.map((l) => (
            <button key={l} type="button" className={area.chip} aria-pressed={values.label === l} onClick={() => set("label")(l)}>{l}</button>
          ))}
        </div>
      </div>

      <div className={area.row2}>
        {field("recipient", "Full name", <input {...common("recipient")} value={values.recipient} autoComplete="name" maxLength={160} onChange={(e) => set("recipient")(e.target.value)} />)}
        {field("phone", "Mobile number", <input {...common("phone")} type="tel" inputMode="tel" value={values.phone} autoComplete="tel" placeholder="050 123 4567" maxLength={24} onChange={(e) => set("phone")(e.target.value)} />, "The courier will call this number.")}
      </div>

      {field("line1", "Building, street and apartment or villa", <input {...common("line1")} value={values.line1} autoComplete="address-line1" maxLength={255} placeholder="Villa 12, Street 4" onChange={(e) => set("line1")(e.target.value)} />)}
      {field("line2", "Landmark or extra details (optional)", <input {...common("line2")} value={values.line2} autoComplete="address-line2" maxLength={255} placeholder="Near the mosque, gate 2" onChange={(e) => set("line2")(e.target.value)} />)}

      <div className={area.row2}>
        {field("city", "Area or city", <input {...common("city")} value={values.city} autoComplete="address-level2" maxLength={120} placeholder="Jumeirah" onChange={(e) => set("city")(e.target.value)} />)}
        {field("region", "Emirate", (
          <select {...common("region")} value={values.region} autoComplete="address-level1" onChange={(e) => set("region")(e.target.value)}>
            <option value="">Choose an emirate</option>
            {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        ))}
      </div>

      {!forceDefault && (
        <label className={account.check}>
          <input type="checkbox" checked={values.isDefault} onChange={(e) => set("isDefault")(e.target.checked)} />
          <span>Use this as my default delivery address</span>
        </label>
      )}

      <div className={area.formActions}>
        <button type="submit" className={account.primary} disabled={pending}>{pending ? "Saving..." : submitLabel}</button>
        {onCancel && <button type="button" className={area.ghostBtn} onClick={onCancel} disabled={pending}>Cancel</button>}
      </div>
    </form>
  );
}
