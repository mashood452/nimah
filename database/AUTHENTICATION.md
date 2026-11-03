# Customer accounts

Run `npm run db:migrate` before deploying the account feature. Migration `003_customer_auth.sql` adds account consent/login dates, `account_sessions` and `auth_rate_limits`. No customer or administrator passwords are seeded. The existing Hostinger database has this migration applied.

## Pages and endpoints

| Path | Behavior |
|---|---|
| `/account/signup` | CAPTCHA, email OTP verification, then name, password, confirmation and terms/privacy agreement |
| `/account/login` | Email/password login and optional persistent login |
| `/account` | Protected personal details and the current customer's ten most recent orders |
| `POST /api/auth/signup` | Validates and creates a customer, then starts a session |
| `POST /api/auth/login` | Verifies credentials and starts a new random session |
| `POST /api/auth/logout` | Deletes the current database session and expires its cookie |
| `POST /api/auth/otp/request` | Checks CAPTCHA, throttles requests and emails a six-digit code |
| `POST /api/auth/otp/verify` | Checks CAPTCHA and code, then sets a short-lived HttpOnly email proof |

The forms provide password visibility controls, autocomplete hints, field errors and pending states. The navigation reflects whether the current request is authenticated. Verified customers' bags are synchronized to MySQL; guest bags and wishlists stay in the browser. Checkout is not implemented.

## Authentication behavior

Passwords use Node.js scrypt with a random 16-byte salt, a 64-byte derived key, `N=65536`, `r=8`, `p=2`. This is one of [OWASP's recommended scrypt configurations](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Native password work is limited to two concurrent calculations per worker. Passwords must contain 15–128 Unicode characters; spaces are preserved and no arbitrary character-class rules are imposed.

Sessions use random 32-byte opaque tokens. Only SHA-256 token hashes are stored in MySQL. Production cookies use the `__Host-` prefix, Secure, HttpOnly, SameSite=Lax and Path=/, without a Domain attribute. Production must use HTTPS. A normal login uses a browser-session cookie with a seven-day absolute server expiry; selecting persistent login gives a 30-day cookie and server expiry. Logout revokes the current session immediately, and disabled accounts cannot use existing sessions.

Identity reads are deduplicated with React's request-local cache only. They never use Next.js's shared `use cache`. Orders are always selected by the authenticated account ID. Account pages are excluded from search indexing and are served without shared caching. Product/blog query caching remains separate.

All authentication writes require POST, a same-origin Origin header and an application/json body limited to 8 KB. The origin check supports the configured public site origin and the actual request Host/protocol behind the reverse proxy. Cross-site fetches are rejected. The trusted hosting proxy must replace client-supplied `X-Real-IP` / `X-Forwarded-For` headers; the address-based limiter supplements the email-based limiter rather than replacing it.

Login limits are five attempts per normalized email per 15 minutes and 30 per address per 15 minutes. Signup limits are five attempts per email and ten per address per hour. Counters live in MySQL so they work across processes. A successful login resets the email's failed-attempt counter. Missing users and incorrect passwords receive the same credential error and both perform a scrypt calculation. Expired sessions and old rate-limit buckets are pruned during account activity.

Terms acceptance is recorded with the current version on signup. New accounts require verified mailbox ownership and Google reCAPTCHA v2 Checkbox. Existing unverified customers must verify their email and then enter their password. Password-reset emails are not implemented. See [email automation](EMAIL_AUTOMATION.md) for configuration and delivery behavior.

## Verification

```sh
npm run test:auth
npm run test:db
npm run test:email
npm run build
```

For end-to-end checks, start a local production server on port 3100 with the same `.env.local` and the test-only SMTP/CAPTCHA sandbox. In PowerShell:

```powershell
$env:NIMAH_LOCAL_EMAIL_TEST='1'
$env:NIMAH_EMAIL_CAPTURE="$PWD/.next/test-email/messages.jsonl"
New-Item -ItemType Directory -Force .next/test-email
$sandboxUrl = [System.Uri]::new("$PWD/tests/support/email-sandbox.mjs").AbsoluteUri
$env:NODE_OPTIONS="--import=$sandboxUrl"
$env:CART_REMINDER_WORKER='false'
npm run start -- --hostname 127.0.0.1 --port 3100
# In a second terminal, set the same NIMAH_EMAIL_CAPTURE path, then:
npm run test:auth:integration
```

The integration test accepts only a loopback server URL. It creates uniquely named temporary QA accounts and orders, verifies cookie flags, signup/login/logout, duplicate signup, consent validation, account isolation, expiration, cross-site protection and login throttling, then deletes only its generated records. It never prints passwords or session tokens.

The test sandbox is restricted to a local test process and blocks real email recipients. Never set its NODE_OPTIONS or NIMAH_LOCAL_EMAIL_TEST in production. Keep Hostinger's `DB_HOST=127.0.0.1` override and the existing database URL. Builds still succeed without database access; authentication reads and writes occur at request time.
