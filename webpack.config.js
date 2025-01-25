const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // Change to 'production' for production builds
  entry: "./src/index.tsx", // Entry point for your app
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output file name
    publicPath: "/public",
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
    extensions: [".ts", ".tsx", ".js", ".jsx"], // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"), // Path to the HTML template
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
