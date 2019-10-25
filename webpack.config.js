const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'app/webroot/');
const APP_DIR = path.resolve(__dirname, 'app/src/');

const config = {
  entry: ['@babel/polyfill', `${APP_DIR}/index.js`],
  output: {
    path: `${BUILD_DIR}/js/`,
    filename: 'bundle.js',
  },
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