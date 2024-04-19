const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    login: './src/scripts/login.ts',
    tour: './src/scripts/tour.ts',
    account: './src/scripts/account.ts',
    index: './src/scripts/index.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  // node: {
  //   __dirname: true,
  //   __filename: true,
  // },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {},
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
