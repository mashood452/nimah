import { AuthHttpError, authFailure, authJson, sameOriginRequest } from "@/lib/auth/http";
import { verifyCaptcha } from "@/lib/auth/captcha";
import { consumeLimit, requestAddress } from "@/lib/auth/rate-limit";
import { sendEmail, type EmailAttachment } from "@/lib/email/smtp";
import { contactLensEnquiryEmail } from "@/lib/email/templates";
import { internationalPhone, phoneCountries } from "@/lib/phone-countries";
import { siteConfig } from "@/lib/site";
import { MAX_FILE_BYTES, MAX_FILES, type EnquiryTopic } from "@/lib/contact-lens-enquiry";

// Three 5 MB files plus the text fields and multipart overhead.
const MAX_BODY_BYTES = MAX_FILES * MAX_FILE_BYTES + 256 * 1024;

/** Works out the real file type from its first bytes, so a renamed file cannot pass as a prescription. */
function detectType(bytes: Buffer): { ext: string; mime: string } | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", mime: "image/png" };
  if (bytes.subarray(0, 5).toString("latin1") === "%PDF-") return { ext: "pdf", mime: "application/pdf" };
  if (bytes.subarray(0, 4).toString("latin1") === "RIFF" && bytes.subarray(8, 12).toString("latin1") === "WEBP") return { ext: "webp", mime: "image/webp" };
  if (bytes.subarray(4, 8).toString("latin1") === "ftyp" && /^(heic|heix|hevc|heim|heis|mif1|msf1)$/.test(bytes.subarray(8, 12).toString("latin1"))) return { ext: "heic", mime: "image/heic" };
  return null;
}

function safeFileName(original: string, index: number, ext: string) {
  const stem = original.replace(/\.[^.]*$/, "").normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return `${stem || `prescription-${index + 1}`}.${ext}`;
}

export async function POST(request: Request) {
  try {
    if (!sameOriginRequest(request)) throw new AuthHttpError(403, "Please refresh this page and try again.");
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "multipart/form-data") throw new AuthHttpError(415, "Please use the form to send your request.");
    const length = Number(request.headers.get("content-length"));
    if (!Number.isFinite(length) || length <= 0) throw new AuthHttpError(411, "Please use the form to send your request.");
    if (length > MAX_BODY_BYTES) throw new AuthHttpError(413, `Each file must be ${MAX_FILE_BYTES / 1024 / 1024} MB or smaller, with up to ${MAX_FILES} files.`);

    const retry = await consumeLimit(`contact-lens:${requestAddress(request)}`, 5, 3600);
    if (retry) return authJson({ message: "You have sent several requests. Please wait a while, or message us on WhatsApp." }, 429);

    let form: FormData;
    try { form = await request.formData(); } catch { throw new AuthHttpError(400, "Please complete the form and try again."); }
    await verifyCaptcha(form.get("captchaToken"), "contact_lens");

    const name = String(form.get("name") ?? "").replace(/\s+/g, " ").trim();
    if (name.length < 2 || name.length > 80 || /[<>]/.test(name)) throw new AuthHttpError(422, "Please enter your name.");
    const iso = String(form.get("country") ?? "");
    const country = phoneCountries.find((c) => c.iso === iso);
    const phone = country ? internationalPhone(iso, String(form.get("phone") ?? "")) : null;
    if (!country || !phone) throw new AuthHttpError(422, "Please enter a valid phone number.");

    // coloured lenses are fashion lenses with no prescription, so any file sent with that topic is ignored
    const topic: EnquiryTopic = form.get("topic") === "coloured" ? "coloured" : "contact";
    const uploads = topic === "coloured" ? [] : form.getAll("files").filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f && f.size > 0);
    if (uploads.length > MAX_FILES) throw new AuthHttpError(422, `You can upload up to ${MAX_FILES} files. Please send any others on WhatsApp.`);
    const attachments: EmailAttachment[] = [];
    for (const [i, file] of uploads.entries()) {
      if (file.size > MAX_FILE_BYTES) throw new AuthHttpError(422, `${file.name.slice(0, 60)} is larger than ${MAX_FILE_BYTES / 1024 / 1024} MB.`);
      const content = Buffer.from(await file.arrayBuffer());
      const type = detectType(content);
      if (!type) throw new AuthHttpError(422, `${file.name.slice(0, 60)} is not a JPG, PNG, HEIC, WEBP or PDF file.`);
      attachments.push({ filename: safeFileName(file.name, i, type.ext), content, contentType: type.mime });
    }

    const team = siteConfig.contact.email;
    if (!team) throw new AuthHttpError(503, "Online requests are being set up. Please message us on WhatsApp.");
    try {
      await sendEmail({ to: team, ...contactLensEnquiryEmail({ name, phone, country: country.name, files: attachments.map((a) => a.filename), topic }), attachments });
    } catch {
      console.error("Contact lens enquiry email could not be sent. Check SMTP_URL and EMAIL_FROM.");
      throw new AuthHttpError(503, "We could not send your request just now. Please try again, or message us on WhatsApp.");
    }
    return authJson({ sent: true });
  } catch (error) { return authFailure(error); }
}
