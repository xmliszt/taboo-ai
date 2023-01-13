/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  env: {
    OPENAI_API: "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",
  },
};

module.exports = nextConfig;
