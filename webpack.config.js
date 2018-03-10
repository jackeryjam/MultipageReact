const webpack = require('webpack')
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");     

var getEntry = function(globPath) {
  var entries = {};
  glob.sync(globPath).forEach(function(entry) {
      var pathname = entry.split('/').splice(-1).join('/').split('.')[0];
      entries[pathname] = [entry];
  });
  return entries;
};

var entries = getEntry('./src/pages/*.js');
var chunks = Object.keys(entries);

const config = {
  entry:  entries,
  output: {
    path: path.resolve(__dirname, 'publish'),
    filename: "js/[name].js"
  },
  module: {
    rules: [
      {
          test: /\.js|jsx$/,
          loader: 'babel-loader'
      },
      {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
      }
    ]
  },
  plugins: [
      new ExtractTextPlugin("css/[name].css"),
    ]
};


// 生成HTML文件
chunks.forEach(function(pathname) {
  var conf = {
      title: 'My App',
      filename: 'html/' + pathname + '.html',
      template: 'index.html',
      inject: 'body',
      minify: {
          removeComments: true,
          collapseWhitespace: false
      }
  };
  if (pathname in config.entry) {
      conf.chunks = [pathname];
      conf.hash = false;
  }
  config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;
