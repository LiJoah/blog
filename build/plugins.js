const webpack = require("webpack");
const { resolve } = require("path");
const config = require("./config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const constants = require("./const");
const { assetsPath } = require("./utils");

const basePlugins = [
  new webpack.WatchIgnorePlugin([/less\.d\.ts$/]),
  new CleanWebpackPlugin([resolve(__dirname, "../dist/")], {
    root: resolve(__dirname, "./../"),
    verbose: true,
    dry: false
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin() // 执行热替换时打印模块名字
];

const devPlugins = [
  new HtmlWebpackPlugin({
    template: resolve(__dirname, "../index.html"),
    inject: true
  })
];

const prodPlugins = [
  new HtmlWebpackPlugin({
    filename: resolve(__dirname, "../dist/index.html"),
    template: resolve(__dirname, "../index.html"),
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
    filename: assetsPath("css/[name].[hash].css"),
    chunkFilename: assetsPath("css/[name].[id].[hash].css")
  })
];

//  用来分析打包模块的大小和体积
if (config.bundleAnalyzerReport) {
  const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
  prodPlugins.push(new BundleAnalyzerPlugin());
}

module.exports = basePlugins.concat(
  constants.NODE_ENV === "prod" ? prodPlugins : devPlugins
);
