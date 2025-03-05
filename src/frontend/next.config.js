/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true  // Принудительно использовать SWC даже при наличии babel.config.js
  },
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'token',
          },
        ],
      },
      {
        source: '/register',
        destination: '/',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'token',
          },
        ],
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 