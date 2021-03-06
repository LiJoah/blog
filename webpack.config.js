const { resolve, join } = require("path");
const jsRules = require("./build/jsRules");
const styleRules = require("./build/styleRules");
const plugins = require("./build/plugins");
const fileRules = require("./build/fileRules");
const config = require("./build/config");
const { assetsPath } = require("./build/utils");
const constants = require("./build/const");
const optimization = require("./build/optimization");

module.exports = {
  mode: constants.NODE_ENV === "prod" ? "production" : "development",
  entry: {
    main: ["babel-polyfill", resolve(__dirname, "src/main.tsx")]
  },
  output: {
    path: resolve(__dirname, "dist/"),
    publicPath: config.assetsPublicPath,
    filename:
      constants.NODE_ENV === "prod"
        ? assetsPath("js/[name].[hash:8].js")
        : "[name].js",
    chunkFilename:
      constants.NODE_ENV === "prod"
        ? assetsPath("js/[name].[id].[chunkhash:8].chunk.js")
        : "[name].js"
  },

  devtool: "source-map",

  resolve: {
    modules: [resolve(__dirname, "src"), "node_modules"],
    alias: {
      "@base": resolve(__dirname, "src/base"),
      "@helpers": resolve(__dirname, "src/helpers"),
      "@store": resolve(__dirname, "src/store")
    },
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [jsRules, ...styleRules, ...fileRules]
  },

  plugins,

  optimization,

  watch: constants.NODE_ENV === "prod" ? false : true,
  target: "web",
  stats: {
    errors: true
  },

  devServer: {
    // open: true,
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true
  }
};
