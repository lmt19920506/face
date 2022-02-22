'use strict';

const path = require('path')
const webpack = require('webpack');
// css压缩插件
const css = require('optimize-css-assets-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', 'css-loader', 'less-loader', {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require('cssnano')
    // })
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src/index.html'),
    //   filename: 'index.html',
    //   chunks: ['index'],
    //   inject: true,
    //   minify: {
    //   html5: true,
    //   collapseWhitespace: true,
    //   preserveLineBreaks: false,
    //   minifyCSS: true,
    //   minifyJS: true,
    //   removeComments: false
    //   }
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src/search.html'),
    //   filename: 'search.html',
    //   chunks: ['search'],
    //   inject: true,
    //   minify: {
    //   html5: true,
    //   collapseWhitespace: true,
    //   preserveLineBreaks: false,
    //   minifyCSS: true,
    //   minifyJS: true,
    //   removeComments: false
    //   }
    // })
    new CleanWebpackPlugin()
  ]
}