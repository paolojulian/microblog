const path = require('path');
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const BUILD_DIR = path.resolve(__dirname, 'app/webroot/');
const APP_DIR = path.resolve(__dirname, 'app/src/');

const config = {
  entry: ['@babel/polyfill', `${APP_DIR}/index.js`],
  output: {
    path: `${BUILD_DIR}/js/`,
    chunkFilename: '[name].bundle.min.js',
    filename: 'bundle.min.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: APP_DIR,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
       {
        test: /\.css$/,
        use: [
          // style-loader
          { loader: 'style-loader' },
          // css-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
        ]
      },
      // { test: /\.css$/, use: 'css-loader' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    ],
  },
};

module.exports = config;