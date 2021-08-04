// require('dotenv').config({ path: `.env.${process.env.ENV}` });

const { parsed: myEnv } = require('dotenv').config({
  path: `.env.${process.env.ENV}`,
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const webpack = require('webpack');

module.exports = withBundleAnalyzer({
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
});
