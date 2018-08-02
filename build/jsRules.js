const { resolve } = require("path");
const tsImportPluginFactory = require("ts-import-plugin");

const jsRules = {
  test: /\.(ts(x?)|js(x?))$/,
  use: [
    {
      loader: "awesome-typescript-loader",
      options: {
        transpileOnly: true,
        useCache: true,
        cacheDirectory: resolve(__dirname, "../.cache-loader"),
        useBabel: true,
        babelOptions: {
          babelrc: false,
          plugins: [
            "transform-class-properties",
            "syntax-dynamic-import",
            "react-hot-loader/babel"
          ]
        },
        getCustomTransformers: () => ({
          before: [
            tsImportPluginFactory({
              libraryDirectory: "lib",
              libraryName: "antd",
              style: "less"
            })
          ]
        })
      }
    }
  ],
  exclude: /node_modules/
};

module.exports = jsRules;
