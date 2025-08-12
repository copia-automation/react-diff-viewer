const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FavIconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  entry: {
    main: "./examples/src/index.tsx",
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  resolve: {
    extensions: [".jsx", ".tsx", ".ts", ".scss", ".css", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "examples/dist"),
    filename: "[name].js",
    clean: true, // Cleans the output folder in Webpack 5
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "examples/dist"),
    },
    port: 8000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.examples.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(xml|rjs|java)$/,
        use: "raw-loader",
      },
      {
        test: /\.(svg|png)$/,
        type: "asset/resource", // Replaces file-loader
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./examples/src/index.ejs",
    }),
    new FavIconsWebpackPlugin("./logo-standalone.png"),
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
  ],
};
