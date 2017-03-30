var path = require('path');
var webpack = require('webpack')
var libraryName = 'dnd'

module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname,
    filename: "dist/dnd.js",
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
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
