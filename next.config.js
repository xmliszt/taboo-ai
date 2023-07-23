/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const appSecurityHeaders = [
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
];

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: '/next-sw.js',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['media.theresanaiforthat.com', 'api.producthunt.com'],
    formats: ['image/webp'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: appSecurityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/privacy',
        destination: '/html/privacy.html',
      },
      {
        source: '/cookie-policy',
        destination: '/html/cookie-policy.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/daily-challenge',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/leaderboard',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/recovery',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/404',
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
