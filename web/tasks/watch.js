'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./config.json')
const path = require('path')

const dev = require('./bundles').dev

const compiler = webpack(dev)

const devServerOptions = Object.assign(
  {},
  {
    contentBase: path.resolve(__dirname, '..', config.publicDir),
    historyApiFallback: {
      index: 'index.dev.html'
    }
  },
  {
    index: 'index.dev.html',
    stats: {
      colors: true
    },
    before(app) {
      app.use((req, res, next) => {
        console.log(`Using middleware for ${req.url}`)
        next()
      })
    }
  }
)
const server = new WebpackDevServer(compiler, devServerOptions)

server.listen(8080, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8080')
})
