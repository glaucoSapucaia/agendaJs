const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./frontend/main.js",
  output: {
    path: path.resolve(__dirname, "public", "assets", "js"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        type: "javascript/auto",
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devtool: "source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./frontend/assets/imgs/favicon.ico",
          to: path.resolve(__dirname, "public", "assets", "imgs"),
        },
      ],
    }),
  ],
};
