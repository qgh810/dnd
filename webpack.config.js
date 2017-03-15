var path = require('path');
module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname,
    filename: "dist/draggable.js"
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
  }
}
