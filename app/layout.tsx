import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Analytics from '@/components/Analytics';
import { SITE_URL, BUSINESS, localBusinessJsonLd, websiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  // metadataBase makes every canonical + OG/Twitter URL absolute.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Squeegeez Window & Exterior Care | Castlegar, BC',
    // Child pages set their own title; it slots into this template.
    template: '%s | Squeegeez Window & Exterior Care',
  },
  description:
    'Professional window washing, pressure washing, and gutter cleaning for homes and businesses across Castlegar, Nelson, Trail and the Kootenays. Get a free estimate today.',
  applicationName: BUSINESS.name,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  // Search-engine ownership verification. Paste the codes as env vars in Vercel
  // (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION / NEXT_PUBLIC_BING_SITE_VERIFICATION)
  // and redeploy — the <meta> tags appear automatically, no code change needed.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },
  openGraph: {
    title: 'Squeegeez Window & Exterior Care',
    description:
      'Crystal clear windows, every time. Serving Castlegar and the Kootenays.',
    url: SITE_URL,
    siteName: BUSINESS.name,
    locale: 'en_CA',
    type: 'website',
    images: [{ url: '/logo.jpg', width: 512, height: 512, alt: BUSINESS.name }],
  },
  twitter: {
    card: 'summary',
    title: 'Squeegeez Window & Exterior Care',
    description:
      'Crystal clear windows, every time. Serving Castlegar and the Kootenays.',
    images: ['/logo.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Site-wide structured data: LocalBusiness + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
