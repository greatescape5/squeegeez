import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'Squeegeez Window & Exterior Care | Castlegar, BC',
  description:
    'Professional window washing, pressure washing, and gutter cleaning for homes and businesses across Castlegar, Nelson, Trail and the Kootenays. Get a free estimate today.',
  openGraph: {
    title: 'Squeegeez Window & Exterior Care',
    description:
      'Crystal clear windows, every time. Serving Castlegar and the Kootenays.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
