const path = require("path");
const json5 = require("json5");

module.exports = {
  entry: "./src/script.js",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "dist"),
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
