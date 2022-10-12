const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MyPlugin = require("./plugins/my-plugin");
module.exports = {
  mode: "development",
  entry: {
    index: "./example/entry.js",
  },
  output: {
    path: path.resolve(__dirname, "dist2"),
    filename: "[name].js",
  },
  resolveLoader: {
    alias: {
      "my-loader": path.resolve(__dirname, "loaders/my-loader.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["my-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MyPlugin(),
  ],
};
