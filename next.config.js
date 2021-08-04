// require('dotenv').config({ path: `.env.${process.env.ENV}` });

// const { parsed: myEnv } = require('dotenv').config({
//   path: `.env.${process.env.ENV}`,
// });

const Dotenv = require('dotenv-webpack');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const webpack = require('webpack');

module.exports = withBundleAnalyzer({
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: `.env.${process.env.ENV}`, //path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ];

    // config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
});
