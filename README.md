# Squeegeez Window & Exterior Care — website

Next.js 14 (App Router) + Supabase (DB + Storage + Auth) + Resend (email) + GA4, deployed on Vercel.
Domain: **squeegeez.ca** (GoDaddy DNS → Vercel).

## Pages
- `/` — **Home**: ~75vh hero, services grid, "Our work in action" before/after slider,
  "Why choose Squeegeez", safety + WorkSafeBC section, service areas, closing CTA.
  (Reviews and the project-highlights gallery are built but hidden — see `SHOW_REVIEWS` /
  `SHOW_PROJECTS` in `app/page.tsx`.)
- `/services` — grid of **service folders** (from the DB) + "Everything we do" list; each folder
  links to `/services/[slug]` showing that service's photos. (`/projects` 301-redirects here.)
- `/about` — **About Squeegeez**: two-column story (team photo + People / Mission / Local), a
  certifications strip (WorkSafeBC · WHMIS · First-Aid), and a CTA.
- `/contact` — hero with a **Call us** button, then **Get in touch**: contact-info card
  (call/text, email, location, social links) beside the lead form. "Get an estimate" buttons
  deep-link to `/contact#get-in-touch` and auto-scroll to the form.
- `/admin` — hidden login (the faint “.” in the footer links here).
- `/admin/dashboard` — management area (see below).

## Admin (`/admin`)
Log in with a Supabase Auth user (create one in Supabase → Authentication → Users). The dashboard
is organized into **tabs**:
- **Service Folders** — add / edit / hide / delete, and add photos to each folder.
- **Before & After** — add / edit (replace images + caption) / hide / delete the home-page sliders.
- **Manage Projects** — add a project photo; hide / delete existing ones.
- **Leads** — every contact-form submission (name, email, phone, address, service, message).

## Database (Supabase)
Run these SQL files in **SQL Editor** (in order) for a fresh project:
1. `supabase-schema.sql` — `projects` + `leads` tables, RLS, `gallery` storage bucket
2. `supabase-folders-migration.sql` — `folders` table + `projects.folder_id`
3. `supabase-comparisons-migration.sql` — `comparisons` (before/after) table
4. `supabase-add-lead-address.sql` — adds `leads.address`

> A single consolidated schema (all four in one file) lives at `../site-template/supabase-schema.sql`
> for cloning into a brand-new site.

After running, Settings → API → copy the **Project URL** + **anon public key**.

## Images (in `public/` unless noted)
- `public/logo-b11.png` — header/nav logo.
- `public/logo.jpg` — OG/Twitter share image (referenced in `app/layout.tsx` + `lib/seo.ts`).
- `app/icon.png` — favicon. Browsers cache it hard — hard-refresh (Ctrl+F5).
- `public/about-team.png` — team photo on the About page.
- `public/whmis.svg` + `public/first-aid.jpg` — certification logos on the About strip.

## Vercel (hosting)
1. Import the GitHub repo.
2. **Framework Preset must be `Next.js`** (if it says “Other”, every route 404s though the build passes).
3. Environment Variables, then **Redeploy** (they don’t apply until you redeploy):
   ```
   NEXT_PUBLIC_SUPABASE_URL       = your project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = your anon public key
   ```
4. Email (Resend) vars — can be added later:
   ```
   RESEND_API_KEY   = your Resend API key
   LEAD_TO_EMAIL    = where leads are received (e.g. tyler@greatescapewebservices.com)
   LEAD_FROM_EMAIL  = a sender on the verified domain (currently noreply@squeegeez.ca)
   LEAD_REPLY_TO    = inbox for customer replies (optional; defaults to contact@squeegeez.ca in code)
   ```
5. Domain (Settings → Domains). At GoDaddy set only: apex `A @ → 76.76.21.21` and
   `www CNAME → cname.vercel-dns.com`. Leave email DNS (MX/SPF/DKIM/autodiscover) untouched.

## Analytics
GA4 id `G-J9DM83X36E` is hardcoded in `components/Analytics.tsx` (with route tracking). Nothing else to do.

## Resend (form emails)
Domain verified in Resend. `/api/lead` saves the lead first (best-effort email), then sends **two**
emails: a notification to `LEAD_TO_EMAIL` (Reply-To = the customer) and a confirmation to the customer
(Reply-To = `LEAD_REPLY_TO`). Failures / missing vars are logged to Vercel runtime logs. The form still
saves the lead even if email isn't configured.

## Where content lives (to edit copy in code)
- `app/page.tsx` — home hero, `SERVICES`, `WHY`, `SAFETY`, `AREAS`, `REVIEWS`, `SHOW_REVIEWS` /
  `SHOW_PROJECTS`, `PHONE` / `PHONE_HREF`.
- `app/about/page.tsx` — About story text + certifications strip.
- `app/services/page.tsx` — `SERVICE_NAMES`, headings, phone.
- `app/contact/page.tsx` — hero copy, contact info (`PHONE` / `EMAIL`).
- `components/SocialLinks.tsx` — Facebook / Instagram / TikTok URLs (one place, used by footer + contact).
- `components/SiteHeader.tsx` / `SiteFooter.tsx` — nav, footer, service areas, Great Escape credit.
- `lib/seo.ts` — domain + business details + JSON-LD schema.
- `components/Analytics.tsx` — GA4 id.
- Services, safety, reviews, and areas are hardcoded; the gallery/folders/before-after come from the DB (edit in admin).

## Current values / notes
- Phone: **(250) 784-8588** · Contact email: **contact@squeegeez.ca**
- Reviews and the home project-gallery are **hidden** (`SHOW_REVIEWS` / `SHOW_PROJECTS = false` in `app/page.tsx`).
- **Copy style:** visible site text uses **"&"** instead of "and". SEO meta descriptions + JSON-LD
  schema (in page metadata, `app/layout.tsx`, `lib/seo.ts`) intentionally keep prose "and".
- The **`/services` folder cards** pull their name + description from the database, so any "and"
  there is edited in **admin → Service Folders**, not in code. (Also rename the "Pressure Washing"
  folder to "Track & screen cleaning" there so the gallery matches the rest of the site.)

## Local development
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
`npm run build` succeeds even without Supabase keys (handy for CI), so you can verify a build
anywhere. For real data locally, add `.env.local` as above.

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

Top manual to-dos: set up **Google Business Profile**, verify **GSC + Bing** and submit the sitemap,
and pick **one canonical domain** in Vercel (301 the other variant).
