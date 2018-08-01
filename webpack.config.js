const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "prod" ? "production" : "development",
  entry: {
    main: ["babel-polyfill", path.resolve(__dirname, "src/main.tsx")]
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: path.resolve(__dirname, "dist"),
    filename:
      process.env.NODE_ENV === "prod"
        ? "static/js/[name].[chunkhash:8].js"
        : "[name].js",
    chunkFilename:
      process.env.NODE_ENV === "prod"
        ? "static/js/[name].[chunkhash:8].chunk.js"
        : "[name].js"
  },

  devtool: "source-map",

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      "@base": path.resolve(__dirname, "src/base")
    },
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
                plugins: [
                  "transform-class-properties",
                  "syntax-dynamic-import",
                  "react-hot-loader/babel"
                ]
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === "prod"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.(jpeg|png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "static/imgs/[name].[hash:7].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: "static/fonts/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.svg$/,
        loader: "@svgr/webpack",
        include: [path.resolve(__dirname, "src")]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, "dist/index.html"),
      template: path.resolve(__dirname, "index.html"),
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "static/css/[name].[hash].css",
      chunkFilename: "static/css/[name].[id].[hash].css"
    })
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin() // 执行热替换时打印模块名字
  ],

  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
        // sourceMap: config.sourceMap
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
          reduceIdents: false,
          autoprefixer: false
        }
      })
    ]
  },

  watch: true,
  target: "web",

  devServer: {
    open: true,
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot: true
  }
};
