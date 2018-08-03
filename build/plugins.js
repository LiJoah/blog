const webpack = require("webpack");
const { resolve } = require("path");
const config = require("./config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const constants = require("./const");
const { CheckerPlugin } = require("awesome-typescript-loader");

const basePlugins = [
  new CheckerPlugin(),
  new webpack.WatchIgnorePlugin([/ess\.d\.ts$/])
];

const devPlugins = [
  new HtmlWebpackPlugin({
    template: resolve(__dirname, "../index.html"),
    inject: true
  })
];

const prodPlugins = [
  new HtmlWebpackPlugin({
    filename: resolve(__dirname, "dist/index.html"),
    template: resolve(__dirname, "index.html"),
    title: "blog",
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    chunksSortMode: "dependency"
  }),
  // 提取 css 到文件的插件
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "static/css/[name].[hash].css",
    chunkFilename: "static/css/[name].[id].[hash].css"
  })
];

const plugins = [
  new CleanWebpackPlugin(["dist"]),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin() // 执行热替换时打印模块名字
];

//  用来分析打包模块的大小和体积
if (config.bundleAnalyzerReport) {
  const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
  prodPlugins.push(new BundleAnalyzerPlugin());
}

module.exports =
  constants.NODE_ENV === "prod"
    ? plugins.concat(prodPlugins, basePlugins)
    : plugins.concat(devPlugins, basePlugins);
