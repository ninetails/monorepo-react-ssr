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
  throw new Error('@todo')
}

app.listen(6060, () => console.log('Server started: http://localhost:6060/'))
