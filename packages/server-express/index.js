const { readFileSync } = require('fs')
const { join } = require('path')
const express = require('express')
const { createServer } = require('spdy')
const { keygen } = require('tls-keygen')

const app = express()

const PORT = process.env.PORT || 3000

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

  app.use(express.static('./public'))
  app.use(
    webpackDevMiddleware(compiler, {
      serverSideRender: true,
      noInfo: true,
      stats
    })
  )
  app.use(
    webpackHotMiddleware(
      compiler.compilers.find(compiler => compiler.name === 'client')
    )
  )
  app.use(webpackHotServerMiddleware(compiler))
} else {
  const CLIENT_ASSETS_DIR = join(__dirname, './dist/client')
  const CLIENT_STATS_PATH = join(CLIENT_ASSETS_DIR, 'stats.json')
  const SERVER_RENDERER_PATH = join(__dirname, './dist/server.js')
  const serverRenderer = require(SERVER_RENDERER_PATH).default
  const clientStats = require(CLIENT_STATS_PATH)

  app.use(express.static(CLIENT_ASSETS_DIR))
  app.use(serverRenderer({ clientStats }))
}

const promisifiedCreateServer = (server, port) => opts => {
  return new Promise((resolve, reject) => {
    return createServer(opts, server).listen(port, error => {
      if (error) {
        reject(error)
      }

      resolve()
    })
  })
}

Promise.resolve({ key: process.env.KEY, cert: process.env.CERT })
  .then(({ key, cert }) => {
    if (key && cert) {
      return { key: join(process.cwd(), key), cert: join(process.cwd(), cert) }
    }

    return keygen({
      key: join(__dirname, 'certificates', 'localhost.key'),
      cert: join(__dirname, 'certificates', 'localhost.crt')
    })
  })
  .then(({ key, cert }) => ({
    key: readFileSync(key),
    cert: readFileSync(cert)
  }))
  .then(promisifiedCreateServer(app, PORT))
  .then(() => console.log(`Server started: https://localhost:${PORT}/`))
  .catch(error => {
    console.error(error)
    return process.exit(1)
  })
