const { readFileSync } = require('fs')
const { join } = require('path')
const express = require('express')
const { createServer } = require('spdy')
const { keygen } = require('tls-keygen')
const pino = require('@ninetails-monorepo-react-ssr/logger')
const serverLogger = require('@ninetails-monorepo-react-ssr/logger/express')

const logger = pino.child({ env: process.env.NODE_ENV, server: true })

const app = express()

function formatLog (res) {
  const {
    statusCode,
    statusMessage,
    req: {
      id,
      isSpdy,
      httpVersion,
      url,
      originalUrl,
      baseUrl,
      params,
      query,
      headers,
      rawHeaders
    }
  } = res

  return {
    statusCode,
    statusMessage,
    url,
    originalUrl,
    data: {
      id,
      httpVersion,
      isSpdy,
      baseUrl,
      params,
      query,
      headers,
      rawHeaders,
      responseHeaders: res.getHeaders
    }
  }
}

app.use(serverLogger({ logger }))
app.use((req, res, next) => {
  res.on('finish', () => logger.info(formatLog(res), 'request done'))
  res.on('close', () => logger.info(formatLog(res), 'request closed'))
  res.on('error', () => logger.error(formatLog(res), 'request error'))

  next()
})

const PORT = process.env.PORT || 3000

module.exports = function run ({ config, stats }) {
  if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
    const compiler = webpack(config)

    app.use(express.static(join(process.cwd(), 'public')))
    app.use(
      webpackDevMiddleware(compiler, {
        logger,
        serverSideRender: true,
        noInfo: true,
        stats
      })
    )
    app.use(
      webpackHotMiddleware(
        compiler.compilers.find(compiler => compiler.name === 'client'),
        {
          log: logger.info.bind(logger)
        }
      )
    )
    app.use(webpackHotServerMiddleware(compiler))
  } else {
    const CLIENT_ASSETS_DIR = join(process.cwd(), './dist/client')
    const CLIENT_STATS_PATH = join(CLIENT_ASSETS_DIR, 'stats.json')
    const SERVER_RENDERER_PATH = join(process.cwd(), './dist/server.js')
    const { default: serverRenderer } = require(SERVER_RENDERER_PATH)
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

  return Promise.resolve({ key: process.env.KEY, cert: process.env.CERT })
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
    .then(() => logger.info(`Server started: https://localhost:${PORT}/`))
    .catch(error => {
      console.error(error)
      return process.exit(1)
    })
}
