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
  disable: process.env.NODE_ENV !== 'production',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'media.theresanaiforthat.com',
      'api.producthunt.com',
      'i.ibb.co',
      'media.giphy.com',
      'github.com',
      'aibrb.com',
    ],
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
      {
        source: '/sitemap.txt',
        destination: '/api/sitemap?type=txt',
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withPWA(nextConfig));
