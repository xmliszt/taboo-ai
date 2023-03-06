/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
`;

const appSecurityHeaders = [
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
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
      {
        source: '/api/:path',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://taboo-ai.vercel.app',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
