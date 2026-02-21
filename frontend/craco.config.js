module.exports = {
  babel: {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-proposal-private-methods", { loose: true }],
      ["@babel/plugin-proposal-private-property-in-object", { loose: true }]
    ]
  },
  webpack: {
    configure: (webpackConfig) => {
      // Safely filter plugins
      if (webpackConfig.plugins) {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => plugin && plugin.constructor && plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
        );
      }
      return webpackConfig;
    }
  }
};