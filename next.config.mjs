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
  async rewrites() {
    return [
      {
        source: '/tools/franken-stack',
        destination: '/tools/franken-stack-cost-forecaster',
      },
      {
        source: '/tools/pre-launch-architect',
        destination: '/tools/pre-launch-distribution-architect',
      },
      {
        source: '/tools/geo-schema-generator',
        destination: '/tools/geo-schema-snippet-generator',
      },
      {
        source: '/tools/saas-readiness-grader',
        destination: '/tools/ai-saas-grader',
      },
    ];
  },
};

export default nextConfig;
