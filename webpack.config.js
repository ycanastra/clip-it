const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const WebExtWebpackPlugin = require('./web-ext-webpack-plugin/web-ext-webpack-plugin.js');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'browserAction'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new WebExtWebpackPlugin({ sourceDir: __dirname })],
};
