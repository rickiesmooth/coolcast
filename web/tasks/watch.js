'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./config.json')
const path = require('path')

const dev = require('./bundles').dev

const compiler = webpack(dev)
const options = {
  contentBase: path.resolve(__dirname, '..', config.publicDir),
  historyApiFallback: {
    index: 'index.html'
  },
  hot: true,
  inline: true,
  stats: {
    colors: true
  }
}

WebpackDevServer.addDevServerEntrypoints(dev, options)

const server = new WebpackDevServer(compiler, options)

server.listen(8080, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8080')
})
