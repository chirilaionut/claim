require('dotenv').config({ path: `.env.${process.env.ENV}` });

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const webpack = require('webpack');
const { i18n } = require('./next-i18next.config');

module.exports = withBundleAnalyzer({
  i18n,
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
});
