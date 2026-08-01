import type { MetadataRoute } from 'next';
import { getFolders } from '@/lib/supabase';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
  ];

  // One entry per published service folder (/services/<slug>). Safe with no DB
  // keys: getFolders() returns [] instead of throwing, so the sitemap still builds.
  const folders = await getFolders();
  const serviceRoutes: MetadataRoute.Sitemap = folders.map((f) => ({
    url: `${SITE_URL}/services/${f.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Note: /admin and /admin/dashboard are intentionally excluded (hidden, no-index).
  return [...staticRoutes, ...serviceRoutes];
}
