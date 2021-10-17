// @ts-check
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { i18n } = require("./next-i18next.config");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // https://dev.to/chromygabor/add-typescript-type-check-to-next-js-2nbb
  webpack(config, options) {
    const { dev, isServer } = options;

    // Do not run type checking twice:
    if (dev && isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    return config;
  },
  i18n,
};

module.exports = nextConfig;
