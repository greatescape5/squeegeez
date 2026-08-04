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

## Pick up on another machine
```
git clone https://github.com/greatescape5/squeegeez.git
cd squeegeez
npm install
npm run dev          # runs with placeholder data if there's no .env.local
```
`npm run build` now succeeds even without Supabase keys (handy for CI), so you can
verify a build anywhere. For real data locally, add `.env.local` as above.

## SEO
Search-engine essentials are built into the app (no plugin needed):
- **`app/sitemap.ts`** → `/sitemap.xml` (auto-includes every service page)
- **`app/robots.ts`** → `/robots.txt` (disallows `/admin`)
- **`lib/seo.ts`** — one place for the domain + business details; builds the
  `LocalBusiness` / `WebSite` / `Service` / `BreadcrumbList` JSON-LD schema
- Per-page canonicals, titles, meta descriptions, and OpenGraph/Twitter tags

Optional env vars (add in Vercel, then redeploy):
```
NEXT_PUBLIC_SITE_URL                    = https://squeegeez.ca   # if the domain changes
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION    = <code from Google Search Console>
NEXT_PUBLIC_BING_SITE_VERIFICATION      = <code from Bing Webmaster Tools>
```

**Docs & next steps:**
- `docs/seo-status.md` — full SEO checklist: what's done vs. what needs an account login
- `docs/seo-keyword-research.md` — competitors, keyword map, search intent, FAQ questions

Top manual to-dos: set up **Google Business Profile**, verify **GSC + Bing** and submit
the sitemap, and pick **one canonical domain** in Vercel (301 the other variant).
