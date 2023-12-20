/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Needed to use inline svg in JSX/TSX
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    // Necessary to import @passes/api-client and @passes/shared-constants
    // https://github.com/vercel/next.js/issues/9474#issuecomment-810212174
    externalDir: true,
  },
};

module.exports = nextConfig;
