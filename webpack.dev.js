const path = require('path')
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const common = require('./webpack.common.js')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const open = require('opn')
const chalk = require('chalk')
const ip = require('ip').address()
const stylusRegex = /\.styl$/
const stylusModuleRegex = /\.module\.styl$/

module.exports = env =>
  merge(common(env), {
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: './index.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: stylusRegex,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader'],
          include: [path.resolve(__dirname, './src')],
          exclude: [/node_modules/, stylusModuleRegex,],
        },
        {
          test: stylusModuleRegex,
          use: ['style-loader',
            { 
              loader: 'css-loader',
              options:{
                importLoaders: 2,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
            },
            'postcss-loader',
            'stylus-loader',
          ],
          include: [path.resolve(__dirname, './src')],
          exclude: /node_modules/,
        },
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
      new HTMLPlugin({
        template: path.join(__dirname, './public/index.html'),
      }),
    ],
    devServer: {
      port: 3000,
      host: ip,
      hot: true,
      compress: true,
      historyApiFallback: true,
      overlay:true,
      quiet: true,
      clientLogLevel: 'silent',
      after() {
        open(`http://${ip}:${this.port}`)
        .then(() => {
          console.log(chalk.cyan(`成功打开链接： http://${ip}:${this.port}`))
        })
        .catch(err => {
          console.log(chalk.red(err));
        })
    }
    },
  })
