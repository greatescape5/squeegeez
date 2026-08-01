# Squeegeez — SEO Status & Setup Checklist

Status of the full SEO checklist. **Code = done in this repo.** **You = needs an account
login I can't do for you** (I've prepared everything so each is quick).

> **Stack note:** this site is **Next.js**, not WordPress, so "install a WordPress SEO
> plugin" doesn't apply — Next.js handles metadata, sitemaps, schema and canonicals
> natively (all wired up below).

---

## SEO Basics

| Item | Status | Notes |
|---|---|---|
| Set up Google Search Console | **You** | Verify with the domain. I pre-wired a meta-tag option — see *Verification* below. |
| Set up Bing Webmaster Tools | **You** | You can import the site straight from GSC once GSC is verified. |
| Set up Google Analytics | ✅ **Done** | GA4 `G-J9DM83X36E` is live in `components/Analytics.tsx` (with SPA route tracking). Confirm data is flowing in the GA Realtime report. |
| SEO plugin | **N/A** | Next.js does this in code — no plugin needed. |
| Generate + submit sitemap | ✅ Code / **You submit** | `sitemap.xml` is live and auto-includes every service page. Submit `https://squeegeez.ca/sitemap.xml` in GSC → Sitemaps, and in Bing. |
| Robots.txt | ✅ **Done** | `app/robots.ts` → serves `/robots.txt`, allows all except `/admin`, points to the sitemap. |
| Check for manual actions | **You** | GSC → Security & Manual Actions → Manual actions. Should read "No issues detected." |
| Make sure the site is indexed | **You** | GSC → URL Inspection on `https://squeegeez.ca/` → Request Indexing. Then check `site:squeegeez.ca` in Google. |

### Verification (pre-wired)
Add these in **Vercel → Settings → Environment Variables**, then redeploy — the
verification `<meta>` tags appear automatically:
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = the code from GSC's "HTML tag" method
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` = the code from Bing's "Meta tag" method

(Or verify via DNS TXT record at your registrar — also fine, and no env var needed.)

---

## Technical SEO

| Item | Status | Notes |
|---|---|---|
| HTTPS | ✅ **Done** | Vercel serves HTTPS automatically. Scanned the code — **zero `http://` links**, no mixed content. |
| Duplicate versions of the site | ⚠️ **You (1 setting)** | Pick **one** canonical host in Vercel → Domains and make the other 301-redirect to it (e.g. `www.squeegeez.ca` → `squeegeez.ca`). Canonical tags already point at the apex `squeegeez.ca`. |
| Crawl errors | **You** | Nothing to fix in code today; monitor GSC → Pages after indexing. |
| Site speed | ✅ Mostly | Next.js static-renders every page; JS payload is small (~88–97 kB first load). *Optional:* swap the gallery `<img>` tags for `next/image` for lazy-loading + width/height (reduces CLS). Add a real `public/our-story.jpg` (currently a placeholder). |
| Broken internal/external links | ✅ **Checked** | Internal links all resolve (`/`, `/services`, `/services/[slug]`, `/contact`). Old `/projects` 301-redirects to `/services`. No external outbound links to break. |
| HTTP links on HTTPS pages | ✅ **Done** | None found. Image `remotePatterns` are HTTPS-only. |
| SEO-friendly URL structure | ✅ **Done** | Clean, lowercase, hyphenated (`/services/gutter-cleaning`). |
| Schema markup | ✅ **Done** | `LocalBusiness` (HomeAndConstructionBusiness) + `WebSite` site-wide; `Service` + `BreadcrumbList` on each service page. See `lib/seo.ts`. *Next:* add `FAQPage` when the FAQ ships. |
| Page depth | ✅ **Good** | Every page is ≤2 clicks from home. Flat, shallow structure. |
| Redirects (301/302) | ✅ **Done** | `/projects` → `/services` is a permanent **301** (`next.config.mjs`). |

---

## On-Site + Content SEO

| Item | Status | Notes |
|---|---|---|
| Duplicate/missing title tags | ✅ **Done** | Every page has a unique title. Title template appends the brand to child pages; home title set explicitly. |
| Duplicate/missing meta descriptions | ✅ **Done** | Unique, keyword-aware description on every page. |
| Multiple H1 tags | ✅ **Done** | Exactly **one H1 per page** (verified in the rendered DOM). |
| Improve titles/descriptions/content | ✅ Round 1 done | Titles/descriptions rewritten around the keyword map. Content is solid; biggest gains now are an **FAQ** and **real photos/reviews**. |
| Content audit / prune | ✅ **Done** | Small site, no thin/low-value pages. Reviews section is intentionally hidden until real reviews exist. |
| Alt tags on images | ✅ **Done** | All images have alt text (logo, gallery, before/after, story). Gallery alts come from the project name. |
| Internal linking | ✅ **Good** | Header, footer, in-body CTAs, and service→contact links all present. *Optional:* link between related service pages. |
| Keyword cannibalization | ✅ **Handled** | Keyword map gives each page a distinct primary term (see `seo-keyword-research.md`). Watch that home vs `/services` stay differentiated. |
| Content still relevant | ✅ | Copy is current (services, areas, WorkSafe BC, 10+ yrs). Update the footer year logic and add reviews when available. |

---

## What I changed in the code (this pass)
- `app/sitemap.ts`, `app/robots.ts` — sitemap + robots (dynamic; sitemap includes service pages).
- `lib/seo.ts` — central domain + business config + JSON-LD builders.
- `app/layout.tsx` — `metadataBase`, canonical, robots, richer OpenGraph/Twitter, verification hooks, site-wide `LocalBusiness` + `WebSite` schema.
- `app/page.tsx`, `app/services/page.tsx`, `app/contact/page.tsx`, `app/services/[slug]/page.tsx` — per-page canonicals + keyword-tuned titles/descriptions; `Service` + `BreadcrumbList` schema on service pages.
- `app/admin/layout.tsx` — `noindex, nofollow` on the admin area.
- `lib/supabaseBrowser.ts` — build fix (guards missing Supabase keys).

## Top priorities for you (highest impact first)
1. **Google Business Profile** — the single biggest local-SEO lever. Claim/verify it, pick categories (Window Cleaning Service, Gutter Cleaning Service, Pressure Washing), add photos, and start collecting reviews.
2. **Verify GSC + Bing**, submit the sitemap, request indexing.
3. **Pick the canonical domain** in Vercel and 301 the other variant.
4. **Add an FAQ + real photos/reviews** (feeds `FAQPage`/`Review` schema and matches ranking competitors).
