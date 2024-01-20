const path = require("path");
const json5 = require("json5");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let htmlPageNames = [
  "stayc1",
  "stayc2",
  "stayc3",
  "stayc4",
  "stayc5",
  "stayc6",
];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    title: `stayc fancams ${name.slice(-1)}`,
    template: `./src/stayc/stayc.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

module.exports = {
  mode: "development",
  entry: {
    stayc1: "./src/stayc/stayc1.js",
    stayc2: "./src/stayc/stayc2.js",
    stayc3: "./src/stayc/stayc3.js",
    stayc4: "./src/stayc/stayc4.js",
    stayc5: "./src/stayc/stayc5.js",
    stayc6: "./src/stayc/stayc6.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "stayc fancams", // this will be the index.html title
      filename: `index.html`,
      template: "./src/index.html",
      inject: false,
    }),
  ].concat(multipleHtmlPlugins),
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.json5$/i,
        type: "json",
        parser: {
          parse: json5.parse,
        },
      },
      { test: /\.txt/, type: "asset/source" },
    ],
  },
};
