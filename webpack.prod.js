const {merge} = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// 静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const common = require('./webpack.common.js')

module.exports = (env) =>
  merge(common(env), {
    mode: 'production',
    cache: {
      buildDependencies: {
        config: [__filename],
      },
    },
    entry: {
      index: './index.js',
    },
    output: {
      filename: '[name].[contenthash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            chunks: 'initial',
            enforce: true,
            filename: 'vendor.bundle.js',
          },
        },
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: false,
          sourceMap: false,
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {},
          }, 'postcss-loader'],
        },
        {
          test: stylusRegex,
          use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {},
          }, 'postcss-loader', 'stylus-loader'],
          include: [path.resolve(__dirname, './src')],
          exclude: [/node_modules/, stylusModuleRegex,],
        },
        {
          test: stylusModuleRegex,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {},
            }, 
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
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: true,
      }),  
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './public'),
          to: path.resolve(__dirname, './dist/public'),
          ignore: ['.*'],
        },
      ]),  
      new CleanWebpackPlugin({
        verbose: true, // 开启在控制台输出信息
        dry: false,
        cleanOnceBeforeBuildPatterns: [path.join(__dirname, `./dist`)]
      })  
    ]
  })