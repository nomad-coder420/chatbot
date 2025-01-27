const path = require("path");
const dotenv = require("dotenv");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.config();

module.exports = {
  mode: "development",
  entry: "./src/index.tsx", // Entry point for app
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output file name
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Match .ts and .tsx files
        exclude: /node_modules/,
        use: "ts-loader", // Use ts-loader to handle TypeScript
      },
      {
        test: /\.(js|jsx)$/, // Handle JavaScript and JSX files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // Use Webpack 5 asset module to handle images
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                namedExport: false,
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"), // Path to the HTML template
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(process.env.REACT_APP_GOOGLE_CLIENT_ID),
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL),
    }),
  ],
  devServer: {
    static: "./dist", // Serve files from 'dist'
    port: 3000, // Development server port
    open: true, // Open browser automatically
    historyApiFallback: true, // To handle SPA routing
    compress: true, // Optional: Enables compression for better performance
  },
};
