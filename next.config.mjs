/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/articles/[slug]': ['./data/articles/published/**/*'],
  },
  async redirects() {
    return [
      {
        source: '/join-beta',
        destination: '/#founder-form',
        permanent: true,
      },
      {
        source: '/startup-visibility-engine',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
