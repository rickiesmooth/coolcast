const path = require('path')
const webpack = require('webpack')
const outputPath = path.join(__dirname, '/public')

const babelLoaderConfiguration = {
  test: /\.js$/,
  include: [
    path.resolve(__dirname, '../src'),
    path.resolve(__dirname, '../App'),
    path.resolve(__dirname, '../node_modules/react-native-uncompiled')
  ],
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      cacheDirectory: true,
      plugins: ['transform-decorators-legacy', 'react-native-web/babel'],
      presets: ['react-native']
    }
  }
}

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]'
    }
  }
}

module.exports = {
  entry: ['babel-polyfill', './App.js'],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-navigation': 'react-navigation/lib/react-navigation.js'
    },
    extensions: ['.web.js', '.js']
  }
}
