const path = require("path");
const glob = require("fast-glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const SiblingChunksOnlyPlugin = require("./SiblingChunksOnlyPlugin");

/** @return {import('webpack').Configuration} */
function configurator() {
  const entries = glob.sync("src/*-trees/*.ts");

  return {
    mode: process.env.NODE_ENV === "development" ? "development" : "production",
    entry: entries.reduce(
      (entries, path) => ({
        ...entries,
        [/(\w+)-trees/.exec(path)[1]]: `./${path}`
      }),
      {}
    ),
    output: {
      filename: "js/[name].bundle.[contenthash].js",
      path: path.resolve(__dirname, ".build"),
      publicPath: "/"
    },
    /* == OPTIMIZATION ====================================================== */
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 1
      }
    },
    /* == LOADERS =========================================================== */
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader" },
        { test: /\.pug$/, use: "pug-loader" }
      ]
    },
    /* == PLUGINS =========================================================== */
    plugins: [
      new BundleAnalyzer({
        analyzerMode: "disabled",
        generateStatsFile: true
      }),
      // new StatsWriter(),
      new HtmlWebpackPlugin({
        template: "./src/oak-trees/index.pug",
        filename: "oak-trees/index.html",
        chunks: "oak"
      }),
      new HtmlWebpackPlugin({
        template: "./src/palm-trees/index.pug",
        filename: "palm-trees/index.html",
        chunks: "palm"
      }),
      new SiblingChunksOnlyPlugin()
    ],
    /* == ALIASES =========================================================== */
    resolve: {
      alias: {
        /** @note Use capital letters because `npm` cannot */
        Shared: path.resolve(__dirname, "src/shared")
      }
    },
    /* == DEV SERVER ======================================================== */
    devServer: {
      contentBase: path.join(__dirname, ".build"),
      compress: true,
      port: 9000
    }
  };
}

module.exports = configurator;
