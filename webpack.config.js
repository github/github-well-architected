const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  // Load environment variables
  const envVars = dotenv.config().parsed || {};

  const envKeys = {};

  return {
    entry: "./src/js/react/index.tsx",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "static/js"),
    },
    plugins: [new webpack.DefinePlugin(envKeys)],
    devtool: isDevelopment ? "eval-source-map" : false,
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.module\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
                esModule: true,
              },
            },
          ],
        },
        // Regular CSS for everything else (including node_modules)
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
};
