const { join } = require('path')
const express = require('express')
const app = express()

const stats = {
  colors: true,
  hash: false,
  version: false,
  timings: false,
  assets: false,
  chunks: false,
  modules: false,
  reasons: false,
  children: false,
  source: false,
  errors: false,
  errorDetails: false,
  warnings: false,
  publicPath: false
}

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
  const config = require('./webpack.config.js')
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { serverSideRender: true, noInfo: true, stats }))
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')))
  app.use(webpackHotServerMiddleware(compiler))
} else {
  const CLIENT_ASSETS_DIR = join(__dirname, './dist/client')
  const CLIENT_STATS_PATH = join(CLIENT_ASSETS_DIR, 'stats.json')
  const SERVER_RENDERER_PATH = join(__dirname, './dist/server.js')
  const serverRenderer = require(SERVER_RENDERER_PATH).default
  const stats = require(CLIENT_STATS_PATH)
  app.use(express.static(CLIENT_ASSETS_DIR))
  app.use(serverRenderer(stats))
}

app.listen(6060, () => console.log('Server started: http://localhost:6060/'))
