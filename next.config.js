const withNextIntl = require("next-intl/plugin")("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  // Other Next.js configuration ...
});

module.exports = nextConfig;
