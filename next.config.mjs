/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow gallery images served from Supabase Storage and placeholders.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async redirects() {
    return [
      // The old Projects page is now Services.
      { source: '/projects', destination: '/services', permanent: true },
    ];
  },
};

export default nextConfig;
