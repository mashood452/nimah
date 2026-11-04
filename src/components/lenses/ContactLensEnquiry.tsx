"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import pageStyles from "../page/Page.module.css";
import styles from "./ContactLensEnquiry.module.css";
import { Recaptcha, useRecaptcha } from "../account/Recaptcha";
import { IconArrow } from "../navbar/icons";
import { IconWhatsapp } from "../footer/social-icons";
import { ACCEPTED_FILES, MAX_FILE_BYTES, MAX_FILES } from "@/lib/contact-lens-enquiry";
import { DEFAULT_PHONE_COUNTRY, internationalPhone, phoneCountries } from "@/lib/phone-countries";

const MB = MAX_FILE_BYTES / 1024 / 1024;
const ACCEPTED = /\.(jpe?g|png|webp|heic|heif|pdf)$/i;

/** "Ask about contact lenses" button that opens a pop-up form: name, phone and up to three prescription files. */
export function ContactLensEnquiry({ whatsappHref }: { whatsappHref?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button type="button" className={pageStyles.btnPrimary} onClick={() => setOpen(true)} aria-haspopup="dialog">
        Ask about contact lenses <IconArrow />
      </button>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="cle-title"
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        {/* The form (and the reCAPTCHA script it needs) only loads once the pop-up is opened. */}
        {open && <EnquiryForm whatsappHref={whatsappHref} onClose={() => setOpen(false)} />}
      </dialog>
    </>
  );
}

type Errors = Partial<Record<"name" | "phone" | "files", string>>;

function EnquiryForm({ whatsappHref, onClose }: { whatsappHref?: string; onClose: () => void }) {
  const { ready, executeCaptcha } = useRecaptcha();
  const [files, setFiles] = useState<File[]>([]);
  const [tooMany, setTooMany] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const bad = picked.find((f) => !ACCEPTED.test(f.name));
    const big = picked.find((f) => f.size > MAX_FILE_BYTES);
    const usable = picked.filter((f) => ACCEPTED.test(f.name) && f.size <= MAX_FILE_BYTES);
    const next = [...files, ...usable];
    setTooMany(next.length > MAX_FILES);
    setFiles(next.slice(0, MAX_FILES));
    setErrors((prev) => ({
      ...prev,
      files: bad ? `${bad.name} is not a photo or PDF.` : big ? `${big.name} is larger than ${MB} MB.` : undefined,
    }));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setTooMany(false);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const country = String(data.get("country") ?? DEFAULT_PHONE_COUNTRY);
    const phone = String(data.get("phone") ?? "");
    const next: Errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!internationalPhone(country, phone)) next.phone = "Please enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length || pending) return;
    if (!ready) { setStatus("The security check is still loading. Please wait a moment, or refresh the page, then try again."); return; }

    setPending(true);
    setStatus("");
    try {
      const body = new FormData();
      body.set("name", name);
      body.set("country", country);
      body.set("phone", phone);
      files.forEach((f) => body.append("files", f, f.name));
      body.set("captchaToken", await executeCaptcha("contact_lens"));
      const response = await fetch("/api/forms/contact-lenses", { method: "POST", body });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) { setStatus(result.message ?? "We could not send your request. Please try again."); return; }
      setSent(true);
    } catch {
      setStatus("We could not send your request. Please check your connection and try again.");
    } finally { setPending(false); }
  };

  const whatsapp = whatsappHref && (
    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.waLink}>
      <IconWhatsapp width={16} height={16} /> Send on WhatsApp
    </a>
  );

  return (
    <div className={styles.panel}>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>

      {sent ? (
        <div className={styles.done} role="status">
          <p className={pageStyles.eyebrow}>Request sent</p>
          <h2 id="cle-title" className={styles.title}>Thank you, we will be in touch</h2>
          <p className={styles.intro}>Our team will review your details and call or message you shortly about contact lenses.</p>
          <button type="button" className={pageStyles.btnPrimary} onClick={onClose}>Close</button>
        </div>
      ) : (
        <>
          <p className={pageStyles.eyebrow}>Contact lenses</p>
          <h2 id="cle-title" className={styles.title}>Ask about contact lenses</h2>
          <p className={styles.intro}>Leave your details and, if you have one, your prescription. Our team will get back to you.</p>

          <form className={pageStyles.form} onSubmit={onSubmit} noValidate>
            <div className={pageStyles.field}>
              <label htmlFor="cle-name">Your name</label>
              <input id="cle-name" name="name" autoComplete="name" maxLength={80} autoFocus onInput={() => errors.name && setErrors((p) => ({ ...p, name: undefined }))}
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "cle-name-err" : undefined} />
              {errors.name && <span id="cle-name-err" className={pageStyles.fieldError}>{errors.name}</span>}
            </div>

            <div className={pageStyles.field}>
              <label htmlFor="cle-phone">Phone number</label>
              <div className={styles.phone}>
                <select name="country" defaultValue={DEFAULT_PHONE_COUNTRY} aria-label="Country code" autoComplete="tel-country-code">
                  {phoneCountries.map((c) => (
                    <option key={c.iso} value={c.iso}>{c.iso} +{c.dial}</option>
                  ))}
                </select>
                <input id="cle-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="50 123 4567" maxLength={20} onInput={() => errors.phone && setErrors((p) => ({ ...p, phone: undefined }))}
                  aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "cle-phone-err" : undefined} />
              </div>
              {errors.phone && <span id="cle-phone-err" className={pageStyles.fieldError}>{errors.phone}</span>}
            </div>

            <div className={pageStyles.field}>
              <label htmlFor="cle-files">Prescription (optional)</label>
              <input ref={fileInput} id="cle-files" type="file" multiple accept={ACCEPTED_FILES} onChange={addFiles} className={styles.fileInput}
                aria-describedby="cle-files-hint" />
              <button type="button" className={styles.upload} onClick={() => fileInput.current?.click()} disabled={files.length >= MAX_FILES}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4m0 0-5 5m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
                {files.length ? "Add another file" : "Upload prescription"}
              </button>
              <span id="cle-files-hint" className={styles.hint}>Up to {MAX_FILES} files. Photos (JPG, PNG, HEIC) or PDF, {MB} MB each.</span>

              {files.length > 0 && (
                <ul className={styles.files}>
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`}>
                      <span>{f.name}</span>
                      <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}

              {tooMany && (
                <div className={styles.alert} role="alert">
                  <p>You can upload up to {MAX_FILES} files here. Please send any other prescriptions to us on WhatsApp.</p>
                  {whatsapp}
                </div>
              )}
              {errors.files && <span className={pageStyles.fieldError} role="alert">{errors.files}</span>}
            </div>

            <p className={pageStyles.formNote}>
              We only use your details to help with your request. See our <a href="/privacy">Privacy policy</a>.
            </p>

            <div>
              <Recaptcha />
              <button type="submit" className={`${pageStyles.btnPrimary} ${styles.submit}`} disabled={pending}>
                {pending ? "Sending…" : "Send request"}
              </button>
            </div>

            <p className={pageStyles.formStatus} role="status" hidden={!status}>{status}</p>
          </form>
        </>
      )}
    </div>
  );
}
