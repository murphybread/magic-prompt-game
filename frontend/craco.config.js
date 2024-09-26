module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ignored: /node_modules/,
      };
      return webpackConfig;
    },
  },
};
