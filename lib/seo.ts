// ============================================================
// Central SEO / business config — single source of truth.
// Used by metadata, sitemap.ts, robots.ts and JSON-LD schema.
// Override the domain with NEXT_PUBLIC_SITE_URL in Vercel if it ever changes.
// ============================================================

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://squeegeez.ca'
).replace(/\/$/, '');

// ---- Business NAP (Name / Address / Phone) ----
export const BUSINESS = {
  name: 'Squeegeez Window & Exterior Care',
  shortName: 'Squeegeez',
  phoneDisplay: '(250) 784-8588',
  phoneE164: '+12507848588',
  email: 'contact@squeegeez.ca',
  city: 'Castlegar',
  region: 'BC',
  country: 'CA',
  // City-level coordinates for Castlegar, BC (public geodata).
  geo: { latitude: 49.3237, longitude: -117.6594 },
} as const;

// Towns the business serves — kept in sync with the home/footer lists.
export const SERVICE_AREAS = [
  'Castlegar', 'Trail', 'Nelson', 'Fruitvale', 'Montrose', 'Rossland',
  'Warfield', 'Slocan', 'Salmo', 'Creston', 'Grand Forks', 'Kaslo', 'Silverton',
];

const CORE_SERVICES = [
  'Residential window cleaning',
  'Commercial window cleaning',
  'Window track and screen cleaning',
  'Gutter cleaning',
  'Pressure washing',
];

// ---- LocalBusiness JSON-LD (site-wide, rendered in the root layout) ----
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS.name,
    url: SITE_URL,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: SERVICE_AREAS.map((name) => ({ '@type': 'City', name })),
    knowsAbout: CORE_SERVICES,
  };
}

// ---- WebSite JSON-LD (helps establish the canonical site name) ----
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    publisher: { '@id': `${SITE_URL}/#business` },
  };
}

// ---- Per-service Service + Breadcrumb JSON-LD (service detail pages) ----
export function serviceJsonLd(opts: { name: string; slug: string; description?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description || `${opts.name} across the West Kootenays, BC.`,
    serviceType: opts.name,
    url: `${SITE_URL}/services/${opts.slug}`,
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: SERVICE_AREAS.map((name) => ({ '@type': 'City', name })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
