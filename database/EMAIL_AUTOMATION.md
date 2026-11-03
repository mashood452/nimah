# Verification and bag reminder emails

Migration `004_email_verification_and_carts.sql` adds expiring email challenges, per-customer carts and a durable delivery ledger. Apply with `npm run db:migrate`. No passwords, OTPs or test recipients are seeded.

Copy these values from the private `.env.local` into Hostinger's deployment environment before rebuilding: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `SMTP_URL`, `EMAIL_FROM`, `EMAIL_SECURITY_SECRET`, `CRON_SECRET`, `CART_REMINDERS_ENABLED`, `CART_REMINDER_DELAY_MINUTES`. The public CAPTCHA key is compiled into client code, so changing it requires a rebuild. Use a matching **v3 (score-based)** site/secret key pair registered for nimahopticals.com. No new environment variable is needed when migrating from the previous checkbox implementation. Never expose the other keys through NEXT_PUBLIC variables.

The sender is `Nimah Opticals <no-reply@nimahopticals.com>`. Keep accounts@ reserved. SMTP requires authenticated TLS and a provider-approved sender/domain. SMTP_URL must percent-encode special characters in its username and password. Alternatively configure SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD. Emails include the actual `public/brand/nimah-logo.png` as an inline CID attachment; product photos use existing R2 URLs.

## Registration

Every public HTML form uses reCAPTCHA v3 and validates it on the server before its action. One shared script loads the v3 API; each submission and OTP resend calls execute at submission time to avoid expired or reused tokens. Actions are login, signup, otp_request, otp_verify, search, contact and unsubscribe. The backend requires the exact expected action, a numeric score between 0.5 and 1, a trusted hostname and a token timestamp within two minutes. Missing scores, legacy v2 responses, mismatched actions and unavailable services fail closed. Google’s badge remains visible, and forms include its privacy and terms links. See [Google's v3 integration guide](https://developers.google.com/recaptcha/docs/v3).

Signup verifies email before accepting account details. Codes are cryptographically random six-digit strings, expire after ten minutes, allow five guesses, and are stored only as keyed digests. Requests have a sixty-second resend cooldown, five/email/hour and twenty/address/hour limits; checks have thirty/address/fifteen-minute limits. Successful verification produces an HttpOnly, Secure, SameSite=Strict proof cookie, valid for ten minutes and consumed atomically when the account is created. No production bypass is provided for unavailable CAPTCHA or SMTP.

The hosting proxy must replace incoming client IP headers for address-based limits to be trustworthy. Email limits and per-challenge attempt limits also apply. Missing configuration fails closed.

## Reminder delivery

Customers explicitly opt in during signup or in account email preferences. Authenticated bags are stored by account, with optimistic revisions; guest bags remain local until login. Prices and images supplied by the browser are ignored. Visible active bags send an activity heartbeat. After sixty minutes of inactivity, the job reads current database prices, selected colors, stock, names and R2 thumbnails before sending. Empty bags, inactive products/accounts, recent orders and unsubscribed customers are excluded. Bags older than seven days are excluded. Maximum one reminder per cart revision and one/customer/day.

On persistent Node hosting, the first actual page request starts an unreferenced sixty-second worker timer. MySQL advisory locking coordinates workers, and committed delivery claims suppress duplicates. Set `CART_REMINDER_WORKER=false` on serverless hosting. A hosting cron every five minutes running `npm run reminders:run` is also recommended to cover worker restarts and idle processes. Run it from the deployed project directory with the same environment and Node version. The script makes an HTTPS POST to `/api/internal/cart-reminders` using `CRON_SECRET` as a Bearer header. No secret belongs in a URL. The endpoint also supports a trusted external scheduler that can supply this header.

An ambiguous SMTP failure is recorded as `uncertain` and is not automatically retried, to avoid duplicate messages. The ledger records metadata, not message bodies or OTPs. SMTP acceptance cannot prove inbox delivery. Review provider delivery/bounce logs when diagnosing email.

Reminder emails include a signed opt-out link with CAPTCHA on the browser confirmation form. Mail-provider RFC 8058 one-click unsubscribe is a separate machine endpoint authenticated by the signed, opt-out-only token; it requires no login or CAPTCHA. Merely opening a GET link does not change consent. Rotate EMAIL_SECURITY_SECRET only when prepared to invalidate outstanding email proofs/digests and unsubscribe signatures.
