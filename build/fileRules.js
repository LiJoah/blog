const { assetsPath } = require("./utils");
const { resolve } = require("path");

const fileRules = [
  {
    test: /\.(jpeg|png|jpg|gif)$/,
    use: [
      {
        loader: "url-loader",
        options: {
          limit: 10000,
          name: assetsPath("imgs/[name].[hash:7].[ext]")
        }
      }
    ]
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: "url-loader",
    query: {
      limit: 10000,
      name: assetsPath("fonts/[name].[hash:7].[ext]")
    }
  },
  {
    test: /\.svg$/,
    loader: "@svgr/webpack",
    include: [resolve(__dirname, "src")]
  }
];

module.exports = fileRules;
