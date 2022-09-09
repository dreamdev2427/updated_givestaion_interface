const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config, context) => {
  nrwlConfig(config);
  return {
    ...config,
    node: {
      global: true,
    },
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,
              use: [
                "style-loader",
                "css-loader",
                {
                  loader: "sass-loader",
                  options: {
                    // Prefer `dart-sass`
                    implementation: require("sass"),
                  },
                },
              ],
            },
          ],
      },
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify')
      },
    },
    plugins: [...config.plugins, new NodePolyfillPlugin()],
  };
};
