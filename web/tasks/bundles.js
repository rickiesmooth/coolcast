const fs = require('fs-extra')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const NameAllModulesPlugin = require('name-all-modules-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const config = require('./config.json')

let revisionedAssetManifest =
  fs.readJsonSync(
    path.resolve('web', config.publicDir, config.manifestFileName),
    {
      throws: false
    }
  ) || {}

const webpack = require('webpack')

const configureBabelLoader = browserlist => {
  return {
    test: /\.js$/,
    include: [
      path.resolve(__dirname, '../../src'),
      path.resolve(__dirname, '../../App')
    ],
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        cacheDirectory: true,
        presets: [
          [
            'env',
            {
              debug: true,
              modules: false,
              useBuiltIns: false,
              targets: {
                browsers: browserlist
              }
            }
          ],
          'react-native'
        ],
        plugins: ['transform-decorators-legacy']
      }
    }
  }
}

const baseConfig = {
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-navigation': 'react-navigation/lib/react-navigation.js'
    },
    extensions: ['.web.js', '.js']
  },
  entry: {
    main: ['regenerator-runtime/runtime', './App.js']
  },
  module: {
    rules: [
      configureBabelLoader([
        // The last two versions of each browser, excluding versions
        // that don't support <script type="module">.
        'last 2 Chrome versions',
        'not Chrome < 60'
      ])
    ]
  }
}

module.exports = {
  //plugins
  dev: Object.assign({}, baseConfig, {
    entry: {
      main: baseConfig.entry.main.concat([
        'webpack/hot/dev-server',
        'webpack-dev-server/client?'
      ])
    },
    devtool: 'source-map',
    output: {
      path: path.resolve('web', config.publicDir),
      publicPath: '/',
      filename: '[name].bundle.js'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          API_URL: JSON.stringify(process.env.API_URL)
        }
      })
    ]
  }),
  prod: Object.assign({}, baseConfig, {
    output: {
      path: path.resolve('web', config.publicDir),
      publicPath: '/',
      filename: '[name]-[chunkhash:10].js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new UglifyJSPlugin({
        uglifyOptions: {
          mangle: {
            // Works around a Safari 10 bug:
            // https://github.com/mishoo/UglifyJS2/issues/1753
            safari10: true
          }
        }
      }),

      new webpack.NamedModulesPlugin(),

      new webpack.NamedChunksPlugin(
        chunk =>
          chunk.name
            ? chunk.name
            : md5(chunk.mapModules(m => m.identifier()).join()).slice(0, 10)
      ),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      }),

      new NameAllModulesPlugin(),

      new ManifestPlugin({
        fileName: config.manifestFileName,
        seed: revisionedAssetManifest
      })
    ]
  })
}

// /main-113080cbe2.js
