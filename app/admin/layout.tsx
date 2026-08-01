import type { Metadata } from 'next';

// The admin area is private. Keep it out of search indexes entirely.
// (robots.txt also disallows /admin; this meta tag is belt-and-suspenders.)
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
