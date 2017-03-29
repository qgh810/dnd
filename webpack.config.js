var path = require('path');
var webpack = require('webpack')
var libraryName = 'draggable'
module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname,
    filename: "dist/draggable.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false,  // remove all comments
    //   },
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
}
