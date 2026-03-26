/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/articles/[slug]': ['./data/articles/published/**/*'],
  },
};

export default nextConfig;
