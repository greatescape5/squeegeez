import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin', // keep the hidden admin area out of search results
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
