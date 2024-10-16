module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ignored: [
          "**/node_modules/**",
          "**/build/**",
          "**/dist/**",
          "**/public/**",
          "**/.git/**",
          "**/*.test.js",
          "**/*.spec.js",
          "**/coverage/**",
          "**/docs/**",
          "**/.vscode/**",
          "**/tmp/**",
          "**/webpack-dev-server/**",
          "**/@pmmmwh/**",
          "**/react-refresh/**",
          "**/react-dev-utils/**",
          "**/babel-loader/**",
          "**/webpack/**",
          "**/eslint/**",
          "**/jest/**",
          "**/src/**/*.css",
          "**/src/**/*.scss",
          "**/src/**/*.sass",
          "**/src/**/*.less",
        ],
        aggregateTimeout: 200,
        poll: 1000,
        followSymlinks: false,
      };
      return webpackConfig;
    },
  },
};
