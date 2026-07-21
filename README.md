# Squeegeez Window & Exterior Care — website

Next.js (App Router) + Supabase + Resend, deployed on Vercel.

## Pages
- `/` — Home (hero, services, project highlights, reviews, service areas, CTA)
- `/projects` — Gallery pulled from the Supabase `projects` table
- `/contact` — Lead form → saves to Supabase `leads` + emails (once Resend is set up)
- `/admin` — hidden admin login (added after launch; the faint “.” in the footer links here)

## One-time setup (in order)

### 1. Supabase (database)
1. Create a Supabase project.
2. Open **SQL Editor → New query**, paste all of `supabase-schema.sql`, click **Run**.
3. Go to **Settings → API** and copy the **Project URL** and the **anon public key**.

### 2. Add these two images (do this before deploy)
- `public/logo.png`  — the round Squeegeez logo (shows in the header).
- `app/icon.png`     — same logo (or a square crop) — this becomes the browser-tab favicon.
  Browsers cache favicons hard, so hard-refresh (Ctrl+F5) to see it after deploy.

### 3. Vercel (hosting)
1. Import the GitHub repo as a new project.
2. **Framework Preset must be `Next.js`** (if it says “Other”, every route 404s).
3. Add **Environment Variables**, then **Redeploy** (they don’t apply until you redeploy):
   ```
   NEXT_PUBLIC_SUPABASE_URL       = your project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = your anon public key
   ```
4. Later, for email (see below), also add:
   ```
   RESEND_API_KEY   = your Resend API key
   LEAD_TO_EMAIL    = tyler@greatescapewebservices.com   (or the client's inbox)
   LEAD_FROM_EMAIL  = leads@yourdomain.com               (must be a verified domain in Resend)
   ```

### 4. Google Analytics — already wired
The GA4 ID `G-J9DM83X36E` is hardcoded in `components/Analytics.tsx`. Nothing else to do.

### 5. Resend (form emails) — can be last
1. Sign up at resend.com, verify the client's domain (add the DNS records it shows).
2. Create an API key.
3. Add the three env vars above in Vercel, then redeploy.
The form **saves the lead even if email isn't set up yet** — email is best-effort.

## Things to update in the code
- **Phone number** — set to `(250) 784-8588` in `app/page.tsx` and `app/contact/page.tsx` (search `PHONE` to change it).

## Local development (optional)
```
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```
Open http://localhost:3000
