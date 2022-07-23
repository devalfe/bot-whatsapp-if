'use strict';

const path = require('path');

const PATHS = {
  app: path.join(__dirname, './'),
  public: path.join(__dirname, 'public')
};

module.exports = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.public,
    filename: 'js/bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts/'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/img/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // plugins
  ]
};
