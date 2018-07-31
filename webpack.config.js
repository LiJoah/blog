const path = require("path");
const webpack = require("webpack");
const rimraf = require("rimraf");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

rimraf.sync("./dist");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: {
    bundle: path.resolve(__dirname, "src/main.tsx")
  },

  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: path.resolve(__dirname, "dist"),
    filename: process.env.NODE_ENV === "production" ? "[name].[chunkhash:8].js" : "[name].js",
    chunkFilename: process.env.NODE_ENV === "production" ? "[name].[chunkhash:8].chunk.js" : "[name].js",
  },

  devtool: "source-map",

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.(ts(x?)|js(x?))$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              transpileOnly: true,
              useCache: true,
              cacheDirectory: path.resolve(__dirname, ".cache-loader"),
              useBabel: true,
              babelOptions: {
                babelrc: false,
                plugins: ["react-hot-loader/babel"]
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      // {
      //   enforce: "pre",
      //   test: /\.js$/,
      //   loader: "babel-loader",
      //   exclude: /node_modules/
      // },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      },
      {
        test: /\.(jpeg|png|jpg|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      title: "blog",
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      chunksSortMode: "dependency"
    }),
    // new ExtractTextPlugin({ filename: "[name].css", allChunks: true }),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin() // 执行热替换时打印模块名字
  ],

  watch: true,
  target: "web"
  // devServer: {
  //   contentBase: path.join(__dirname, "dist"),
  //   compress: true,
  //   port: 9000,
  //   host: "0.0.0.0",
  //   hot: true
  // }
};
