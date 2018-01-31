var path = require("path")
var webpack = require("webpack")
var nodeExternals = require("webpack-node-externals")

module.exports = {
  target: "node",

  externals: [nodeExternals()],

  entry: {
    index: ["./src/index.js"]
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "podcloud-feeds.js"
  },

  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DIST: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  }
}
