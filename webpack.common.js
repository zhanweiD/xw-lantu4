const path = require('path');

module.exports = () => ({
  context: path.resolve(__dirname, './src'),
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.cache/webpack'),
  },
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name].[hash][ext][query]',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
});