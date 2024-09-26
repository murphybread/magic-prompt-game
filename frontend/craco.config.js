module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/build/**',
          '**/dist/**',
          '**/public/**',
          '**/.git/**',
          '**/*.test.js',
          '**/*.spec.js',
        ],
        aggregateTimeout: 300,
        poll: 1000,
      };
      return webpackConfig;
    },
  },
};
