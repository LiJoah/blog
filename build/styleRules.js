const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const constants = require("./const");
const { resolve } = require("path");

const theme = {
  "primary-color": "#1DA57A"
};

const lessLoader = {
  loader: "less-loader",
  options: {
    javascriptEnabled: true,
    //修改主题变量
    modifyVars: theme
  }
};

const typingsForCssModulesLoader = {
  loader: "typings-for-css-modules-loader",
  options: {
    modules: true,
    namedExport: true,
    camelCase: true,
    localIdentName: "[name]"
  }
};

const cacheLoader = {
  loader: "cache-loader",
  options: {
    // provide a cache directory where cache items should be stored
    cacheDirectory: resolve(__dirname, "../.cache-loader")
  }
};



const styleRules = [
  {
    test: /\.css$/,
    include: [resolve(__dirname, '../node_modules')],
    use: [
      constants.NODE_ENV === "prod" ? MiniCssExtractPlugin.loader : 'style-loader',
      cacheLoader,
      'css-loader',
      'postcss-loader'
    ]
  },

  {
    test: /\.less$/,
    use: [
      constants.NODE_ENV === "prod"
        ? MiniCssExtractPlugin.loader
        : "style-loader",
      typingsForCssModulesLoader,
      // cacheLoader,
      // "css-loader",
      "postcss-loader",
      lessLoader
    ]
  }
];

module.exports = styleRules;
